//app.js
App({
  data:{
    nickName:"",
    dataUrl: "https://qncdn.playonwechat.com/music/hello.mp3",
    music_play: true
  },
  onLaunch: function () {
    this.getUserInfo();

    let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
    // extConfig.kid = 103;
   extConfig.kid = 99;
    console.log(extConfig.kid)
    this.data.operator_id = extConfig.kid;
    wx.setStorageSync("operator_id", extConfig.kid);
  },
  onShow:function(){
    var that = this;
    var dataUrl = that.data.dataUrl;

    wx.onBackgroundAudioStop(function () {
      console.log("音乐停止，自动循环");
      wx.playBackgroundAudio({
        dataUrl: dataUrl
      })
    });

    // wx.playBackgroundAudio({
    //   dataUrl: dataUrl
    // })

    

    wx.getSystemInfo({
      success: function (res) {
        // console.log("设备信息", res.platform)
        if (res.platform == "ios") {
          that.data.music_play = true;
          console.log("ios",that.data.music_play);
          that.data.platform = "ios";
        } else if (res.platform == "android") {
          that.data.music_play = false;
          that.data.platform = "android";
        }
      }
    })


  },
  getUserInfo:function(cb){
    
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (res) {
          console.log(res);
          if(res.code){
            wx.request({
              url: 'https://friend-check.playonwechat.com/api/new-auth?code=' + res.code + '&operator_id=' + wx.getStorageSync("operator_id"),
              success: function(res){
                console.log("授权",res);
                var sign = res.data.data.sign;
                var uid = res.data.data.uid;
                var sharecode = res.data.data.sharecode;

                that.data.sign = sign;
                that.data.uid = uid;
                that.data.sharecode = sharecode;
                wx.setStorageSync("sign", sign);
                wx.setStorageSync("uid", uid);
                
                var nickName = wx.getStorageSync("nickName");
                var avatarUrl = wx.getStorageSync("avatarUrl");
              
                typeof cb == "function" && cb(that.globalData.userInfo)
              }
            })
          }        
          
        }
      })
    }
  },
  globalData:{
    userInfo:null
  },
  onHide:function(){
    wx.pauseBackgroundAudio();
  }
})