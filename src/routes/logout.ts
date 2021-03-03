import assert from 'assert'
import { Request, Response } from 'express'
import { IRouteOpts, IRoute } from './'
import config from '../config'

export default function({ log }: IRouteOpts): IRoute {
  return {
    verb: 'get',
    path: ['/logout', '/logout/confirm'],
    formidable: false,

    async handler(req: Request, res: Response) {
      try {
        if (req.path === '/logout/confirm') {
          return res.render('logoutConfirmation')
        }

        assert(config.server.sessionCookieKey, 'cookie key not present')
        res.cookie(config.server.sessionCookieKey, '', {
          httpOnly: true,
          secure: config.server.isProduction,
        })

        res.redirect('/')
      } catch (err) {
        log.error(`error logging out`, err)
        res.redirect('/')
      }
    },
  }
}
