import request from 'superagent'
import { isArray, isFunction } from '../utils'

/**
 * 查看获取单个 image
 *
 * @param {String} url 请求 image 的 url
 */
export function getSingleImage (url) {
  return request
    .get(url)
    .set('Referer', 'https://app-api.pixiv.net/')
    .then(result => {
      result.filename = result.request.url.split('/').reverse()[0]
      return result
    })
}

/**
 * 获取多个 images
 *
 * @param {Array<String>} urls 请求 Images 的原地址数组
 */
function getMultiImages (urls) {
  return Promise
    .all(
      urls.map(
        url => getSingleImage(url)
      )
    )
}

/**
 * 获取所有的 images
 *
 * @param {(String|String[])[]} urls 请求的 url 数组
 * @param {function(request.Response): void} onItemSuccess 成功请求 (resolve) 就会调用
 * @param {function(Error): void} onItemFailed 请求失败 (reject) 调用
 */
export function getImages (urls, onItemSuccess, onItemFailed) {
  return Promise.all(urls.map(val => {
    let promise = isArray(val) ? getMultiImages(val) : getSingleImage(val)
    if (isFunction(onItemSuccess)) promise.then(result => { return (onItemSuccess(result), result) })
    if (isFunction(onItemFailed)) promise.catch(err => { return (onItemFailed(err), null) })
    return promise
  }))
}
