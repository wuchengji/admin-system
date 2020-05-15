'use strict'
const jwt = require('jsonwebtoken');

module.exports = (options, app) => {
  return async function jwk(ctx, next) {
    try {
      const res = jwt.verify(ctx.header['wcj-blob-token'], 'wcj-blob-admin')
      ctx.userInfo = res
      await next()
    }catch (e) {
      if(e.message === 'jwt expired') {
        return ctx.body = ctx.helper.responseStatusHandler(app.statusCode.TOKEN_ERROR, null, 'token已过期，请重新登录！')
      } else if(e.message === 'invalid token' || e.message === 'invalid signature' || e.message === 'jwt malformed'){
        return ctx.body = ctx.helper.responseStatusHandler(app.statusCode.TOKEN_ERROR, null, 'token校验失败！')
      } else {
        return ctx.body = ctx.helper.responseStatusHandler(app.statusCode.ERROR, null, e.message)
      }
    }
  }
}
