// pages/subject/subject.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,    //下一题按钮
    setOver: 'true',    //答题是否结束,是否显示二维码
    //show_arrow: true    //弹窗显示
    idArr:[],
    click:0, //点击次数
    setting:false //点击3次可编辑
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // var set_number = options.set_number;
    // var pageSharecode = options.pageSharecode;

    // that.setData({
    //   set_number: set_number,
    //   pageSharecode: pageSharecode
    // });  

    wx.hideShareMenu();
  },

  onShow: function () {
    var that = this;
    app.getUserInfo(function(){  

      
      var avatar = wx.getStorageSync("avatarUrl");
      var nickname = wx.getStorageSync("nickName");
      var sign = app.data.sign;
      var set_number;


      // // 生成无限制二维码按钮
      // wx.request({
      //   url: 'https://friend-check.playonwechat.com/api/show-model?sign=' + sign,
      //   success: function (res) {
      //     wx.hideLoading();
      //     console.log(res);
      //     var showModel = res.data.data.showModel;

      //     that.setData({
      //       showModel: showModel
      //     })
      //   }
      // })

      that.setData({
        avatar: avatar,
        nickname: nickname,
        disabled: false
      })

console.log("sign",sign);
      wx.request({
        url: app.data.apiurl +'api/change-question' + '?operator_id=' + wx.getStorageSync("operator_id"),
        data: {
          sign: sign
        },
        success: function (res) {
          console.log("问题", res);
          var question = res.data.question;
          console.log("问题", question);
          var arr = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
          if (question.index > 10) {
            that.setData({
              setOver: 'false'
            })
          }else{
            that.setData({
              setOver: 'true'
            })
          }

          question.index = question.index - 1;
          var title = arr[question.index];
          var answer_arr = [
            { 'option': 'a', 'check': false, 'text': question.option_a }, 
            { 'option': 'b', 'check': false, 'text': question.option_b }];
          if (question.option_c) {
            var c = { 'option': 'c', "check": false, "text": question.option_c }
            answer_arr.push(c);
          }
          question = question;

          that.setData({
            question: question,
            answer_arr: answer_arr,
            qid: question.qid,
            title: title
          })
        }
      })
      // 是否允许用户编辑
      wx.request({
        url: app.data.apiurl + "api/change-v?sign=" + wx.getStorageSync('sign') + '&operator_id=' + wx.getStorageSync("operator_id"),
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("是否允许用户编辑:", res);
          var status = res.data.status;
          if (status == 1) {
            that.setData({
              flag: res.data.flag,
            })
          } else {
            console.log(res.data.msg)
          }
          wx.hideLoading()
        }
      })
    })


    
  },


  nextSubject: function(e){
    var that = this;    
   


    var disabled = that.data.disabled;
    var sign = app.data.sign;
    var service = that.data.service;
    if(disabled){

      var _formId = e.detail.formId;
      var idArr = that.data.idArr;
      var _idArr = wx.getStorageSync("idArr");
      if (_idArr && _idArr.length != 0) {
        _idArr.push(_formId);
        idArr = _idArr;
        wx.setStorageSync("idArr", idArr);
      } else {
        idArr.push(_formId);
        wx.setStorageSync("idArr", idArr);
      }

      var option = that.data.option;
      var qid = that.data.qid;
      
      wx.request({
        url: app.data.apiurl +'api/change-question' + '?operator_id=' + wx.getStorageSync("operator_id"),
        data: {
          sign: sign,
          option: option,
          qid: qid
        },
        success: function (res) {
          console.log("下一题", res);          
          var question = res.data.question;
          var set_number = question.set_number;
          console.log(question.index);
          if(question.index == 11){
            wx.request({
              url: 'https://friend-check.playonwechat.com/api/save-form-ids',
              data: {
                sign: sign,
                form_ids: JSON.stringify(idArr)
              },
              success: function (res) {
                if (res.data.status) {
                  wx.removeStorageSync("idArr");
                }
              }
            })    
          }
          if(question.index > 10){     
               
            that.setData({
              setOver: 'false'
            })
            wx.setStorageSync("set_number", set_number);
          }

          var arr = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
          question.index = question.index - 1;
          var title = arr[question.index];

          var answer_arr = [{ 'option': 'a', 'check': false, 'text': question.option_a }, { 'option': 'b','check': false, 'text': question.option_b }];
          if (question.option_c) {
            var c = { 'option': 'c', "check": false, "text": question.option_c }
            answer_arr.push(c);
          }
          question = question;

          that.setData({
            question: question,
            answer_arr: answer_arr,
            qid: question.qid,
            disabled: false,
            title: title
          })
        }
      })
    }else{
      wx.showModal({
        content: "必须要选择答案才能进行下一题哦",
        showCancel:false,
        success:function(res){
          if(res.confirm){
            console.log("用户点击了确定");
          }
        }
      })
    }
       
  },
  // 隐藏箭头弹层
  hidden_arrow:function(){
    this.setData({
      show_arrow: true
    })
  },
  // 换一题事件
  changeSubject:function(){
    var that = this;
    var sign = app.data.sign;
    let click = that.data.click;
    that.setData({
      click: click + 1
    })
    console.log(that.data.click);
    if (click >1){
      wx.showToast({
        title: '您可以自己编辑题目及答案',
        icon: 'success',
        duration: 3000
      })
      that.setData({
        setting:true
      })
    }
    
    wx.request({
      url: app.data.apiurl + 'api/change-question' + '?operator_id=' + wx.getStorageSync("operator_id"),
      data: {
        sign: sign
      },
      success: function (res) {
        
        var question = res.data.question;
        var arr = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
        question.index = question.index - 1;
        var title = arr[question.index];

        var answer_arr = [{ 'option': 'a', 'check': false, 'text': question.option_a }, { 'option': 'b', 'check': false, 'text': question.option_b }];
        if (question.option_c) {
          var c = { 'option': 'c', "check": false, "text": question.option_c }
          answer_arr.push(c);
        }
        question = question;

        that.setData({
          question: question,
          answer_arr: answer_arr,
          qid: question.qid,
          disabled: false
        })
      }
    })

  },
  // 选择答案
  choose: function(e){
   var idx = e.target.dataset.idx;
   var option = e.target.dataset.option;
   var array = this.data.answer_arr;
   for(var i=0;i<array.length;i++){
     array[i].check = false;
     array[idx].check = true;  
   }
   this.setData({
     answer_arr: array,
     disabled: true,
     option: option
   })
  },


  // 点击二维码
  shareImg:function(){
    var share_img = wx.getStorageSync("share_img");
    var sign = app.data.sign;
    var set_number = wx.getStorageSync("set_number");
    wx.showLoading({
      title: '生成中',
    })
    wx.request({
      url: app.data.apiurl+'api/save-user-question',
      data: {
        sign: sign
      },
      success: function (res) {
        set_number = res.data.set_number;
        console.log(set_number);
        wx.request({
          url: 'https://friend-check.playonwechat.com/api/create-qrcode-picture' + '?operator_id=' + wx.getStorageSync("operator_id"),
          data: {
            sign: sign,
            set_number: set_number
          },
          success: function (res) {
            console.log(res);
            wx.hideLoading();
            if(res.data.data.upper_limit){
              // wx.showToast({
              //   title: '今天获取二维码的名额抢完啦，明天请赶早哟~',
              // })
              wx.showModal({
                content: '今天获取二维码的名额抢完啦，明天请赶早哟~',
                showCancel: false
              })
            }else{
              wx.previewImage({
                current: 'res.data.data.url', // 当前显示图片的http链接
                urls: [res.data.data.url] // 需要预览的图片http链接列表
              })
              
            }
            
          }
        })
      }
    })
    
  },
  

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var uid = wx.getStorageSync("uid");
    var set_number = wx.getStorageSync("set_number");
    console.log("用户分享",uid,set_number);
    return {
      title: '看你懂不懂我？',
      path: '/pages/begin_answer/begin_answer?uid=' + uid + "&set_number=" + set_number,
      success: function (res) {
        console.log("转发成功");
      }
    }
  },


  // 转发前保存题目信息
  share: function () {
    var sign = app.data.sign;
    wx.request({
      url: app.data.apiurl +'api/save-user-question',
      data: {
        sign: sign
      },
      success: function (res) {}
    })
  },


  // 重新出题
  newObject: function () {
    var sign = app.data.sign;
    wx.removeStorageSync("set_number")
    wx.request({
      url: 'https://friend-check.playonwechat.com/api/requestion',
      data: {
        sign: sign
      },
      success: function (res) {
        if (res.data.status == 1) {
          wx.switchTab({
            url: '../before/before',
          })
        }
      }
    })
  },

  // 返回首页
  backHome: function () {
    wx.switchTab({
      url: '../index/index'
    })
  },

  previewHpl(){
    // https://qncdn.playonwechat.com//moqimoqi-hpl.png
    wx.previewImage({
      current:"https://qncdn.playonwechat.com/moqi/hpl_erwei.jpg",
      urls: ["https://qncdn.playonwechat.com/moqi/hpl_erwei.jpg"]
    })

  },

  // 跳转语录范
  // toYlf:function(){
  //   if (wx.navigateToMiniProgram) {
  //     wx.navigateToMiniProgram({
  //       appId: 'wx22c7c27ae08bb935',
  //       path: 'pages/index/index?codeId=huangrenzhen_3',
  //       extraData: {
  //       },
  //       envVersion: 'release',
  //       success(res) {
  //         // 打开成功
  //         console.log("成功", res);
  //       },
  //       fail:function(res){
  //         console.log("失败",res);
  //       }
  //     })
  //   } else {
  //     // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
  //     wx.showModal({
  //       title: '提示',
  //       content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
  //     })
  //   }
   
  // }
})