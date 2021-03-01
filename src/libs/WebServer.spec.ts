import assert from 'assert'
import net from 'net'
import WebServer from './WebServer'

describe('WebServer', function () {
  const port = 8888
  const [, startServer] = WebServer(port)

  it(`should create a server listening on port: ${port}`, async function () {
    ;(startServer as any)()

    // We have to initiate listening on the port since the clustering
    // module actually handles listening (see `sticky-cluster`)
    const isPortInUse = await new Promise((resolve, reject) => {
      // https://gist.github.com/whatl3y/64a08d117b5856c21599b650c4dd69e6
      const tester: any = net
        .createServer()
        .once('error', (err: any) => {
          if (err.code != 'EADDRINUSE') return reject(err)
          resolve(true)
        })
        .once('listening', () =>
          tester.once('close', () => resolve(false)).close()
        )
        .listen(port)
    })

    assert.equal(true, isPortInUse)
  })
})
