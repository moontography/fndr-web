import assert from 'assert'
import passport from 'passport'
import JWT from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import config from '../config'

const sessionSecret = config.server.sessionSecret

export function jwtAuthMiddleware(
  req: Request & IStringMap,
  res: Response,
  next: NextFunction
) {
  passport.authenticate('jwt', { session: false }, function(err, sessionObj) {
    if (err) return next(err.stack)

    // Set session key so we can use it just like the session object
    // was used and passed around using express-session. At some point
    // might be worth changing this to something else, but for now it should
    // mean we need less changes in the app for it to work.
    req.session = sessionObj || {}

    next()
  })(req, res, next)
}

export function getJwtToken(payload: IStringMap) {
  assert(sessionSecret, 'secret key for signing JWT does not exist')
  return JWT.sign(JSON.stringify(payload), sessionSecret)
}
