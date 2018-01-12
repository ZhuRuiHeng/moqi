// pages/certificate/certificate.js
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
    var that = this;
    var answerer_uid = options.answerer_uid;
    var set_number = options.set_number;
    var sign = wx.getStorageSync("sign");
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://friend-check.playonwechat.com/api/create-diploma' + '?operator_id=' + wx.getStorageSync("operator_id"),
      data: {
        sign: sign,
        anotherUserId: answerer_uid,
        set_number: set_number,
        type: 1
      },
      success:function(res){
        console.log("制作证书",res);
        var imgUrl = res.data.data.url;
        that.setData({
          imgUrl: imgUrl
        })
        wx.hideLoading();
      }
    })
  },
  prewImg: function () {
    var that = this;
    var imgUrl = that.data.imgUrl;
    wx.previewImage({
      current: imgUrl, // 当前显示图片的http链接
      urls: [imgUrl] // 需要预览的图片http链接列表
    })
  },
  downLoad: function () {
    var that = this;
    var imgUrl = that.data.imgUrl;
    if(imgUrl){
      wx.downloadFile({
        url: imgUrl, //仅为示例，并非真实的资源
        success: function (res) {   

          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              wx.showToast({
                title: '证书下载成功，请去相册查看',
                icon: 'success',
                duration: 800
              })
            }
          })
        

        }
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "默契大考验",
      path: "pages/certificate/certificate"
    }
  },
  backHome: function () {
    wx.switchTab({
      url: '../index/index'
    })
  }
})