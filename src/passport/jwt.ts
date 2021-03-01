import assert from 'assert'
import PassportJWT from 'passport-jwt'
import { Request } from 'express'
import config from '../config'

const JWTStrategy = PassportJWT.Strategy

export default function JwtPassportStrategy() {
  return {
    strategy: JWTStrategy,
    options: {
      jwtFromRequest: (req: Request) => {
        assert(config.server.sessionCookieKey, 'cookie key not set')
        return req.cookies && req.cookies[config.server.sessionCookieKey]
      },
      secretOrKey: config.server.sessionSecret,
    },
    handler: async function PassportJwtHandler(jwtPayload: any, done: any) {
      if (Date.now() > jwtPayload.expires) return done()
      done(null, jwtPayload)
    },
  }
}
