const Cache = require('./cache')
const client = require('../redis-connection')

class MainCache extends Cache {
    constructor (host, port, password) {
        super(client(host, port, password))
    }
    keys = {
        ExchangeSymbolStats:'ExchangeSymbolStats',
        CacheListKey:'cacheListKey',
        ExchangeSymbolRate:'exchange_symbol_rates_$exchange',
        ExchangeSymbolsResponse:'symbols_$exchange_response',
        Sessions: 'sessions',
        UserSessions: 'user_sessions',
        SessionAccess: 'session_access',
        Assets:'assets',
        AuthToken:'auth_token',
        UserProfile:'user_profile',
        AuthTokenExpiry:'auth_token_expiry',
        Exchanges:'exchanges',
        SystemUpTime:'em_system_up_time',
        ExchangeKlineHttpCallErrorSymbolsHashName:'kline_httpCall_error_symbols_$exchange',
        RegisteredEmails: 'registered_emails',
        RegisteredUsernames: 'registered_usernames',
        userStats: 'user_stats',
        siteStats: 'site_stats',
    }
    getCacheList() {
        return this.keys.CacheListKey
    }
    getExchangeSymbolStats() {
        return this.keys.ExchangeSymbolStats
    }
    getExchangeSymbolRateHashKey (exchange) {
        return this.keys.ExchangeSymbolRate.replace('$exchange', exchange)
    }
    getSystemUpTimeKey () {
        return this.keys.SystemUpTime
    }
    getUserProfileKey() {
        return this.keys.UserProfile
    }
    getSessionsHashKey() {
        return this.keys.Sessions
    }
    getUserSessionsHashKey() {
        return this.keys.UserSessions
    }
    getSessionAccessHashKey() {
        return this.keys.SessionAccess
    }
    getExchangesHashKey() {
        return this.keys.Exchanges
    }
    getAuthTokenKey() {
        return this.keys.AuthToken
    }
    getAssetsHashKey() {
        return this.keys.Assets
    }
    getExchangeSymbolsResponse(exchange){
        return this.keys.ExchangeSymbolsResponse.replace('$exchange',exchange)
    }
    getAuthTokenExpiryKey() {
        return this.keys.AuthTokenExpiry
    }
    getExchangeKlineHttpCallErrorSymbolsHashName(exchange) {
        return this.keys.ExchangeKlineHttpCallErrorSymbolsHashName.replace('$exchange',exchange)
    }
    getRegisteredEmailsHashKey() {
        return this.keys.RegisteredEmails
    }
    getRegisteredUsernamesHashKey() {
        return this.keys.RegisteredUsernames
    }
    getUserStatsHashKey() {
        return this.keys.userStats
    }
    getSiteStatsHashKey() {
        return this.keys.siteStats
    }
}

module.exports = MainCache
