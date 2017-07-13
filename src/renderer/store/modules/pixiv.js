import illusts from '../../api/illust'
import { getImages, getSingleImage } from '../../api/image'
import { isFunction, exportFiles, isArray } from '../../utils'

const state = {
  displayImagesData: [],
  queryResult: [],
  curDownImagesNum: 0,
  curDownImagesSuccessCount: 0,
  curDownImagesFailCount: 0,
  downloadInProgress: false,
  queryInProgress: false
}

const UPDATE_QUERY_RESULT = 'UPDATE_QUERY_RESULT'
const UPDATE_DISPLAY_IMAGES_DATA = 'UPDATE_DISPLAY_IMAGES_DATA'
const GET_ONE_IMAGE_SUCCESS = 'GET_ONE_IMAGE_SUCCESS'
const GET_ONE_IMAGE_FAIL = 'GET_ONE_IMAGE_FAIL'
const TOGGLE_ILLUST_SELECTED_STATE = 'TOGGLE_ILLUST_SELECTED_STATE'
const START_GET_IMAGES_DATA = 'START_GET_IMAGES_DATA'
const END_GET_IMAGES_DATA = 'END_GET_IMAGES_DATA'
const TOGGLE_QUERY_STATE = 'TOGGLE_QUERY_STATE'

const mutations = {
  [UPDATE_QUERY_RESULT] (state, result) {
    state.queryResult = result
  },
  [UPDATE_DISPLAY_IMAGES_DATA] (state, imagesData) {
    state.displayImagesData = imagesData
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
  [TOGGLE_QUERY_STATE] (state, inProgress) {
    state.queryInProgress = inProgress
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
  async getDisplayImagesData ({ commit, state }) {
    let result = []
    commit(TOGGLE_QUERY_STATE, true)
    result = await Promise.all(
      state
        .queryResult
        .map(async imageObj => {
          try {
            let displayImgData = await getSingleImage(imageObj.work.image_urls.px_480mw)
            imageObj.work.displayImageDataUrl = URL.createObjectURL(new Blob([displayImgData.body], { type: displayImgData.type }))
            let profileImgData = await getSingleImage(imageObj.work.user.profile_image_urls.px_50x50)
            imageObj.work.user.proflieImageDataUrl = URL.createObjectURL(new Blob([profileImgData.body], { type: profileImgData.type }))
          } catch (e) {}
          return imageObj
        })
    )

    commit(TOGGLE_QUERY_STATE, false)
    commit(UPDATE_QUERY_RESULT, result)
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
  }
}

/**
 * 获取 每个查询记录的 展示图片的 url
 *
 * @param {Array<object>} queryResult api 查询结果
 * @return {Array<String | String[]>}
 */
// function getDisplayImageUrls (queryResult) {
//   return queryResult.map(imageObj => imageObj.work.image_urls.medium)
// }

/**
 * 获取 选择图片的 original url(s)
 *
 * @param {Array<object>} selectResult 选择的结果
 * @return {(String|String[])[]} original urls
 */
function getOriginalImageUrls (selectResult) {
  return selectResult
    .map(
      imageObj => {
        if (imageObj.work.page_count <= 1) {
          return imageObj.work.image_urls.large
        } else {
          const result = []
          result[0] = imageObj.work.image_urls.large
          for (let i = 1; i < imageObj.work.page_count; i++) {
            result.push(imageObj.work.image_urls.large.replace(/_p0\./, `_p${i}.`))
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
