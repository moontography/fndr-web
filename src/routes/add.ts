import assert from 'assert'
import { Request, Response } from 'express'
import { Commands, Connectors } from 'fndr'
import { IRouteOpts, IRoute, baselineTemplateConfig } from './'
// import config from '../config'

const jupConnector = Connectors.jupiter

export default function({ log }: IRouteOpts): IRoute {
  return {
    verb: 'all',
    path: ['/add', '/update/:id'],
    formidable: false,

    async handler(req: Request & IStringMap, res: Response) {
      try {
        const configJson = JSON.stringify(req.session)
        const accountId = req.params.id

        if (req.method.toLowerCase() === 'post') {
          const addCommand = Commands.find((c) => {
            const f = c(jupConnector)
            if (!f) return false
            return f.name === 'add'
          })
          assert(addCommand, 'add command was not found')

          await addCommand(jupConnector).execute(configJson, req.body)
          return res.redirect('/?add=true')
        }

        let account = null
        if (accountId) {
          const showCommand = Commands.find((c) => {
            const f = c(jupConnector)
            if (!f) return false
            return f.name === 'show'
          })
          assert(showCommand, 'show command was not found')

          account = await showCommand(jupConnector).execute(configJson, {
            id: accountId,
            password: true,
          })
        }

        res.render('add', { account, ...baselineTemplateConfig(req) })
      } catch (err) {
        log.error(`error with add command`, err)
        res.redirect('/')
      }
    },
  }
}
