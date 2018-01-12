// pages/mine/mine.js
var utils = require("../../utils/util.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 2,
    loadEnd: true,
    canIUse: wx.canIUse('button.open-type.contact')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var avatar = wx.getStorageSync("avatarUrl");
    var nickname = wx.getStorageSync("nickName");
    this.setData({
      avatar:avatar,
      nickname: nickname
    })
    wx.showLoading({
      title: '加载中',
    })
    var sign = app.data.sign;
    wx.request({
      url: 'https://friend-check.playonwechat.com/api/ranking-list',
      data:{
        sign: sign,
        page: 1,
        limit: 10
      },
      success:function(res){        
        var rankingList = res.data.rankingList;
        console.log(rankingList);
        that.setData({
          array: rankingList
        })
        wx.hideLoading();
      }
    })
  },
  bottom:function(){
    var that = this;
    var loadEnd = that.data.loadEnd; 
    var sign = app.data.sign;
    var oldPage = this.data.page;
    var oldList = this.data.array;
    if(loadEnd){
      that.setData({
        loadEnd: false
      })
      wx.request({
        url: 'https://friend-check.playonwechat.com/api/ranking-list',
        data: {
          sign: sign,
          page: oldPage,
          limit: 10
        },
        success: function (res) {
          var rankingList = res.data.rankingList;

          if (rankingList !== '') {
            var newList = oldList.concat(rankingList);
            oldPage++;
            that.setData({
              array: newList,
              page: oldPage,
              loadEnd: true
            })
          } else {
            wx.showToast({
              title: '没有更多了',
              image: "../../resource/images/warn.png",
              duration: 800
            })
          }

        }
      })
    }
    
  },

  //制作奖状
  makeCerti:function(e){
    var answerer_uid = e.target.dataset.id;
    var set_number = e.target.dataset.number;
    wx.navigateTo({
      url: '../certificate/certificate?answerer_uid=' + answerer_uid + '&set_number=' + set_number,
    })
  },
  login:function(){
    var that = this;
    var sign = app.data.sign;
    var avatar = wx.getStorageSync("avatarUrl");
    var nickname = wx.getStorageSync("nickName");

    if (nickname && avatar){
      that.setData({
        avatar: avatar,
        nickname: nickname
      })
    }else{
      utils.auth(function(){
        var avatar = wx.getStorageSync("avatarUrl");
        var nickname = wx.getStorageSync("nickName");
        that.setData({
          avatar: avatar,
          nickname: nickname
        })
      });
    }
    
  },
  deleteItem:function(e){
    var that = this;
    var sign = wx.getStorageSync("sign");
    var asid = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    console.log(asid);
    wx.showModal({
      title: '温馨提示',
      content: '是否确定删除朋友 “' + name + '” 的答题记录',
      success:function(res){
        if(res.confirm){
          wx.request({
            url: 'https://friend-check.playonwechat.com/api/delete-answer-stat',
            data:{
              sign:sign,
              asid: asid
            },
            success:function(res){
              console.log("删除",res);
              if(res.data.status){
                var array = that.data.array;
                for(var i=0;i<array.length;i++){
                  if(asid == array[i].asid){
                    array.splice(i,1);
                  }
                }
                that.setData({
                  array: array
                })
                wx.showToast({
                  title: '删除成功',
                })
              }
            }
          })
        }
      }
    })
  },
  toSearch(){
    wx.navigateTo({
      url: '../answer_list/answer_list?source=mine'
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "默契大考验",
      path: "/pages/mine/mine"
    }
  },
  backHome: function () {
    wx.switchTab({
      url: '../index/index'
    })
  }
})