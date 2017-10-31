import request from 'superagent'
import { transformDate } from '../utils'
import { PixivRequest } from './index'

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

  let result = []
  try {
    result = await PixivRequest.get(`ranking/${type}`, query)
    console.log(result)
    result = result.body.response[0].works.slice(from)
  } catch (e) {
    console.err(e)
  }
  return result
}

async function byAuthor () {

}

async function byID ({ illustId, accessToken }) {
  let query = {
    include_sanity_level: true,
    profile_image_sizes: 'px_50x50',
    include_stats: true,
    image_sizes: 'large'
  }
  let result = {}
  try {
    result = await PixivRequest.get(`works/${illustId}`, query)
    console.log(result)
  } catch (e) {
    console.error(e)
  }
  return result
}

export default {
  [`${PREFIX}ByRank`]: byRank,
  [`${PREFIX}ByAuthor`]: byAuthor,
  [`${PREFIX}ByID`]: byID
}
