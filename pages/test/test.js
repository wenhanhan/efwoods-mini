// pages/test/test.js
var app=getApp();
var common = require('../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible1: false,
    actions1: [
        {
          name: '分享给好友',
          icon: 'share',
          openType: 'share'
      },
        {
            name: '生成分享卡片'
        }
    ],
    pixelRatio: '',//像素比
    rpx: '',//单位换算
    canvas_width: '',
    canvas_height: '',
    maskHidden: false,
    wxcode: '',
    save_btn:false,
    test_num:0
  },
  test:function (){
    var userInfo=wx.getStorageSync('userInfo')
    if(userInfo){
      wx.navigateTo({
        url: '../test_subject/test_subject',
      })
    }else{
      app.login()
    }
  },
  //分享按钮
  handleOpen1 () {
    this.setData({
        visible1: true
    });
},
handleCancel1 () {
  this.setData({
      visible1: false
  });
},
handleClickItem1 ({ detail }) {
  var userInfo=wx.getStorageSync('userInfo')
  this.setData({
    visible1: false
  })
  //生成分享卡片或分享好友
  const index = detail.index + 1;
  console.log(index)
  if(index==2){
    if(userInfo){
      this.shengcheng()
    }else{
      app.login()
    }
  }
},
shengcheng:function(){
  var that=this;
  var openid=wx.getStorageSync('openid')
  that.setData({
    maskHidden:true,
    imagePath:''
  })
   //生成推广码
   wx.showLoading({
    title: '生成中…',
  })
  wx.request({
    // url: 'http://localhost/wx/getCode.php', 
    url: app.globalData.url + 'index/Qrcode/getWXACode',
    data: {
      scene: 1,
      width: 280,
      page: 'pages/test/test'
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {
      console.log(res.data)
      that.setData({
        wxcode: 'https://icloudapi.cn/efire/' + res.data
      })
      //生成海报
      that.shengcheng1()
    }
  })
},
  //生成推广海报
  shengcheng1: function () {
    var that = this;
    // this.setData({
    //   maskHidden: false
    // });
    setTimeout(function () {
      that.createNewImg();
    }, 1000)
  },
  createNewImg: function () {
    var that = this;
    console.log(that.data.wxcode)
    var rpx = that.data.rpx;
    var canvas_width = that.data.canvas_width;
    var canvas_height = that.data.canvas_height;
    // var bk = '/img/spread_bk.png';
    var bk ='https://cdn.icloudapi.cn/test_bk1.png'
    var name = that.substr(wx.getStorageSync('userInfo').nickName,6);
    var headimg = wx.getStorageSync('userInfo').avatarUrl;
    var tip='我刚刚参与了评测，快来试下吧~'
    var context = wx.createCanvasContext('mycanvas');
    context.save();
    // context.drawImage(bk, 0, 0, canvas_width, canvas_height);
    //异步绘图
    //绘制头像
    common.getImgInfo(bk)
      .then(res=>{
        context.drawImage(res.path, 0, 0, canvas_width, canvas_height);
        //绘制姓名
        context.setFontSize(32 * rpx);
        context.setFillStyle('#373737');
        context.fillText(name, 210 * rpx, 110 * rpx)
        context.setFontSize(30 * rpx);
        context.setFillStyle('#565656');
        context.fillText(tip, 210 * rpx, 180 * rpx)
        context.draw(true);
        common.getImgInfo(headimg)
          .then(res => {
            context.save()
            context.beginPath()
            context.arc(120 * rpx, 130 * rpx, 64 * rpx, 0, 2 * Math.PI) //圆形框
            context.setStrokeStyle('white')
            context.setLineWidth("12");
            context.stroke()
            context.fill()
            context.clip()
            context.drawImage(res.path, 56 * rpx, 66 * rpx, 128 * rpx, 128 * rpx)
            //绘制推广码
            common.getImgInfo(that.data.wxcode)
              .then(res => {
                context.beginPath()
                context.arc(375 * rpx, 1172 * rpx, 80 * rpx, 0, 2 * Math.PI) //圆形框
                context.fill()
                context.clip()
                context.drawImage(res.path, 295 * rpx, 1092 * rpx, 160 * rpx, 160 * rpx)
                context.draw(true)
              })
            context.draw(true)
            context.restore()
          })
        context.draw(true)
        context.restore()
        // 生成图片
        context.draw(true, setTimeout(function () {
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            quality: 1,
            canvasId: 'mycanvas',
            // width: that.data.canvas_width ,
            // height: that.data.canvas_height,
            destWidth: that.data.canvas_width,
            destHeight: that.data.canvas_height,
            success: function (res) {
              wx.hideLoading()
              var tempFilePath = res.tempFilePath;
              console.log(tempFilePath)
              that.setData({
                imagePath: tempFilePath,
                canvasHidden: true,
                save_btn:true
                // maskHidden: true
              });
            },
            fail: function (res) {
              console.log(res);
              wx.hideLoading()
              wx.showLoading({
                title: '网络繁忙，请稍后再试…',
              })
            }
          });
        }, 2000))
      })
    

  },

   //点击保存到相册
   baocun: function () {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        that.setData({
          maskHidden:false,
          save_btn:false
        })
        wx.showToast({
          title: '已保存',
          icon: 'success',
          duration: 1000
        })
      }
    })
  },
  hide:function(){
    this.setData({
      maskHidden:false,
      save_btn:false
    })
  },
    // 截取字符串,多余省略号显示
    substr: function (val, num) {
      if (val.length == 0 || val == undefined) {
        return '';
      } else if (val.length > num) {
        return val.substring(0, num) + "...";
      } else {
        return val;
      }
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          pixelRatio: res.pixelRatio,
          rpx: res.windowWidth / 375,
          canvas_width: 2 * res.screenWidth,
          canvas_height: 2 * 667 * (res.windowWidth / 375),
        })
      },
    })
    wx.request({
      url: app.globalData.url+'index/Test/getTestNum',
      data:{},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        that.setData({
          test_num:res.data
        })
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '千万不要让孩子输在注意力上！',
      path: '/pages/test/test',
      imageUrl:'https://cdn.icloudapi.cn/pingce1_banner.png'
    }
  }
})