import assert from 'assert'
import { Request, Response } from 'express'
import { Commands, Connectors } from 'fndr'
import { IRouteOpts, IRoute, baselineTemplateConfig } from './'
import { getAccounts } from './home'

const jupConnector = Connectors.jupiter

export default function({ log, redis }: IRouteOpts): IRoute {
  return {
    verb: 'get',
    path: '/show/:uuid',
    formidable: false,

    async handler(req: Request & IStringMap, res: Response) {
      try {
        const configJson = JSON.stringify(req.session)
        if (!(req.session && req.session.jupiterServer))
          return res.redirect('/')

        const { uuid } = req.params
        const { query, password } = req.query
        const shouldShowPassword = !!password && password !== 'false'

        // TODO: check fndrAccount balance and fund it, if needed

        const showCommand = Commands.find((c) => {
          const f = c(jupConnector)
          if (!f) return false
          return f.name === 'show'
        })
        assert(showCommand, 'show command was not found')

        const [filteredMatches, account] = await Promise.all([
          getAccounts(redis, req.session, query as string),
          showCommand(jupConnector).execute(configJson, {
            id: uuid,
            password: shouldShowPassword,
          }),
        ])

        if (!account) return res.redirect('/')

        const accounts = filteredMatches.map((m: IStringMap) => ({
          ...m,
          password: undefined,
        }))

        res.render('index', {
          accounts,
          selectedAccount: { ...account, shouldShowPassword },
          ...baselineTemplateConfig(req),
        })
      } catch (err) {
        // res.status(500).send(`${err.name} - ${err.message} - ${err.stack}`)
        log.error(`${err.name} - ${err.message} - ${err.stack}`)
        res.redirect('/')
      }
    },
  }
}
