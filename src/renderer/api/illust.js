import request from 'superagent'
import { transformDate } from '../utils'

const RESULT_LENGTH = 30
const PREFIX = 'get'

async function byRank ({ date, mode, from, to }) {
  let filter = 'for_ios'
  let result = []
  date = transformDate(date)
  while (from <= to) {
    let query = {
      filter,
      mode,
      offset: from
    }
    console.log(query)
    if (date) query.date = date
    result = result.concat(
      (await request
        .get('https://app-api.pixiv.net/v1/illust/ranking')
        .query(query)
      ).body.illusts.slice(0, to - from + 1)
    )
    from += RESULT_LENGTH
  }
  return result
}

async function byAuthor () {

}

async function byID ({ illustId, accessToken }) {
  return request
    .get('https://public-api.secure.pixiv.net/v1/works.json?include_sanity_level=true&profile_image_sizes=px_170x170%2Cpx_50x50&per_page=30&include_stats=true&image_sizes=px_128x128%2Cpx_480mw%2Clarge&page=1')
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Referer', 'http://spapi.pixiv-app.net/')
    .set('Host', 'public-api.secure.pixiv.net')
    .then(result => {
      console.log(result)
      return result
    })
    .catch(result => {
      console.log(result)
      return {}
    })
}

export default {
  [`${PREFIX}ByRank`]: byRank,
  [`${PREFIX}ByAuthor`]: byAuthor,
  [`${PREFIX}ByID`]: byID
}
