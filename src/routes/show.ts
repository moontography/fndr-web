import assert from 'assert'
import { Request, Response } from 'express'
import { Commands, Connectors } from 'fndr'

const jupConnector = Connectors.jupiter

export default {
  verb: 'get',
  path: '/show/:uuid',
  formidable: false,

  async handler(req: Request & IStringMap, res: Response) {
    try {
      const configJson = JSON.stringify(req.session)
      if (!(req.session && req.session.jupiterServer)) return res.redirect('/')

      const { uuid } = req.params
      const { password } = req.query
      const shouldShowPassword = !!password && password !== 'false'

      // TODO: check fndrAccount balance and fund it, if needed

      const searchCommand = Commands.find((c) => {
        const f = c(jupConnector)
        if (!f) return false
        return f.name === 'search'
      })
      assert(searchCommand, 'search command was not found')

      const showCommand = Commands.find((c) => {
        const f = c(jupConnector)
        if (!f) return false
        return f.name === 'show'
      })
      assert(showCommand, 'show command was not found')

      const [
        [filteredMatches /* , allAccounts */],
        account,
      ] = await Promise.all([
        searchCommand(jupConnector).execute(configJson, {
          query: null,
        }),
        showCommand(jupConnector).execute(configJson, {
          id: uuid,
          password: shouldShowPassword,
        }),
      ])

      if (!account) return res.redirect('/')

      const accounts = filteredMatches.map((m: IStringMap) => ({
        ...m,
        password: undefined,
      }))

      res.render('index', {
        accounts,
        selectedAccount: { ...account, shouldShowPassword },
        address: req.session.fndrAddress,
      })
    } catch (err) {
      // res.status(500).send(`${err.name} - ${err.message} - ${err.stack}`)
      console.error(`${err.name} - ${err.message} - ${err.stack}`)
      res.redirect('/')
    }
  },
}
