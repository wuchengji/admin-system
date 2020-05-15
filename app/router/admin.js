module.exports = app => {
  const { router, controller } = app
  // 登录
  router.post('/admin/login', controller.admin.userController.login)
  // 新增用户
  router.post('/admin/addUser', controller.admin.userController.addAdmin)
  // 管理员列表
  router.post('/admin/getAdminUserListByPage', controller.admin.userController.getAdminUserListByPage)
  // 更新用户
  router.post('/admin/updateUserById', controller.admin.userController.updateUserById)
  // 删除用户
  router.get('/admin/deleteUserById', controller.admin.userController.deleteUserById)

  //新增文章
  router.post('/admin/addArtical', controller.admin.articalController.addArtical)
  // 文章列表
  router.post('/admin/getArticlaList', controller.admin.articalController.getArticlaList)
  // 根据id查询文章详情
  router.post('/admin/findArticalInfoById', controller.admin.articalController.findArticalInfoById)
  // 编辑文章
  router.post('/admin/updateArticalInfoById', controller.admin.articalController.updateArticalInfoById)
  // 批量删除文章
  router.post('/admin/deleteArtical', controller.admin.articalController.deleteArtical)

  // 添加文章类型
  router.post('/admin/addArticalType', controller.admin.articalController.addArticalType)
  // 编辑文章类型
  router.post('/admin/updateArticalType', controller.admin.articalController.updateArticalType)
  // 文章类型列表
  router.post('/admin/getArticalTypeList', controller.admin.articalController.getArticalTypeList)
  // 批量删除文章类型
  router.post('/admin/deleteArticalType', controller.admin.articalController.deleteArticalType)
}

