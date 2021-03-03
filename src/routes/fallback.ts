import assert from 'assert'
import { Request, Response } from 'express'
import config from '../config'

export default function() {
  return {
    verb: 'get',
    path: '*',
    formidable: false,

    async handler(req: Request, res: Response) {
      res.redirect('/')
    },
  }
}
