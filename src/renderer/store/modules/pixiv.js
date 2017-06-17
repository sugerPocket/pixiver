import request from 'superagent'


const state = {
  displayImagesData: [],
  queryResult: []
}

const UPDATE_QUERY_RESULT = 'UPDATE_QUERY_RESULT'
const SHOW_QUERY_RESULT = 'SHOW_QUERY_RESULT'
const GET_ONE_IMAGE = 'GET_ONE_IMAGE'

const mutations = {
  [UPDATE_QUERY_RESULT] (state, result) {
    state.queryResult = result
  },
  [SHOW_QUERY_RESULT] (state) {
    
  },
  [GET_ONE_IMAGE] (state) {
    state
  }
}

const actions = {
  async queryByRank ({ commit, dispatch }, queryConfig) {
    let { from, to, date, mode } = queryConfig
    let filter = 'for_ios'
    let result = []
    date = transformDate(date)
    while (from <= to) {
      let query = {
        filter,
        mode,
        offset: from
      }
      if (date) query.date = date
      result.concat((await request
        .get('https://app-api.pixiv.net/v1/illust/ranking')
        .query(query)).body.illusts)

      from += 30
    }
    commit(UPDATE_QUERY_RESULT, result)
    dispatch('getImagesData', result)
    return result
  },
  async getImagesData ({ commit }, result) {
    let result = []
    result = await Promise.all()
    return result
  }
}

/**
 * 将日期转化为参数字符串
 * @param {Date} date 需要转换的日期
 * @return {String} 参数字符串 YYYY-MM-DD
 */
function transformDate (date) {
  return date ? `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}` : null
}

/**
 * Get one image
 * @param {String} url
 * @return {request.SuperAgentRequest}
 */
function getSingleImage(url) {
  return request
    .get(url)
    .set('Referer', 'https://app-api.pixiv.net/')
}

/**
 * get multiple images
 * @param {Array<string>} urls 请求的所有 url
 * @return {Promise<request.SuperAgentRequest[]>}
 */
function getMultiImages(urls) {
  return Promise
    .all(
      urls.map(
        url => getSingleImage(url)
      )
    )
}

/**
 * 获取 每个查询记录的 展示图片的 url
 * @param {Array<object>} queryResult api 查询结果
 * @return {Array<String|String[]>}
 */
function getDisplayImageUrls(queryResult) {

}

/**
 * 
 * @param {Array<object>} selectResult 
 */
function getOriginalUrls(selectResult) {

}

export default {
  state,
  mutations,
  actions
}
