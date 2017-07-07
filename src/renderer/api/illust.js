import request from 'superagent'
import { transformDate } from '../utils'

const PREFIX = 'get'

async function byRank ({ date, mode, from, to, type, accessToken }) {
  // let result
  date = transformDate(date)
  let query = {
    mode,
    page: 1,
    per_page: to || 1,
    include_sanity_level: true,
    profile_image_sizes: 'px_50x50',
    include_stats: true,
    image_sizes: 'small,px_480mw,medium,large'
  }
  if (date) query.date = date

  return request
    .get(`https://public-api.secure.pixiv.net/v1/ranking/${type}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Referer', 'http://spapi.pixiv-app.net/')
    .set('Host', 'public-api.secure.pixiv.net')
    .query(query)
    .then(result => {
      console.log(result)
      return result.body.response[0].works.slice(from)
    })
    .catch(response => {
      console.log(response)
      return []
    })
}

async function byAuthor () {

}

async function byID ({ illustId, accessToken }) {
  return request
    .get(`https://public-api.secure.pixiv.net/v1/works/${illustId}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Referer', 'http://spapi.pixiv-app.net/')
    .set('Host', 'public-api.secure.pixiv.net')
    .query({
      include_sanity_level: true,
      profile_image_sizes: 'px_50x50',
      include_stats: true,
      image_sizes: 'large'
    })
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
