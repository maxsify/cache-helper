const Cache = require('./cache')
const client = require('../redis-connection')
class DataQueueCache extends Cache {
    constructor (host, port, password) {
        super(client(host, port, password))
    }

    keys = {
        UnDeliveredMessages: 'Undelivered_messages',
        ExchangeConnectionQueueListName:'dq_exchange_connection_$ip_$exchange',
        ExchangeRatesQueueHashName:'dq_exchange_rates_$exchange_$date',
        KlineDbQueueListName:'dq_kline_db_queue_$exchange_$timestamp',
        ExchangeKlineLastProcessedInfoHashName:'dq_exchange_last_kline_processed_info',
        KlineMissingCandlesListName:'dq_kline_missing_candles_$exchange_$symbol',
    }
    getUnDeliveredMessagesListKey() {
        return this.keys.UnDeliveredMessages
    }
    getExchangeConnectionQueueListName(ip, exchange) {
        return this.keys.ExchangeConnectionQueueListName.replace('$ip',ip)
            .replace('$exchange',exchange)
    }
    getExchangeQueueRatesHashKey(exchange, ts = null) {
        if (ts) {
            let sec = ts.getUTCSeconds()
            sec = (sec < 30) ? 0 : 30
            const date = `${ts.getUTCFullYear()}_${this.cStr(ts.getUTCMonth())}_${this.cStr(ts.getUTCDate())}_${this.cStr(ts.getUTCHours())}_${this.cStr(ts.getUTCMinutes())}_${this.cStr(sec)}`
            return this.keys.ExchangeRatesQueueHashName.replace('$exchange',exchange).replace('$date',date)
        }else{
            return this.keys.ExchangeRatesQueueHashName.replace('$exchange',exchange).replace('$date','*')
        }
    }

    getKlineDbQueueListName(exchange, timestamp) {
        return this.keys.KlineDbQueueListName.replace('$exchange',exchange).replace('$timestamp',timestamp)
    }
    getExchangeLastProcessedHashKey() {
        return this.keys.ExchangeKlineLastProcessedInfoHashName
    }
    getKlineMissingCandlesListName(exchange, symbol) {
        return this.keys.KlineMissingCandlesListName.replace('$exchange', exchange).replace('$symbol', symbol.replace('-','_'))
    }
    getDateFromExchangeRateKey(exchange,strKey){
        strKey  = strKey.replace(`exchange_rates_${exchange}_`,'')
        const dates = strKey.split('_')
        dates.forEach((item,index)=>{
            dates[index] = +item
        })
        return new Date(Date.UTC(+dates[0], +dates[1], +dates[2], +dates[3], +dates[4], +dates[5], 0))
    }
}

module.exports = DataQueueCache