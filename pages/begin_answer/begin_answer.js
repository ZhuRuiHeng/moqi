//index.js
//获取应用实例
var app = getApp();
var util = require("../../utils/util.js");
Page({
  data: {
  },
  onLoad: function (options) {
    console.log(options,"begin_answer");
    var that = this;
    var uid = options.uid;
    var set_number = options.set_number;
    
    that.setData({
      uid: uid,
      set_number: set_number
    })    
    wx.hideShareMenu({})
  },
  onShow: function(){
    var that = this;
    var music_play = app.data.music_play;
    that.setData({
      music_play: music_play
    })
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
  naviSubject: function (e) {
    var _formId = e.detail.formId;
    var that = this;
  
    var sharecode = app.data.sharecode;
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
   

    var avatar = wx.getStorageSync("avatarUrl");
    var nickname = wx.getStorageSync("nickName");
    var uid = that.data.uid;
    var set_number = that.data.set_number;
console.log("跳转前",uid,set_number)
    if (nickname && avatar) {
      wx.showLoading({
        title: '跳转中',
      })  
      wx.navigateTo({
        url: '../answer/answer?uid=' + uid + '&set_number=' + set_number, 
      })    
    } else {
      util.auth(function(){
        wx.navigateTo({
          url: '../answer/answer?uid=' + uid + '&set_number=' + set_number, 
        })
      });
    }

      
  }
})
