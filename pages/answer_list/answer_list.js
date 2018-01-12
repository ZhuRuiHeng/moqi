// pages/answer_list/answer_list.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var source = options.source;
    this.setData({
      source
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var sign = wx.getStorageSync("sign");
    var diploma_number = wx.getStorageSync("diploma_number");

    var source = that.data.source;
    if (source == "end"){
      wx.request({
        url: 'https://friend-check.playonwechat.com/api/peep-answer?diploma_number=' + diploma_number + '&sign=' + sign,
        success: function (res) {
          console.log("答案", res);
          if (res.data.status) {
            wx.hideLoading();
            var list = res.data.data.question_answer_list;
            that.setData({
              list: list
            })
          }
        }
      })
    }
    
  },


  getNumber(e){
    var number = e.detail.value;
    this.setData({
      number
    })
  },

  search(){
    var that = this;
    var number = this.data.number;
    var sign = wx.getStorageSync("sign");
    wx.request({
      url: 'https://friend-check.playonwechat.com/api/peep-answer?diploma_number=' + number + '&sign=' + sign,
      success: function (res) {
        console.log("答案", res);
        if (res.data.status) {
          wx.hideLoading();
          var list = res.data.data.question_answer_list;
          that.setData({
            list: list
          })
        }else{
          wx.showToast({
            title: res.data.msg,
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})