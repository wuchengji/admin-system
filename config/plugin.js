'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  mysql:{
    enable: true,
    package: 'egg-mysql'
  },
  alinode:{
    enable: true,
    package: 'egg-alinode'
  }
};
