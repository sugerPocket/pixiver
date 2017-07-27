import request from 'superagent'
import { isArray, isFunction } from '../utils'

const MAX_REQUEST_NUM = 10

/**
 * 请求等待队列
 * @type {Array<function(value: any=): void>}
 */
let waitQueue = []
let curReqNum = 0

async function reqLock () {
  console.log(curReqNum >= MAX_REQUEST_NUM)
  if (curReqNum >= MAX_REQUEST_NUM) {
    console.log('A task push into queue!')
    await new Promise(resolve => {
      waitQueue.push(resolve)
    })
  }
  curReqNum++
  return true
}

function unlockOneReq (result) {
  if (waitQueue.length) {
    waitQueue.shift()(true)
  }
  curReqNum--
  console.log('Unlock one task! The number of request is: ', curReqNum)
  if (result instanceof Error) {
    console.log('Unexpected error: ', result)
    throw result
  }
  return result
}

/**
 * 查看获取单个 image
 *
 * @param {String} url 请求 image 的 url
 */
export async function getSingleImage (url) {
  await reqLock()
  console.log('The number of current request number:', curReqNum)
  return request
    .get(url)
    .set('Referer', 'https://app-api.pixiv.net/')
    .then(unlockOneReq)
    .catch(unlockOneReq)
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
