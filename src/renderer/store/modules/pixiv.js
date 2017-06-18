import illusts from '../../api/illust'
import { getImages, getSingleImage } from '../../api/image'
import { isFunction, exportFiles, isArray } from '../../utils'

const state = {
  displayImagesData: [],
  queryResult: [],
  curDownImagesNum: 0,
  curDownImagesSuccessCount: 0,
  curDownImagesFailCount: 0
}

const UPDATE_QUERY_RESULT = 'UPDATE_QUERY_RESULT'
const UPDATE_DISPLAY_IMAGES_DATA = 'UPDATE_DISPLAY_IMAGES_DATA'
const GET_ONE_IMAGE_SUCCESS = 'GET_ONE_IMAGE_SUCCESS'
const GET_ONE_IMAGE_FAIL = 'GET_ONE_IMAGE_FAIL'
const TOGGLE_ILLUST_SELECTED_STATE = 'TOGGLE_ILLUST_SELECTED_STATE'

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
  [GET_ONE_IMAGE_FAIL] (state) {
    state.curDownImagesFailCount ++
  },
  [TOGGLE_ILLUST_SELECTED_STATE] (state, index) {
    state.queryResult[index].selected = !state.queryResult[index].selected
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
    // TODO: get data from cache
    result = await Promise.all(getDisplayImageUrls(state.queryResult)
      .map(url => {
        return getSingleImage(url)
          .then(result => URL.createObjectURL(new Blob([result.body], { type: result.type })))
          .catch(err => console.log(err))
      })
    )

    commit(UPDATE_DISPLAY_IMAGES_DATA, result)
    return result.filter(data => !!data)
  },
  async downloadOriginalImages ({ commit, state }, path) {
    let result = []
    // TODO: get data from cache
    result = await getImages(
      getOriginalImageUrls(state.queryResult),
      // TODO: progress bar
      result => commit(GET_ONE_IMAGE_SUCCESS),
      err => {
        console.error(err)
        commit(GET_ONE_IMAGE_FAIL)
      }
    )

    exportFiles(path, getFilesFromResult(result))
    return result
  }
}

/**
 * 获取 每个查询记录的 展示图片的 url
 *
 * @param {Array<object>} queryResult api 查询结果
 * @return {Array<String | String[]>}
 */
function getDisplayImageUrls (queryResult) {
  return queryResult.map(imageObj => imageObj.image_urls.square_medium)
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
      imageObj => {
        if (imageObj.page_count <= 1) {
          return imageObj.meta_single_page.original_image_url
        } else {
          return imageObj.meta_pages.map(
            page => page.image_urls.original
          )
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
