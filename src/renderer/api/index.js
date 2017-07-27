import * as auth from './auth'
import * as illust from './illust'
import * as image from './image'
import request from 'superagent'

const API_HOST = 'https://public-api.secure.pixiv.net/v1/'
const DEFAULT_HEADERS = {
  Authorization: '',
  Referer: 'http://spapi.pixiv-app.net/',
  Host: 'public-api.secure.pixiv.net'
}

export class PixivRequest {
  /**
   * 直接发送 get 请求
   * @param {string} path request path
   * @param {object} query queryData fields
   * @return {Promise<request.Response>}
   */
  constructor (path, query) {
    return this.get(path, query)
  }

  /**
   * 发送 get 请求
   * @param {string} path request path
   * @param {object} query queryData fields
   */
  static async get (path, query) {
    if (DEFAULT_HEADERS.Authorization) {
      path = path[0] === '/' ? path.slice(1) : path
      return request
        .get(API_HOST + path)
        .set(DEFAULT_HEADERS)
        .query(query)
    } else {
      throw Error('empty access token!\n')
    }
  }
}

export function setAccessToken (token) {
  DEFAULT_HEADERS.Authorization = `Bearer ${token}`
}

export {
  auth,
  image,
  illust
}
