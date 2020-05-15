'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  constructor (ctx) {
    super(ctx);
    this.blobUserService = ctx.service.blob.userService

    this.statusCode = ctx.app.statusCode
    this.responseStatusHandler =  ctx.helper.responseStatusHandler
    this.createToken =  ctx.helper.createToken
    this.deleteEmptyProps = ctx.helper.deleteEmptyProps
  }
  /**
   * 登录
   * @returns {Promise<{msg: *, code: *, data: (*|null)}>}
   */
  async login() {
    const { ctx } = this;
    const { account, password } = ctx.params
    if(!account || !password) {
      return ctx.body = this.responseStatusHandler(this.statusCode.EMPTY_PARAMS)
    }
    const res = await this.blobUserService.findUserWithAccountAndPwd(account, password)
    if(res.length === 0) {
      return ctx.body = this.responseStatusHandler(this.statusCode.ERROR, null, '账号密码输入有误！')
    }
    if(res[0].status === -1) {
      return ctx.body = this.responseStatusHandler(this.statusCode.ERROR, null, '用户不存在！')
    }
    if(res[0].status === 0) {
      return ctx.body = this.responseStatusHandler(this.statusCode.ERROR, null, '用户已停用！')
    }
    const token = this.createToken({ ...res[0] }, 'wcj-blob-admin');
    ctx.body = this.responseStatusHandler(this.statusCode.SUCCESS, { token }, '登录成功！')
  }

  /**
   * 管理员列表
   * @returns {Promise<*>}
   */
  async getAdminUserListByPage() {
    const { ctx } = this;
    const { page, pageSize } = ctx.params
    if(!page || !pageSize) {
      return ctx.body = this.responseStatusHandler(this.statusCode.EMPTY_PARAMS)
    }
    const res = await this.blobUserService.getAdminUserListByPage(Number(page), Number(pageSize))
    return ctx.body = this.responseStatusHandler(this.statusCode.SUCCESS, res)
  }

  /**
   * 新增用户
   * @returns {Promise<*>}
   */
  async addAdmin() {
    const { ctx } = this;
    const { account, password, avatar, name } = ctx.params
    if(!account || !password || !name) {
      return ctx.body = this.responseStatusHandler(this.statusCode.EMPTY_PARAMS)
    }
    const isRepeat = await this.blobUserService.findUserByAccount(account)
    if(isRepeat.length) {
      return ctx.body = this.responseStatusHandler(this.statusCode.ERROR, null, '当前账户已存在！')
    }
    const res = await this.blobUserService.insertUser(account, password, avatar, name)
    if(res.affectedRows) {
      return ctx.body = this.responseStatusHandler(this.statusCode.SUCCESS, null, '添加成功！')
    }
    return ctx.body = this.responseStatusHandler(this.statusCode.ERROR, null, 'addAdminError')
  }

  /**
   * 修改用户信息
   * @returns {Promise<*>}
   */
  async updateUserById() {
    const { ctx } = this;
    const { userId, name, password, avatar, status } = ctx.params;
    if(!userId) {
      return ctx.body = this.responseStatusHandler(this.statusCode.EMPTY_PARAMS, null, 'userId不能为空！')
    }
    const _rows = await this.blobUserService.findUserByUserId(userId)
    if(!_rows.length) {
      return ctx.body = this.responseStatusHandler(this.statusCode.ERROR, null, '当前用户不存在')
    }
    const res = await this.blobUserService.updateUserById(userId, this.deleteEmptyProps({ name, password, avatar, status }))
    if(res.affectedRows) {
      return ctx.body = this.responseStatusHandler(this.statusCode.SUCCESS, null, '更新成功！')
    }
    return ctx.body = this.responseStatusHandler(this.statusCode.ERROR, null, 'updateUserByIdError')
  }

  /**
   * 删除用户
   * @returns {Promise<*>}
   */
  async deleteUserById() {
    const { ctx } = this;
    const { userId } = ctx.params;
    if(!userId) {
      return ctx.body = this.responseStatusHandler(this.statusCode.EMPTY_PARAMS, null, 'userId不能为空！')
    }
    const _rows = await this.blobUserService.findUserByUserId(userId)
    if(!_rows.length) {
      return ctx.body = this.responseStatusHandler(this.statusCode.ERROR, null, '当前用户不存在')
    }
    const res = await this.blobUserService.deleteUserById(userId)
    if(res.affectedRows) {
      return ctx.body = this.responseStatusHandler(this.statusCode.SUCCESS, null, '删除成功！')
    }
    return ctx.body = this.responseStatusHandler(this.statusCode.ERROR, null, 'updateUserByIdError')
  }
}

module.exports = UserController;
