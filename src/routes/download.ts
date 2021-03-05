import { Request, Response } from 'express'
import { IRouteOpts, IRoute, baselineTemplateConfig } from './'

export default function({ log }: IRouteOpts): IRoute {
  return {
    verb: 'get',
    path: '/download/config',
    formidable: false,

    async handler(req: Request & IStringMap, res: Response) {
      try {
        const jupConfig = req.session
        const confFileName = `fndr-jupiter-config.json`
        res.attachment(confFileName)
        res.send(JSON.stringify(jupConfig, null, 2))
      } catch (err) {
        const errText = `${err.name} - ${err.stack}`
        log.error(`error with config`, err)
        res.render('index', {
          ...baselineTemplateConfig(req),
          globalError: errText,
        })
      }
    },
  }
}
