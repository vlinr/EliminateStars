

const loadTask = wx.loadSubpackage({
  name: 'package', // name 可以填 name 或者 root
  success: function (res) {
    require("weapp-adapter.js");
    require("package/libs/laya.wxmini.js");
    window.Parser = require('./domparser/dom-parser.js');
    window.loadLib = require;
    require("index.js");
  },
  fail: function (res) {
    // 分包加载失败通过 fail 回调
    console.log('加载失败');
  }
})
loadTask.onProgressUpdate(res => {
  console.log('下载进度', res.progress)
  // console.log('已经下载的数据长度', res.totalBytesWritten)
  // console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
})