const { promisify } = require('util')

class Cache {
    constructor (redisClient) {
        this.redisClient = redisClient
        this.redisGetMemoryStatsAsync = promisify(this.redisClient.memory).bind(this.redisClient)
        this.redisGetAsync = promisify(this.redisClient.get).bind(this.redisClient)
        this.redisTypeAsync = promisify(this.redisClient.type).bind(this.redisClient)
        this.redisGetKeysAsync = promisify(this.redisClient.keys).bind(this.redisClient)
        this.redisLrangeAsync = promisify(this.redisClient.lrange).bind(this.redisClient)
        this.redisLremAsync = promisify(this.redisClient.lrem).bind(this.redisClient)
        this.redisLlenAsync = promisify(this.redisClient.llen).bind(this.redisClient)
        this.redisHSetAsync = promisify(this.redisClient.hset).bind(this.redisClient)
        this.redisHGETAsync = promisify(this.redisClient.hget).bind(this.redisClient)
        this.redisHMGETAsync = promisify(this.redisClient.hmget).bind(this.redisClient)
        this.redisHGETALLAsync = promisify(this.redisClient.hgetall).bind(this.redisClient)
        this.redisHDelAsync = promisify(this.redisClient.hdel).bind(this.redisClient)
        this.redisHLENAsync = promisify(this.redisClient.hlen).bind(this.redisClient)
        this.redisHKeysAsync = promisify(this.redisClient.hkeys).bind(this.redisClient)
    }
    getKlineCacheKey(timestamp){
        const dt = new Date(+timestamp)
        return `kline${this.cStr(dt.getUTCMonth() + 1)}${dt.getUTCFullYear()}`
    }

    cStr (str) {
        return (str < 10) ? `0${str}` : str
    }

    /**
     * Set Data in Cache
     * @param key
     * @param value
     * @param expiry - seconds
     */
    async memoryStats () {
        const result = await this.redisGetMemoryStatsAsync('stats')
        const data = {}
        let lastKey = ''
        result.forEach((item, index) => {
            if (index % 2 === 0) {
                lastKey = item
            } else {
                if (['peak.allocated', 'total.allocated'].indexOf(lastKey) >= 0) {
                    data[lastKey] = (+item / (1024 * 1024)).toFixed(4) + ' MB'
                } else {
                    data[lastKey] = item
                }
            }
        })
        return data
    }

    /**
     * Set Data in Cache
     * @param key
     * @param value
     * @param expiry - seconds
     */
    set (key, value, expiry = null) {
        this.redisClient.set(key, value, this.redisClient.print)
    }

    /**
     * Get Data from Cache
     * @param key
     * @param defaultValue
     * @returns {Promise<*>}
     */
    async get (key, defaultValue = null) {
        const val = await this.redisGetAsync(key)
        return val || defaultValue
    }

    /**
     * Get Data type from Cache
     * @param key
     * @returns {Promise<*>}
     */
    async getKeyType (key) {
        return await this.redisTypeAsync(key)
    }

    /**
     * Delete A key from cache
     * @param key
     */
    del (key) {
        this.redisClient.del(key)
    }

    /**
     * GET Keys in cache
     * @param pattern
     * @returns {Promise<*>}
     */
    async getKeys (pattern = '*') {
        return await this.redisGetKeysAsync(pattern)
    }

    /**
     * Add Element To Given List
     * @param key
     * @param element
     */
    addToListTop (key, element) {
        // add element at the top side of list
        const data = this.redisClient.lpush(key, element)
    }

    /**
     * Add Element To Given List
     * @param key
     * @param element
     */
    addToList (key, element) {
        // add element at the right side of list
        this.redisClient.rpush(key, element)
    }

    /**
     * Remove Element From Given List
     * @param key
     * @param element
     * @param count
     */
    async removeFromList (key, element, count = 1) {
        // remove element from left side of the list
        return await this.redisLremAsync(key, count, element)
    }

    /**
     * Get List From Cache
     * @param key
     * @param start
     * @param count
     * @returns {Promise<*>}
     */
    async getList (key, start = 0, end = -1) {
        return await this.redisLrangeAsync(key, start, end)
    }

    /**
     * Count Items in given List
     * @param key
     * @returns {Promise<*>}
     */
    async countListItems (key) {
        return await this.redisLlenAsync(key)
    }

    /**
     * HSET Command for cache
     * @param hash
     * @param field
     * @param value
     */
    hset (hash, field, value) {
        this.redisClient.hset(hash, field, value)
    }

    /**
     * HSET Command for cache
     * @param hash
     * @param fields
     */
    hmSet (hash, fields) {
        this.redisClient.hset(hash, fields)
    }

    /**
     * ASYNC HMSET Command for cache
     * @param hash
     * @param fields
     */
    async hmSetAsync (hash, fields) {
        return await this.redisHSetAsync(hash, fields)
    }

    /**
     * HSET Command for cache
     * @param hash
     * @param field
     * @param value
     */
    async hSetAsync (hash, field, value) {
        return await this.redisHSetAsync(hash, field, value)
    }

    /**
     * HSET Command for cache
     * @param hash
     * @param field
     * @param value
     */
    hIncrement (hash, field, value) {
        this.redisClient.hincrby(hash, field, value)
    }

    /**
     * HGET - Returns the value associated with field in the hash stored at key
     * @param hash
     * @param field
     * @returns {Promise<*>}
     */
    async hGet (hash, field) {
        return await this.redisHGETAsync(hash, field)
    }

    /**
     * HMGET - Returns the value associated with field in the hash stored at key
     * @param hash
     * @param fields
     * @returns {Promise<*>}
     */
    async hmGet (hash, fields) {
        return await this.redisHMGETAsync(hash, fields)
    }

    /**
     * HDEL - Removes the specified fields from the hash stored at key
     * @param hash
     * @param field
     */
    hDel (hash, field) {
        this.redisClient.hdel(hash, field)
    }

    /**
     * HDEL - Removes the specified fields from the hash stored at key
     * @param hash
     * @param field
     */
    async hDelAsync (hash, field) {
        return await this.redisHDelAsync(hash, field)
    }

    /**
     * HGETALL - Returns all fields and values of the hash stored at key
     * @param hash
     * @returns {Promise<*>}
     */
    async hGetAll (hash) {
        return await this.redisHGETALLAsync(hash)
    }

    /**
     * HLEN - Returns the number of fields contained in the hash stored at key.
     * @param hash
     * @returns {Promise<*>}
     */
    async hCount (hash) {
        return await this.redisHLENAsync(hash)
    }
    /**
     * HLEN - Returns the number of fields contained in the hash stored at key.
     * @param hash
     * @returns {Promise<*>}
     */
    async hKeys (hash) {
        return await this.redisHKeysAsync(hash)
    }
}

module.exports = Cache
