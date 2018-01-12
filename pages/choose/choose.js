var utils = require("../../utils/util.js");
//获取应用实例
var app = getApp();
Page({
  data: {
  
  },
  onLoad: function (options) {
  
  },
  onShow: function () {
  
  },
  // 选择性别
  chooseSex(e){
      let that = this;
      let sex  = e.currentTarget.dataset.sex; 
      console.log(sex);
      if (sex){
        wx.switchTab({
          url: '../before/before',
        })
      }
      // wx.request({
      //   url: 'https://friend-check.playonwechat.com/api/peep-answer?sign=' + wx.getStorageSync('sign'),
      //   success: function (res) {
      //     console.log("答案", res);
      //     if (res.data.status) {
      //       that.setData({
      //         sex: sex
      //       })
      //       wx.switchTab({
      //         url: '../before/before',
      //       })
      //     } else {
      //       wx.showToast({
      //         title: res.data.msg,
      //       })
      //     }
      //   }
      // })
  }

})