const { Pixiver } = require('./pixiver')

module.exports = {
  install: (Vue, options) => {
    Vue.prototype.$pixiv = new Pixiver('', '')
  }
}
