import WebServer from '../libs/WebServer'

const [, startServer] = WebServer()

//handle if the process suddenly stops
process.on('SIGINT', () => {
  console.log('got SIGINT....')
  process.exit()
})
process.on('SIGTERM', () => {
  console.log('got SIGTERM....')
  process.exit()
})
;(async function fndrWeb() {
  await (startServer as any)()
})()
