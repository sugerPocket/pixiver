const state = {
  type: 'all',
  date: new Date(Date.now()),
  dateMode: 'daily',
  R18: '',
  mode: '',
  from: 0,
  to: 0
}

const getters = {
  query (state) {
    let mode = ''

    mode += state.dateMode
    mode += ((mode && state.mode ? '_' : '') + state.mode)
    mode += (mode && state.R18) ? '_r18' : ''

    return {
      command: 'ByRank',
      date: state.date,
      from: state.from,
      to: state.to,
      type: state.type,
      mode
    }
  }
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
