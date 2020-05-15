'use strict';

const Controller = require('egg').Controller;

class ArticalController extends Controller{
  constructor(ctx) {
    super(ctx)
    this.blobArticalService = ctx.service.blob.articalService
    this.statusCode = ctx.app.statusCode
    this.responseStatusHandler =  ctx.helper.responseStatusHandler
    this.deleteEmptyProps = ctx.helper.deleteEmptyProps
  }

  /**
   * 文章列表
   * @returns {Promise<*>}
   */
  async getArticlaList() {
    const { ctx } = this;
    const { page, pageSize, title } = ctx.params
    if(!page || !pageSize) {
      return ctx.body = this.responseStatusHandler(this.statusCode.EMPTY_PARAMS)
    }
    const res = await this.blobArticalService.getArticalListByPage(Number(page), Number(pageSize), title)
    return ctx.body = this.responseStatusHandler(this.statusCode.SUCCESS, res)
  }

  /**
   * 添加文章
   * @returns {Promise<*>}
   */
  async addArtical() {
    const { ctx } = this;
    const { articalType, title, content, introduce, status } = ctx.params
    if(!articalType || !title || !content || ![1, 0].includes(status)) {
      return ctx.body = this.responseStatusHandler(this.statusCode.EMPTY_PARAMS)
    }
    let res = await this.blobArticalService.addArtical(articalType, title, content, introduce, status)
    if(res.affectedRows) {
      return ctx.body = this.responseStatusHandler(this.statusCode.SUCCESS, null, '添加成功！')
    }
    return ctx.body = this.responseStatusHandler(this.statusCode.ERROR, null, 'addArticalError')
  }

  /**
   * 根据ID查询文章详情
   * @returns {Promise<*>}
   */
  async findArticalInfoById() {
    const { ctx } = this;
    const { id } = ctx.params
    if(!id) {
      return ctx.body = this.responseStatusHandler(this.statusCode.EMPTY_PARAMS)
    }
    let res = await this.blobArticalService.findArticleInfoById(id)
    if(res && res.length) {
      return ctx.body = this.responseStatusHandler(this.statusCode.SUCCESS, res[0])
    }
    if(res && !res.length) {
      return ctx.body = this.responseStatusHandler(this.statusCode.ERROR, null, '当前文章不存在')
    }
    return ctx.body = this.responseStatusHandler(this.statusCode.ERROR, null, 'findArticalInfoByIdError')
  }

  /**
   * 修改文章
   * @returns {Promise<*>}
   */
  async updateArticalInfoById() {
    const { ctx } = this;
    const { id, articalType, title, content, introduce, status } = ctx.params
    if(!id) {
      return ctx.body = this.responseStatusHandler(this.statusCode.EMPTY_PARAMS)
    }
    let res = await this.blobArticalService.findArticleInfoById(id)
    if(res && !res.length) {
      return ctx.body = this.responseStatusHandler(this.statusCode.ERROR, null, '当前文章不存在')
    }
    let updateRes = await this.blobArticalService.updateArticleInfoById(id, this.deleteEmptyProps({ type_id: articalType, title, article_content: content, introduce, status }))
    if(updateRes.affectedRows) {
      return ctx.body = this.responseStatusHandler(this.statusCode.SUCCESS, null, '修改成功')
    }
    return ctx.body = this.responseStatusHandler(this.statusCode.ERROR, null, 'findArticalInfoByIdError')
  }

  /**
   * 批量删除文章
   * @returns {Promise<*>}
   */
  async deleteArtical() {
    const { ctx } = this;
    const { ids } = ctx.params
    if(!ids) {
      return ctx.body = this.responseStatusHandler(this.statusCode.EMPTY_PARAMS)
    }
    let idArr = ids.split(',')
    let errId = []
    for (let i = 0;i<idArr.length; i++) {
      let id = idArr[i]
      console.log(id);
      let res = await this.blobArticalService.findArticleInfoById(id)
      if(!res || !res.length) {
        errId.push(id)
      } else {
        let updateRes = await this.blobArticalService.updateArticleInfoById(id, { status: -1 })
        if(!updateRes.affectedRows) {
          errId.push(id)
        }
      }
    }
    return ctx.body = this.responseStatusHandler(this.statusCode.SUCCESS, null, `${errId.length?'id：'+errId.join(',')+'操作失败':'操作成功'}`)
  }

  /**
   * 添加文章类型
   * @returns {Promise<*>}
   */
  async addArticalType() {
    const { ctx } = this;
    const { typeName } = ctx.params
    if(!typeName) {
      return ctx.body = this.responseStatusHandler(this.statusCode.EMPTY_PARAMS)
    }
    let resCount = await this.blobArticalService.findArticalTypeByName(typeName)
    if(resCount && resCount.length) {
      return ctx.body = this.responseStatusHandler(this.statusCode.ERROR, null, '当前类型已存在')
    }
    let res = await this.blobArticalService.addArticalType(typeName)
    if(res.affectedRows) {
      return ctx.body = this.responseStatusHandler(this.statusCode.SUCCESS, null, '添加成功！')
    }
    return ctx.body = this.responseStatusHandler(this.statusCode.ERROR, null, 'addArticalTypeError')
  }

  /**
   * 编辑文章类型
   * @returns {Promise<*>}
   */
  async updateArticalType() {
    const { ctx } = this;
    const { id, typeName } = ctx.params
    if(!typeName || !id) {
      return ctx.body = this.responseStatusHandler(this.statusCode.EMPTY_PARAMS)
    }
    let resCount = await this.blobArticalService.findArticalTypeByName(typeName)
    if(resCount && resCount.length) {
      return ctx.body = this.responseStatusHandler(this.statusCode.ERROR, null, '当前类型已存在')
    }
    let res = await this.blobArticalService.updateArticalTypeById(id, {type_name: typeName})
    if(res.affectedRows) {
      return ctx.body = this.responseStatusHandler(this.statusCode.SUCCESS, null, '编辑成功！')
    }
    return ctx.body = this.responseStatusHandler(this.statusCode.ERROR, null, 'updateArticalTypeError')
  }

  /**
   * 文章类型列表
   * @returns {Promise<*>}
   */
  async getArticalTypeList() {
    const { ctx } = this;
    const { page, pageSize } = ctx.params
    if(!page || !pageSize) {
      return ctx.body = this.responseStatusHandler(this.statusCode.EMPTY_PARAMS)
    }
    const res = await this.blobArticalService.getArticalTypeListByPage(Number(page), Number(pageSize))
    return ctx.body = this.responseStatusHandler(this.statusCode.SUCCESS, res)
  }

  /**
   * 批量删除文章类型
   * @returns {Promise<*>}
   */
  async deleteArticalType() {
    const { ctx } = this;
    const { ids } = ctx.params
    if(!ids) {
      return ctx.body = this.responseStatusHandler(this.statusCode.EMPTY_PARAMS)
    }
    let idArr = ids.split(',')
    let errId = []
    for (let i = 0;i<idArr.length; i++) {
      let id = idArr[i]
      let isIncludeArtical = await this.blobArticalService.findArticalByTypeId(id)
      if(isIncludeArtical && isIncludeArtical.length) {
        errId.push(id)
        continue
      }
      let updateRes = await this.blobArticalService.updateArticalTypeById(id, { status: -1 })
      if(!updateRes.affectedRows) {
        errId.push(id)
      }
    }
    return ctx.body = this.responseStatusHandler(
      this.statusCode.SUCCESS,
      null,
      `${errId.length?'id：'+Array.from(new Set(errId)).join(',')+'操作失败':'操作成功'}`
    )
  }
}

module.exports = ArticalController;
