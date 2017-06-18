import fs from 'fs'

/**
 * 检测对象是否是数组
 *
 * @param {any} object 需要检测的对象
 * @returns Boolean
 */
export function isArray (object) {
  return Object.prototype.toString.call(object) === '[object Array]'
}

/**
 * 检测对象是否是函数
 *
 * @param {any} object 需要检测的对象
 * @returns Boolean
 */
export function isFunction (object) {
  return Object.prototype.toString.call(object) === '[object Function]'
}

/**
 * 异步写入文件
 *
 * @param {String} path 文件路径
 * @param {File} file 文件
 * @returns Promise<boolean>
 */
async function writeFile (path, file) {
  let reader = new FileReader()

  reader.readAsArrayBuffer(file, 'utf8')
  let data = await new Promise((resolve, reject) => {
    reader.onloadend = evt => {
      resolve(Buffer.from(reader.result))
    }
  })

  return new Promise((resolve, reject) => {
    fs.writeFile(path + file.name, data, err => {
      if (err) {
        reject(err)
        return
      }
      resolve(true)
    })
  })
}

/**
 * 导出文件对象
 *
 * @param {String} path 文件目录
 * @param {File} file 需要导出的文件
 * @returns Promise<Boolean>
 */
function exportSingleFile (path, file) {
  return writeFile(path, file)
}

/**
 * 导出多个文件对象
 *
 * @param {String} path 文件目录
 * @param {Array<File>} files 文件对象数组
 * @return Promise<Boolean[]>
 */
function exportMultiFiles (path, files) {
  return Promise.all(
    files.map(
      file => exportSingleFile(path, file)
    )
  )
}

/**
 * 导出所有文件
 *
 * @export utils/exportFiles
 * @param {String} path 文件目录
 * @param {(File|File[])[]} files 文件对象数组
 */
export function exportFiles (path, files, onItemSuccess, onItemFailed) {
  return Promise.all(files.map(val => {
    let promise = isArray(val) ? exportMultiFiles(path, val) : exportSingleFile(path, val)
    if (isFunction(onItemSuccess)) promise.then(result => { return (onItemSuccess(result), result) })
    if (isFunction(onItemFailed)) promise.catch(err => { return (onItemFailed(err), null) })
    return promise
  }))
}

/**
 * 将日期转化为参数字符串
 *
 * @param {Date} date 需要转换的日期
 * @return {String} 参数字符串 YYYY-MM-DD
 */
export function transformDate (date) {
  return date ? `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}` : null
}
