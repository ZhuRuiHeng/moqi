//index.js
var utils = require("../../utils/util.js");
//获取应用实例
var app = getApp();

Page({
  data: {
    showAd: true
  },
  onLoad: function (options) {
    
  },

  onShow: function () {
    var that = this;
    var music_play = app.data.music_play;
    var scene = that.data.scene;
    var uid = that.data.uid;
    var set_number = that.data.set_number;
    var operator_id = wx.getStorageSync("operator_id");

    that.setData({
      music_play: music_play
    })

    

    // app.getUserInfo(function () {
    //   var sign = app.data.sign;
    //   wx.request({
    //     url: 'https://friend-check.playonwechat.com/api/show-model?sign=' + sign,
    //     success: function (res) {
    //       console.log(res);
    //       var showModel = res.data.data.showModel;

    //       if (showModel) {
    //         wx.showModal({
    //           title: '温馨提示',
    //           content: scene,
    //         })
    //       }
    //     }
    //   })
    // })

  },
  bindPlay: function () {
    var that = this;

    if (that.data.music_play == true) {
      wx.pauseBackgroundAudio();
      app.data.music_play = false;
      that.setData({
        music_play: false
      })
    } else {
      wx.playBackgroundAudio({
        dataUrl: app.data.dataUrl
      })
      app.data.music_play = true;
      that.setData({
        music_play: true
      })
    }
  },
  formSubmit: function (e) {
    var that = this;
    var _formId = e.detail.formId;
    var sign = app.data.sign;

    // 模板消息
    wx.request({
      url: 'https://friend-check.playonwechat.com/api/save-form-id?sign=' + sign,
      data: {
        form_id: _formId
      },
      success: function (res) {
        console.log("表单", res);

      }
    })

    // var nickName = wx.getStorageSync("nickName");
    // var avatarUrl = wx.getStorageSync("avatarUrl");

    // if (avatarUrl && nickName) {
    //   wx.navigateTo({
    //     url: '../subject/subject'
    //   })
    // }else{
    utils.auth(function () {
      wx.navigateTo({
        url: '../subject/subject'
      })
    })
    // }

    // if (avatarUrl && nickName) {
    //   wx.showLoading({
    //     title: '跳转中',
    //   })      

    //   wx.request({
    //     url: 'https://friend-check.playonwechat.com/api/change-question',
    //     data: {
    //       sign: sign
    //     },
    //     success: function (res) {
    //       wx.hideLoading();
    //       if(res.data.status){
    //         wx.navigateTo({
    //           url: '../subject/subject'
    //         })
    //       }else{
    //         wx.showToast({
    //           title: res.data.msg,
    //         })
    //       }         

    //     }
    //   })
    // } else {
    //   wx.hideLoading();
    //   utils.auth(function(){
    //     wx.request({
    //       url: 'https://friend-check.playonwechat.com/api/change-question',
    //       data: {
    //         sign: sign
    //       },
    //       success: function (res) {
    //         wx.hideLoading();
    //         if (res.data.status) {
    //           wx.navigateTo({
    //             url: '../subject/subject'
    //           })
    //         } else {
    //           wx.showToast({
    //             title: res.data.msg,
    //           })
    //         }
    //       }
    //     })
    //   });
    // }  
  },
  onShareAppMessage: function () {
    return {
      title: '默契大考验',
      path: '/pages/index/index'
    }
  },
  backHome: function () {
    wx.switchTab({
      url: '../index/index'
    })
  }
})
