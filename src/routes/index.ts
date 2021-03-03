import * as Logger from 'bunyan'
import { Request, Response } from 'express'
import { Redis } from 'ioredis'
import add from './add'
import config from './config'
import fallback from './fallback'
import home from './home'
import logout from './logout'
import show from './show'

// export interface IFile {
//   name: string
//   path: string
//   size: number
//   type: string
// }

export default [add, config, logout, show, home, fallback]

export function baselineTemplateConfig(req: Request & IStringMap) {
  return {
    address: req.session.fndrAddress,
  }
}

export type IRouteFactory = (opts: IRouteOpts) => IRoute

export interface IRouteOpts {
  log: Logger
  redis: Redis
}

export interface IRoute {
  verb: string
  path: string | string[]
  formidable: boolean
  handler(req: Request & IStringMap, res: Response): Promise<any>
}
