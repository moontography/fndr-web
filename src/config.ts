const appName = process.env.APP_NAME || 'fndr-web'
const hostName = process.env.HOSTNAME || 'http://localhost:8000'

export default {
  app: {
    name: appName,
  },

  jupiter: {
    server: process.env.JUPITER_SERVER || `https://jpr.gojupiter.tech`,
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  server: {
    isProduction: process.env.NODE_ENV === 'production',
    port: process.env.PORT || 8000,
    host: hostName,
    sessionCookieKey: process.env.COOKIE_KEY || 'fndr',
    sessionSecret: process.env.SECRET,
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
