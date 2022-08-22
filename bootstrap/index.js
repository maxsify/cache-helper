
exports.bootstrap = async () => {
  require('../bootstrap/global-variables').bootstrap()
  const mainCache = require('../app/cache/main.cache')
  const Cache = require('../app/cache.class')

  const app = {
    init: async () => {


    },
  }
  // call
  await app.init()
}
