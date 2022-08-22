const eventEmitter = require("./event-emitter")
const exportCache = {}

eventEmitter.on('removeCache', (cache) => {
    delete exportCache[cache.key]
})
eventEmitter.on('addCache', (cache) => {
    console.log(cache)
    exportCache[cache.key] = cache.client
})
for (const cacheName in global.cachesList ) {
    if (global.cachesList.hasOwnProperty(cacheName)) {
        exportCache[cacheName] = global.cachesList[cacheName].client
    }
}
module.exports = exportCache