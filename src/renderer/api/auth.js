import request from 'superagent'

/**
 * pixiv 帐号登录
 *
 * @export api/auth/login
 * @param {String} username 帐号
 * @param {String} password 密码
 */
export function login (username, password) {
  return request
    .post('https://oauth.secure.pixiv.net/auth/token')
    .type('form')
    .send({
      username,
      password,
      grant_type: 'password',
      client_id: 'bYGKuGVw91e0NMfPGp44euvGt59s',
      client_secret: 'HP3RmkgAmEGro0gn1x9ioawQE8WMfvLXDz3ZqxpK'
    })
}
