const state = {
  type: '',
  date: new Date(Date.now()),
  dateMode: 'day',
  R18: '',
  mode: '',
  from: 0,
  to: 0
}

const getters = {

}

const mutations = {
  UPDATE (state, configs) {
    Object.keys(configs).forEach(key => { state[key] = configs[key] })
  }
}

export default {
  state,
  getters,
  mutations
}
