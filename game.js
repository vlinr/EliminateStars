const loadTask = wx.loadSubpackage({
  name: 'package', // name 可以填 name 或者 root
  success: function (res) {
    require("weapp-adapter.js");
    require("package/libs/laya.wxmini.js");
    window.loadLib = require;
    require("index.js");
  },
  fail: function (res) {
    // 分包加载失败通过 fail 回调
  }
})
