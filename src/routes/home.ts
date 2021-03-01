import { Request, Response } from 'express'

export default {
  verb: 'get',
  path: '/',
  formidable: false,

  async handler(req: Request, res: Response) {
    try {
      res.render('index')
    } catch (err) {
      res.status(500).send(err.stack)
    }
  },
}
