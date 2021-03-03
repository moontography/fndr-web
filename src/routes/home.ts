import assert from 'assert'
import { Request, Response } from 'express'
import { Commands, Connectors, getNewJupiterAddress } from 'fndr'
import fs from 'fs'
import { Redis } from 'ioredis'
import { IRouteOpts, IRoute, baselineTemplateConfig } from './'
import { getConfigOptions } from '../libs/Jupiter'

const jupConnector = Connectors.jupiter

export default function({ log, redis }: IRouteOpts): IRoute {
  return {
    verb: 'all',
    path: '/',
    formidable: true,

    async handler(req: Request & IStringMap, res: Response) {
      try {
        const { add: didAddAccount, error, query } = req.query
        let accounts
        let configOptions

        if (req.session && req.session.jupiterServer) {
          // TODO: check fndrAccount balance and fund it, if needed

          accounts = await getAccounts(redis, req.session, query as string)
        } else {
          // User uploaded a JSON config file from `fndr` CLI
          if (req.files && req.files.file) {
            const { path: jsonPath } = req.files.file as any
            const confJson = await fs.promises.readFile(jsonPath, 'utf-8')
            let newConf
            try {
              newConf = JSON.parse(confJson)
              configOptions = getConfigOptions(newConf)
            } catch (err) {
              configOptions = await defaultConfOptions()
            }
          } else {
            configOptions = await defaultConfOptions()
          }
        }

        const hasFieldError = error === 'fields'

        res.render('index', {
          didAddAccount: didAddAccount === 'true',
          hasFieldError,
          configOptions,
          accounts,
          ...baselineTemplateConfig(req),
        })
      } catch (err) {
        // res.status(500).send(`${err.name} - ${err.message} - ${err.stack}`)
        log.error(`${err.name} - ${err.message} - ${err.stack}`)
        res.redirect('/')
      }
    },
  }

  async function defaultConfOptions() {
    const {
      address,
      publicKey,
      account,
      newSecretPhrase,
    } = await getNewJupiterAddress({
      jupiterServer: `https://jpr.gojupiter.tech`,
    })
    return getConfigOptions({
      fndrAddress: address,
      fndrPublicKey: publicKey,
      fndrAccount: account,
      newSecretPhrase,
    })
  }
}

export async function getAccounts(
  redis: Redis,
  config: IStringMap,
  query?: string
) {
  const configJson = JSON.stringify(config)
  const cacheKey = `accounts_cache_${config.fndrAddress}_${query || ''}`
  const cachedAccounts = await redis.get(cacheKey)
  if (cachedAccounts) return JSON.parse(cachedAccounts)

  const searchCommand = Commands.find((c) => {
    const f = c(jupConnector)
    if (!f) return false
    return f.name === 'search'
  })
  assert(searchCommand, 'search command was not found')
  const [filteredMatches /* , allAccounts */] = await searchCommand(
    jupConnector
  ).execute(configJson, {
    query: null,
  })
  const finalAccounts = filteredMatches.map((m: IStringMap) => ({
    ...m,
    password: undefined,
  }))

  await redis.set(cacheKey, JSON.stringify(finalAccounts), 'EX', '45')
  return finalAccounts
}
