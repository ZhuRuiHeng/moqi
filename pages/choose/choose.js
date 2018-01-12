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
      let gender = e.currentTarget.dataset.gender; 
      console.log(gender);
      // 选择性别
      wx.request({
        url: app.data.apiurl + "api/chosen-gender?sign=" + wx.getStorageSync('sign') + '&operator_id=' + wx.getStorageSync("operator_id"),
        data: {
          gender: gender
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("选择性别结果:", res);
          var status = res.data.status;
          if (status == 1) {
            wx.hideLoading()
            wx.setStorageSync('sex', gender);
            wx.switchTab({
              url: '../before/before'
            })
          } else {
            console.log(res.data.msg);
            wx.showToast({
              title: ''+res.data.msg+'',
              icon: 'success',
              duration: 3000
            })
            // 获取性别
            wx.request({
              url: app.data.apiurl + "api/get-gender?sign=" + wx.getStorageSync('sign') + '&operator_id=' + wx.getStorageSync("operator_id"),
              header: {
                'content-type': 'application/json'
              },
              method: "GET",
              success: function (res) {
                console.log("获取性别:", res);
                console.log(res.data.sex, '是否')
                var status = res.data.status;
                if (status == 1) {
                  that.setData({
                    sex: res.data.sex,
                  })
                  wx.setStorageSync('sex', res.data.sex);
                } 
                wx.hideLoading()
              }
            })
            wx.switchTab({
              url: '../before/before'
            })
          }
          
        }
      })
  }

})