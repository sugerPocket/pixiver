import illusts from '../../api/illust'
import { getImages, getSingleImage } from '../../api/image'
import { isFunction, exportFiles, isArray } from '../../utils'

const state = {
  queryResult: [],
  curDownImagesNum: 0,
  curDownImagesSuccessCount: 0,
  curDownImagesFailCount: 0
}

const UPDATE_QUERY_RESULT = 'UPDATE_QUERY_RESULT'
const GET_ONE_IMAGE_SUCCESS = 'GET_ONE_IMAGE_SUCCESS'
const GET_ONE_IMAGE_FAIL = 'GET_ONE_IMAGE_FAIL'
const TOGGLE_ILLUST_SELECTED_STATE = 'TOGGLE_ILLUST_SELECTED_STATE'
const START_GET_IMAGES_DATA = 'START_GET_IMAGES_DATA'
const END_GET_IMAGES_DATA = 'END_GET_IMAGES_DATA'
const QUERY_ITEM_START = 'QUERY_ITEM_START'
const QUERY_ITEM_END = 'QUERY_ITEM_END'

const mutations = {
  [UPDATE_QUERY_RESULT] (state, result) {
    state.queryResult = result
  },
  [GET_ONE_IMAGE_SUCCESS] (state) {
    state.curDownImagesSuccessCount ++
  },
  [START_GET_IMAGES_DATA] (state, total) {
    state.curDownImagesNum = total
    state.curDownImagesFailCount = 0
    state.curDownImagesSuccessCount = 0
    state.downloadInProgress = true
  },
  [END_GET_IMAGES_DATA] (state) {
    state.downloadInProgress = false
  },
  [GET_ONE_IMAGE_FAIL] (state) {
    state.curDownImagesFailCount ++
  },
  [TOGGLE_ILLUST_SELECTED_STATE] (state, index) {
    state.queryResult[index].selected = !state.queryResult[index].selected
  },
  [QUERY_ITEM_START] (state, workObj) {
    let position = state.queryResult.indexOf(workObj)
    if (position === -1) return
    state
      .queryResult[position]
      .queryInProgress = true
  },
  [QUERY_ITEM_END] (state, data) {
    let { workObj, displayImgData, profileImgData } = data
    let position = state.queryResult.indexOf(workObj)
    let { queryResult } = state
    if (position === -1) return
    let workItem = queryResult[position]
    if (displayImgData) {
      workItem
        .work
        .displayImageDataUrl = URL.createObjectURL(
          new Blob([displayImgData.body], {
            type: displayImgData.type
          })
        )
    }

    if (profileImgData) {
      workItem
        .work
        .user
        .proflieImageDataUrl = URL.createObjectURL(
          new Blob([profileImgData.body], {
            type: profileImgData.type
          })
        )
    }

    workItem.queryInProgress = false
    state.queryResult.splice(position, 1, Object.assign({}, workItem))
  }
}

const actions = {
  async query ({ commit, dispatch }, params) {
    let { command } = params
    if (!isFunction(illusts[`get${command}`])) {
      return Promise.reject(Error('unexpected command!'))
    }
    let result = await illusts[`get${command}`](params)
    commit(UPDATE_QUERY_RESULT, result)
    result = await dispatch('getDisplayImagesData')
    return result
  },
  async getDisplayImagesData ({ commit, state, dispatch }) {
    let result = []
    result = await Promise.all(
      state
        .queryResult
        .map(async workObj => {
          return dispatch('loadOne', workObj)
        })
    )

    return result.filter(data => !!data)
  },
  async downloadOriginalImages ({ commit, state }, path) {
    try {
      let result = []
      let urls = getOriginalImageUrls(state.queryResult)
      console.log(urls)
      commit(START_GET_IMAGES_DATA, urls.length)
      result = await getImages(
        urls,
        result => commit(GET_ONE_IMAGE_SUCCESS),
        err => {
          console.error(err)
          commit(GET_ONE_IMAGE_FAIL)
        }
      )

      exportFiles(path, getFilesFromResult(result))
      return result
    } catch (e) {
      return {}
    } finally {
      commit(END_GET_IMAGES_DATA)
    }
  },
  async loadOne ({ commit, state }, workObj) {
    if (!state.queryResult || !workObj) {
      return Promise.reject(Error('unknown works meta!'))
    }
    let displayImgData, profileImgData
    commit(QUERY_ITEM_START, workObj)
    try {
      displayImgData = await getSingleImage(workObj.work.image_urls.px_480mw)
      profileImgData = await getSingleImage(workObj.work.user.profile_image_urls.px_50x50)
    } catch (e) {}
    commit(QUERY_ITEM_END, {
      workObj,
      displayImgData,
      profileImgData
    })
    return workObj
  }
}

/**
 * 获取 选择图片的 original url(s)
 *
 * @param {Array<object>} selectResult 选择的结果
 * @return {(String|String[])[]} original urls
 */
function getOriginalImageUrls (selectResult) {
  return selectResult
    .map(
      workObj => {
        if (workObj.work.page_count <= 1) {
          return workObj.work.image_urls.large
        } else {
          const result = []
          result[0] = workObj.work.image_urls.large
          for (let i = 1; i < workObj.work.page_count; i++) {
            result.push(workObj.work.image_urls.large.replace(/_p0\./, `_p${i}.`))
          }
          return result
        }
      }
    )
}

/**
 * 创建 File 数组
 *
 * @param {(request.Response|request.Response[])[]} results superagent 请求的结果
 * @returns {(File|File[])[]}
 */
function getFilesFromResult (results) {
  return results.map(val => {
    if (isArray(val)) return getFilesFromResult(val)
    else {
      let filename = val.filename
      return new File([val.body], filename, { type: val.type })
    }
  })
}

export default {
  state,
  mutations,
  actions
}
