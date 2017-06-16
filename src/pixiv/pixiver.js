import request from 'superagent'

/**
 * 转换日期格式
 * @param {Date} date 转换的时间
 */
function transformDate (date) {
  return date ? `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}` : null
}

class Pquery {
  constructor (agent) {
    if (!agent) throw Error()
    this._agent = agent
    this._tasks = Pquery.prototype
  }

  get tasks () {
    return this._tasks
  }

  get agent () {
    return this._agent
  }

  async _byRank (date, type, from, to) {
    let urls = []
    while (from < to) {
      let result = (await this.agent._api.rank(date, type, from)).body
      for (let i in result.illusts) {
        if (i >= (to - from)) break
        let val = result.illusts[i]
        if (val.page_count > 1) urls.push(val.meta_pages.map(val => val.image_urls))
        else urls.push(Object.assign({}, val.image_urls, val.meta_single_page))
      }
      from += 30
    }
    return urls
  }

  _byAuthorId (id, from, to) {}
}

class Pagent {
  constructor (loginRes) {
    if (!loginRes) loginRes = localStorage.getItem('user')
    this.access_token = loginRes.access_token
    this.refresh_token = loginRes.refresh_token
    localStorage.setItem('user', JSON.stringify(loginRes))
    this._query = new Pquery(this)
    this._api = new Papi()
  }

  get api () {
    return this._api
  }

  /**
   * 查找作品 url
   * @param {String} command
   * @param {Array} params
   */
  async query (command, ...params) {
    return this._query.tasks[`_${command}`].call(this._query, ...params)
  }

  async download (urls) {
    let result = []
    result = await Promise.all(urls.map(
      url => this.api
        .download(url)
        .then(
          result => URL.createObjectURL(new Blob([result.body], { type: result.type }))
        )
      )
    )
    return result
  }
}

class Papi {
  constructor () {
    this.header = null
  }

  get headers () {}

  auth (data) {
    return request
      .post('https://oauth.secure.pixiv.net/auth/token')
      .type('form')
      .send(data)
  }

  // 个人 api
  get profile () {}

  // 其他关于用户的 api

  // 作品 api
  rank (date, type, from) {
    let query = {
      filter: 'for_ios',
      mode: 'day',
      offset: from
    }
    if (date) query.date = transformDate(date)
    return request
      .get('https://app-api.pixiv.net/v1/illust/ranking')
      .query(query)
  }

  download (url) {
    return request
      .get(url)
      .set('Referer', 'https://app-api.pixiv.net/')
  }
}

export class Pixiver {
  constructor (pixivId, password) {
    this.pixiv_id = pixivId
    this.password = password
    this._agent = null
  }

  get agent () {
    return this._agent
  }

  async launch (pixivId, password) {
    let api = new Papi()
    let result = await api.auth({
      grant_type: 'password',
      client_id: 'bYGKuGVw91e0NMfPGp44euvGt59s',
      client_secret: 'HP3RmkgAmEGro0gn1x9ioawQE8WMfvLXDz3ZqxpK',
      username: pixivId,
      password: password
    })
    this.pixiv_id = pixivId
    this.password = password
    this._agent = new Pagent(result.body.response)
    return result
  }

  async queryUrls (command, ...params) {
    if (this._agent === null) this._agent = new Pagent()
    return this.agent.query(command, ...params)
  }

  async exportResources (urls) {
    if (this._agent === null) this._agent = new Pagent()
    return this.agent.download(urls)
  }
}
