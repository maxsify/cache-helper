const Cache = require('./cache')
const client = require('../redis-connection')

class KlineCache extends Cache {
    constructor (ip, port, password) {
        super(client(ip, port, password))
    }
    keys = {
        Kline: 'kline_$exchange_$duration'
    }
    getKlineCacheKey(exchange, duration) {
        return this.keys.Kline.replace('$exchange',exchange).replace('$duration',duration)
    }
}

module.exports = KlineCache