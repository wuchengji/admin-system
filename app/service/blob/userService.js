'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  constructor (ctx) {
    super(ctx);
    this.blobDataBase = this.app.mysql.get('db1')
  }

  /**
   * 根据账号密码查询用户信息
   * @param account
   * @param password
   * @returns {Promise<any>}
   */
  async findUserWithAccountAndPwd(account, password) {
    const result = await this.blobDataBase.select('admin',{
      where: { account, password }
    })
    return result
  }

  /**
   * 管理员列表
   * @param page
   * @param pageSize
   * @returns {Promise<{total: number | {jsMemoryEstimate: number; jsMemoryRange: [number, number]} | PaymentItem, data: any, pageSize: *, currentPage: *}>}
   */
  async getAdminUserListByPage(page, pageSize) {
    const data = await this.blobDataBase.select('admin', {
      where: { status: [1, 0] },
      limit: pageSize,
      offset: (page-1)*pageSize
    })
    const totalRows = await this.blobDataBase.query('select count(*) as total from admin where status!=-1')
    return {
      data,
      total: totalRows[0].total,
      currentPage: page,
      pageSize: pageSize
    }
  }

  /**
   * 新增用户
   * @param account
   * @param password
   * @param avatar
   * @param name
   * @returns {Promise<any>}
   */
  async insertUser(account, password, avatar = null, name) {
    const result = await this.blobDataBase.insert('admin', {
      account,
      password,
      avatar,
      name,
      status: 1,
      create_time: this.blobDataBase.literals.now
    })
    return result
  }

  /**
   * 根据账号查询用户信息
   * @param account
   * @returns {Promise<any>}
   */
  async findUserByAccount(account) {
    const result = await this.blobDataBase.select('admin',{
      where: { account }
    })
    return result
  }

  /**
   * 根据id查询用户信息
   * @param account
   * @returns {Promise<any>}
   */
  async findUserByUserId(userId) {
    const result = await this.blobDataBase.select('admin',{
      where: { id: userId }
    })
    return result
  }

  /**
   * 更新用户信息
   * @param userId
   * @param value
   * @returns {Promise<*>}
   */
  async updateUserById(userId, value) {
    const result = await this.blobDataBase.update('admin', {
      ...value,
      update_time: this.blobDataBase.literals.now
    }, {
      where: { id: userId }
    })
    return result
  }

  /**
   * 删除用户
   * @param userId
   * @returns {Promise<*>}
   */
  async deleteUserById(userId) {
    const result = await this.blobDataBase.update('admin', {
      status: -1,
      update_time: this.blobDataBase.literals.now
    }, {
      where: { id: userId }
    })
    return result
  }
}

module.exports = UserService
