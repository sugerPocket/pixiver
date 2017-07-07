import { lessThanToday } from '../../../utils'

const state = {
  type: 'all',
  date: new Date(Date.now()),
  R18: '',
  mode: 'daily',
  from: 0,
  to: 0
}

const getters = {
  query (state) {
    let mode = ''

    mode += state.mode
    mode += (mode && state.R18) ? '_r18' : ''

    return {
      command: 'ByRank',
      date: lessThanToday(state.date) ? state.date : null,
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
