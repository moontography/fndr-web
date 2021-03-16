import BigNumber from 'bignumber.js'
import { Request, Response } from 'express'
import { JupiterClient } from 'fndr'
import { IRouteOpts, IRoute, baselineTemplateConfig } from './'
import { getJwtToken } from '../libs/Jwt'
import config from '../config'

export default function({ log }: IRouteOpts): IRoute {
  return {
    verb: 'post',
    path: '/config',
    formidable: false,

    async handler(req: Request, res: Response) {
      try {
        const jupiterConfig = req.body

        const hasAllRequired =
          jupiterConfig.jupiterServer &&
          jupiterConfig.fundedAddress &&
          jupiterConfig.fundedAddressPassphrase &&
          jupiterConfig.fndrAddress &&
          jupiterConfig.fndrSecretPhrase &&
          jupiterConfig.fndrPublicKey &&
          jupiterConfig.fndrAccount
        if (!hasAllRequired) return res.redirect('/?error=fields')

        const encryptSecret =
          jupiterConfig.encryptSecret || jupiterConfig.fundedAddressPassphrase

        // optionally fund the fndr address if different than user address
        // and does not have a small amount of JUP to send accounts to the blockchain
        if (jupiterConfig.fundedAddress !== jupiterConfig.fndrAddress) {
          const jupClient = JupiterClient({
            recordKey: '__jupiter-password-manager',
            server: jupiterConfig.jupiterServer,
            address: jupiterConfig.fundedAddress,
            passphrase: jupiterConfig.fundedAddressPassphrase,
            encryptSecret: encryptSecret,
          })
          const fndrAccBalanceJup = await jupClient.getBalance(
            jupiterConfig.fndrAddress
          )
          const fndrBal = new BigNumber(fndrAccBalanceJup)
          if (
            fndrBal.eq('0') ||
            fndrBal.lt(
              jupClient.nqtToJup(
                jupClient.config.minimumFndrAccountBalance.toString()
              )
            )
          ) {
            await jupClient.sendMoney(jupiterConfig.fndrAddress)
          }
        }

        res.cookie(
          config.server.sessionCookieKey,
          getJwtToken({
            ...jupiterConfig,
            encryptSecret,
          }),
          {
            httpOnly: true,
            secure: config.server.isProduction,
          }
        )

        res.redirect('/')
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
