var utils = require("../../utils/util.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    second: 3
  },

  onLoad(options){
    var scene = decodeURIComponent(options.scene);
    console.log(options);
    var uid = scene.split("-")[0];
    var set_number = scene.split("-")[1];

    this.setData({
      scene: scene,
      uid: uid,
      set_number: set_number
    })

    if (scene != "undefined" && scene != "") {
      wx.redirectTo({
        url: '../begin_answer/begin_answer?uid=' + uid + '&set_number=' + set_number,
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this;
    let time = that.data.time;
    var second = that.data.second;

    let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
    var id = extConfig.kid;
    console.log("kid", extConfig.kid);

    wx.request({
      url: "https://unify.playonweixin.com/site/get-advertisements",
      data: {
        operator_id: id
      },
      success: function (res) {
        console.log(res);
        if (res.data.status) {
          var advers = res.data.adver.advers;
          var head_adver = res.data.adver.head_adver;
          var broadcasting = res.data.adver.broadcasting;
          wx.setStorageSync("advers", advers);
          wx.setStorageSync("broadcasting", broadcasting);
          that.setData({
            head_adver
          })

          var inter = setInterval(function () {
            if (second <= 1) {
              clearInterval(inter);
              if (that.data.uid != "undefined" && that.data.uid != "") {
                wx.redirectTo({
                  url: '../begin_answer/begin_answer?uid=' + that.data.uid + '&set_number=' + that.data.set_number,
                })
              }else{
                wx.switchTab({
                  url: '../before/before',
                })
              }
            }
            second--;
            console.log(second);
            that.setData({
              second,
              inter
            })
          }, 1000)
        }
      }
    })
    // 是否设置性别
    wx.request({
      url: app.data.apiurl + "api/is-set-gender?sign=" + wx.getStorageSync('sign') + '&operator_id=' + wx.getStorageSync("operator_id"),
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("是否设置性别:", res);
        var status = res.data.status;
        if (status == 1) {
          if (res.data.flag==0){ //去设置
            wx.reLaunch({
              url: '../choose/choose'
            })
          }else{  //获取性别
            // 获取性别
            wx.request({
              url: app.data.apiurl + "api/get-gender?sign=" + wx.getStorageSync('sign') + '&operator_id=' + wx.getStorageSync("operator_id"),
              header: {
                'content-type': 'application/json'
              },
              method: "GET",
              success: function (res) {
                console.log("获取性别:", res);
                console.log(res.data.sex, '性别')
                var status = res.data.status;
                if (status == 1) {
                  that.setData({
                    sex: res.data.sex,
                  })
                  wx.setStorageSync('sex', res.data.sex);
                } else {
                  console.log(res.data.msg)
                  wx.reLaunch({
                    url: '../choose/choose'
                  })
                }
                wx.hideLoading()
              }
            })
          }
         wx.setStorageSync('sex', res.data.sex);
        } else {
          console.log(res.data.msg)
          wx.reLaunch({
            url: '../choose/choose'
          })
        }
        wx.hideLoading()
      }
    })
    
  },


  jumpAd() {
    var inter = this.data.inter;
    clearInterval(inter);
    if (wx.getStorageSync('sex')){
      wx.switchTab({
        url: '../before/before',
      })
    }else{
      wx.request({
        url: app.data.apiurl + "api/is-set-gender?sign=" + wx.getStorageSync('sign') + '&operator_id=' + wx.getStorageSync("operator_id"),
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("是否设置性别:", res);
          var status = res.data.status;
          if (status == 1) {
            if (res.data.flag == 1) { //去设置
              wx.reLaunch({
                url: '../choose/choose'
              })
            } else {  //获取性别
              // 获取性别
              wx.request({
                url: app.data.apiurl + "api/get-gender?sign=" + wx.getStorageSync('sign') + '&operator_id=' + wx.getStorageSync("operator_id"),
                header: {
                  'content-type': 'application/json'
                },
                method: "GET",
                success: function (res) {
                  console.log("获取性别:", res);
                  var status = res.data.status;
                  if (status == 1) {
                    that.setData({
                      sex: res.data.sex,
                    })
                    wx.setStorageSync('sex', res.data.sex);
                  } else {
                    console.log(res.data.msg)
                    wx.reLaunch({
                      url: '../choose/choose'
                    })
                  }
                  wx.hideLoading()
                }
              })
            }
            wx.setStorageSync('sex', res.data.sex);
          } else {
            console.log(res.data.msg)
            wx.reLaunch({
              url: '../choose/choose'
            })
          }
          wx.hideLoading()
        }
      })
    }
    
  },


 
  onShareAppMessage: function () {
    return {
      path: '/pages/index/index',
      success: function (res) {
        console.log(res);
        // 转发成功
      },
      fail: function (res) {
        console.log(res);
        // 转发失败
      }
    }
  }
})
