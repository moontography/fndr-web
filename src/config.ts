const appName = process.env.APP_NAME || 'fndr-web'
const hostName = process.env.HOSTNAME || 'http://localhost:8000'

export default {
  app: {
    name: appName,
  },

  server: {
    isProduction: process.env.NODE_ENV === 'production',
    port: process.env.PORT || 8000,
    concurrency: parseInt(process.env.WEB_CONCURRENCY || '1'),
    host: hostName,
  },

  logger: {
    options: {
      name: appName,
      streams: [
        {
          level: process.env.LOGGING_LEVEL || 'info',
          stream: process.stdout,
        },
      ],
    },
  },
}
