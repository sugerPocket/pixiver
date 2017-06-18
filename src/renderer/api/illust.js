import request from 'superagent'
import { transformDate } from '../utils'

const RESULT_LENGTH = 30
const PREFIX = 'get'

async function byRank (params) {
  let { date, mode, from, to } = params
  let filter = 'for_ios'
  let result = []
  date = transformDate(date)
  while (from <= to) {
    let query = {
      filter,
      mode,
      offset: from
    }
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

export default {
  [`${PREFIX}ByRank`]: byRank,
  [`${PREFIX}ByAuthor`]: byAuthor
}
