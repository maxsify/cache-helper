const mainCache = require('./app/cache/main.cache')
const Cache = require('./app/cache.class')

const cacheHelper = {
  exportCache: {},
  clients: {},
  async loadCache(host, port, password) {
    if(!(host && port)){
      throw new Error('please add redis host and port on your env file')
    }
    const mainCacheObj = new mainCache(host, port, password)
    const caches = await mainCacheObj.hGetAll(mainCacheObj.getCacheList())
    if(!caches){
      const objCache = new Cache({
        title: 'main',
        key: 'main',
        fileName: 'main',
        ip: host,
        port: port,
        password: password
      })
      cacheHelper.exportCache[objCache.key] = objCache
      cacheHelper.clients[objCache.key] = objCache.client
    }else{
      const allowedRedisHost = (process.env.ALLOWED_REDIS_HOST || 'all').split(',')
      for(let key in caches){
        if(allowedRedisHost[0] === 'all' || allowedRedisHost.indexOf(key) > -1) {
          let objCache = JSON.parse(caches[key])
          try{
            objCache = new Cache(objCache)
            cacheHelper.exportCache[objCache.key] = objCache
            cacheHelper.clients[objCache.key] = objCache.client
          }catch(error){
            console.log(`cache file ${objCache.fileName} not found`)
          }
        }
      }
    }
  },
}
module.exports = cacheHelper