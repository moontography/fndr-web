import IORedis from 'ioredis'
import config from '../config'

export default new IORedis(config.redis.url)
