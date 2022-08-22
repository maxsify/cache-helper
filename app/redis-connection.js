const redisConnection = require('redis')
module.exports = (host, port, password = '') => {
    const client = redisConnection.createClient({ host, port })
    client.on('error', err => {
        console.log('CacheError ' + err);
    })
    return client
}