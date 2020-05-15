/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {
    security: {
      csrf : {
        enable: false,
        ignoreJSON: true
      }
    },
    mysql: {
      clients: {
        db1: {
          // host
          host: 'rm-bp1nrha8m4ch4x8w5co.mysql.rds.aliyuncs.com',
          // 端口号
          port: '3306',
          // 用户名
          user: 'wcj_admin',
          // 密码
          password: 'WUchengji7218508@@',
          // 数据库名
          database: 'blob_database',
        }
      },
      // 是否加载到 app 上，默认开启
      app: true,
      // 是否加载到 agent 上，默认关闭
      agent: false,
    },
    alinode: {
      server: 'wss://47.114.37.239:8080',
      appid: '84857',
      secret: '3f962bec84342c1c1c4874f527ecb1ce70cb4d78',
      logdir: '',
      error_log: [],
      agentidMode:''
    }
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1587609198093_2540';

  // add your middleware config here
  config.middleware = [
    'params',
    'jwt'
  ];

  config.jwt = {
    ignore: [
      '/admin/login'
    ]
  }

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
