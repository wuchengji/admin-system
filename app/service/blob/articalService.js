'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  constructor (ctx) {
    super(ctx);
    this.blobDataBase = this.app.mysql.get('db1')
  }

  /**
   * 文章列表
   * @param page
   * @param pageSize
   * @returns {Promise<any>}
   */
  async getArticalListByPage(page, pageSize, title = '') {
    const sql = `
      SELECT article.*,type_name
      FROM article LEFT JOIN article_type on
      article.type_id=article_type.id
      where article.status!=-1
      AND article.title LIKE '%${title}%'
      ORDER BY id asc
      LIMIT ${pageSize} OFFSET ${(page-1) * pageSize}
    `
    const data = await this.blobDataBase.query(sql)
    const totalRows = await this.blobDataBase.query(`
      select count(*) as total from article where status!=-1
      AND article.title LIKE '%${title}%'
    `)
    return {
      data,
      total: totalRows[0].total,
      currentPage: page,
      pageSize: pageSize
    }
  }

  /**
   * 添加文章
   * @param articalType
   * @param title
   * @param content
   * @param introduce
   * @returns {Promise<*>}
   */
  async addArtical(articalType, title, content, introduce, status) {
    const result = await this.blobDataBase.insert('article', {
      type_id: articalType,
      user_id: this.ctx.userInfo.id,
      title: title,
      article_content: content,
      introduce: introduce,
      status: status,
      create_time: this.blobDataBase.literals.now,
      update_time: this.blobDataBase.literals.now
    })
    return result
  }

  /**
   * 根据ID查询文章详情
   * @param id
   * @returns {Promise<any>}
   */
  async findArticleInfoById(id) {
    const sql = `
      select article.*,type_name from article
        left join article_type on article.type_id=article_type.id
        where 
          article.id=${id}
          and
          article.status in (1, 0)
        limit 1
    `
    const result = await this.blobDataBase.query(sql)
    return  result
  }

  /**
   * 更新文章
   * @param id
   * @param value
   * @returns {Promise<*>}
   */
  async updateArticleInfoById(id, value) {
    const result = await this.blobDataBase.update('article', {
      ...value,
      update_time: this.blobDataBase.literals.now
    },{
      where: { id: id }
    })
    return  result
  }

  /**
   * 文章类型列表
   * @param page
   * @param pageSize
   * @returns {Promise<{total: number | {jsMemoryEstimate: number; jsMemoryRange: [number, number]} | PaymentItem, data: any, pageSize: *, currentPage: *}>}
   */
  async getArticalTypeListByPage(page, pageSize){
    const data = await this.blobDataBase.select('article_type', {
      where: { status: [1, 0] },
      limit: pageSize,
      offset: (page-1)*pageSize
    })
    const totalRows = await this.blobDataBase.query('select count(*) as total from article_type where status!=-1')
    return {
      data,
      total: totalRows[0].total,
      currentPage: page,
      pageSize: pageSize
    }
  }

  /**
   * 新增文章类型
   * @param typeName
   * @returns {Promise<*>}
   */
  async addArticalType(typeName) {
    const result = await this.blobDataBase.insert('article_type', {
      type_name: typeName
    })
    return result
  }

  /**
   * 查询文章类型详情
   * @param typeName
   * @returns {Promise<any>}
   */
  async findArticalTypeByName(typeName) {
    const result = await this.blobDataBase.select('article_type', {
      where: { type_name: typeName, status: [0, 1] },
      limit: 1
    })
    return result
  }

  /**
   * 编辑文章类型
   * @param id
   * @param typeName
   * @returns {Promise<*>}
   */
  async updateArticalTypeById(id, value) {
    const result = await this.blobDataBase.update('article_type', {
      ...value
    },{
      where: { id: id }
    })
    return result
  }

  /**
   * 根据文章类型查询文章详情
   * @param id
   * @returns {Promise<any>}
   */
  async findArticalByTypeId(id) {
    const result = await this.blobDataBase.select('article', {
      where: { type_id: id }
    })
    return result
  }

}

module.exports = UserService
