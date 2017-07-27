// TODO: configure the number of http connection
const state = {

}

const mutations = {

}

const actions = {
    getQueryConfigs({ state }, mode) {
        return state[mode] || {}
    }
}

export default {
    state,
    mutations,
    actions
}