const eventEmitter = require("./event-emitter")

class CacheClass {
  constructor (obj) {
    this.title = obj.title
    this.key = obj.key
    this.fileName = obj.fileName
    this.ip = obj.ip
    this.port = obj.port
    this.password = obj.password
    this.client = null
    try{
      const file = require(`./cache/${this.fileName}.cache.js`)
      this.client = new file(this.ip, this.port, this.password)
    }catch(error){
      throw error
    }
  }
  destroy(){
    this.client = null
  }
}

module.exports = CacheClass
