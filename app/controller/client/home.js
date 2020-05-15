'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    console.log(ctx.service)
    ctx.body = 'res';
  }
}

module.exports = HomeController;
