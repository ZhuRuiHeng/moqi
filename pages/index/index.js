// pages/before/before.js
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
              // if (that.data.uid != "undefined" && that.data.uid != "") {
              //   wx.redirectTo({
              //     url: '../begin_answer/begin_answer?uid=' + that.data.uid + '&set_number=' + that.data.set_number,
              //   })
              // }else{
                wx.switchTab({
                  url: '../before/before',
                })
              //}
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
  },


  jumpAd() {
    var inter = this.data.inter;
    clearInterval(inter);
    wx.switchTab({
      url: '../before/before',
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
