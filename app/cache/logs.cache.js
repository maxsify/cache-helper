const Cache = require('./cache')
const client = require('../redis-connection')

class LogsCache extends Cache {
    constructor (host, port, password) {
        super(client(host, port, password))
    }
    keys = {
        ServiceRestart: 'logs_service_restart',
        SocketLogsList: 'logs_service_$type_$serviceId_$exchange'
    }
    getServiceRestartHashKey(){
        return this.keys.ServiceRestart
    }
    getSocketLogsListKey(type,serviceId,exchange){
        return this.keys.SocketLogsList.replace('$type',type).replace('$serviceId',serviceId).replace('$exchange',exchange)
    }
}

module.exports = LogsCache