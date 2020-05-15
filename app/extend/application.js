module.exports = {
  get statusCode() {
    return {
      SUCCESS: {
        code: 10000,
        msg: '请求成功'
      },
      EMPTY_PARAMS: {
        code: 10001,
        msg: '参数不能为空'
      },
      TOKEN_ERROR: {
        code: 30001,
        msg: 'token失效'
      },
      ERROR: {
        code: 20001,
        msg: '通用错误'
      }
    }
  }
}
