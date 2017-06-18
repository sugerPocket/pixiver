import { login } from '../../api/auth'

const state = {
  username: '',
  password: '',
  access_token: '',
  refresh_token: ''
}

const AUTH_SUCCESS = 'AUTH_SUCCESS'

const mutations = {
  [AUTH_SUCCESS] (state, result) {
    state.username = result.username
    state.password = result.password
    state.access_token = result.access_token
    state.refresh_token = result.refresh_token
  }
}

const actions = {
  login ({ commit }, data) {
    let { username, password } = data
    return login(username, password)
      .then(result => commit(AUTH_SUCCESS, Object.assign({ username, password }, result.body)))
  }
}

export default {
  state,
  mutations,
  actions
}
