const jwt = require('jsonwebtoken');

module.exports = {
  /**
   * 返回体
   * @param code
   * @param msg
   * @param data
   * @param message
   * @returns {{msg: *, code: *, data: (*|null)}}
   */
  responseStatusHandler({ code, msg }, data, message) {
    return {
      code: code,
      data: data || null,
      msg: message || msg
    }
  },
  /**
   * 生成token
   * @param value
   * @param secret
   * @returns {*|undefined}
   */
  createToken(value, secret) {
    const token  = jwt.sign(value, secret, {
      // 1 day
      expiresIn: 60 * 60 * 24
      // expiresIn: 10
    })
    return token
  },

  /**
   * 删除对象空属性
   * @param obj
   * @returns {{}}
   */
  deleteEmptyProps(obj = {}) {
    const _newObj = {}
    Object.keys(obj).forEach(prop => {
      if(obj[prop] !== undefined) {
        _newObj[prop] = obj[prop]
      }
    })
    return _newObj
  }
}
