import assert from 'assert'
import { Request, Response } from 'express'
import { Commands, Connectors, getNewJupiterAddress } from 'fndr'
import fs from 'fs'
import { getConfigOptions } from '../libs/Jupiter'

const jupConnector = Connectors.jupiter

export default {
  verb: 'all',
  path: '/',
  formidable: true,

  async handler(req: Request & IStringMap, res: Response) {
    try {
      let accounts
      let configOptions

      if (req.session && req.session.jupiterServer) {
        const configJson = JSON.stringify(req.session)

        // TODO: check fndrAccount balance and fund it, if needed

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
        accounts = filteredMatches.map((m: IStringMap) => ({
          ...m,
          password: undefined,
        }))
      } else {
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

      const hasFieldError = req.query.error === 'fields'

      res.render('index', {
        hasFieldError,
        configOptions,
        accounts,
      })
    } catch (err) {
      res.status(500).send(`${err.name} - ${err.message} - ${err.stack}`)
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
