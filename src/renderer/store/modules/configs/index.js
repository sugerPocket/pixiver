const files = require.context('.', true, /^(\.\/([^/]+(\/index)?\.js))$/)
const modules = {}

files.keys().forEach(key => {
  if (key === './index.js') return
  modules[key.replace(/(\.\/|\/index\.js|\.js)/g, '')] = {
    namespaced: true,
    ...files(key).default
  }
})

const state = {

}

const mutations = {

}

const getters = {

}

const actions = {

}

export default {
  state,
  mutations,
  getters,
  actions,
  modules
}
