import assert from 'assert'
import { Request, Response } from 'express'
import config from '../config'

export default {
  verb: 'get',
  path: '/logout',
  formidable: false,

  async handler(req: Request, res: Response) {
    try {
      assert(config.server.sessionCookieKey, 'cookie key not present')
      res.cookie(config.server.sessionCookieKey, '', {
        httpOnly: true,
        secure: config.server.isProduction,
      })

      res.redirect('/')
    } catch (err) {
      res.redirect('/')
    }
  },
}
