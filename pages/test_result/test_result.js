// pages/test_result/test_result.js
var app=getApp();
var common = require('../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headimg:'',
    result:'',
    score:'',
    qrcode:'https://cdn.icloudapi.cn/lijiashu_qrcode.jpg',
    banner:'https://cdn.icloudapi.cn/test_banner4.jpg',
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
    bk_img:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var bk_img;
    console.log(options)
    switch (options.result){
      case '1':
        bk_img='https://cdn.icloudapi.cn/result01.png';
        break;
      case '2':
        bk_img='https://cdn.icloudapi.cn/result02.png';
        break;
      case '3':
        bk_img='https://cdn.icloudapi.cn/result03.png';
        break;
    }
    this.setData({
      result:options.result,
      score:options.score,
      bk_img:bk_img
    })
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
          canvas_width: 2 * res.screenWidth * 0.75,
          canvas_height: 2 * 667 * 0.68 * (res.windowWidth / 375),
          headimg:wx.getStorageSync('userInfo').avatarUrl
        })
      },
    })
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
  this.setData({
    visible1: false
  })
  //生成分享卡片或分享好友
  const index = detail.index + 1;
  console.log(index)
  if(index==2){
    this.shengcheng()
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
      scene:1,
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
  var score=that.data.score+'分';
  var bk =that.data.bk_img;
  console.log(bk)
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
      context.setFontSize(28 * rpx);
      context.setFillStyle('#373737');
      context.fillText(name, 130 * rpx, 53 * rpx)
      context.setFontSize(26 * rpx);
      context.setFillStyle('#565656');
      context.fillText(tip, 130 * rpx, 105 * rpx)
      context.setFontSize(36 * rpx);
      context.setFillStyle('#F90707');
      context.fillText(score, 250 * rpx, 423 * rpx)
      context.draw(true);
      common.getImgInfo(headimg)
        .then(res => {
          context.save()
          context.beginPath()
          context.arc(66 * rpx, 66 * rpx, 46 * rpx, 0, 2 * Math.PI) //圆形框
          context.setStrokeStyle('white')
          context.setLineWidth("12");
          context.stroke()
          context.fill()
          context.clip()
          context.drawImage(res.path, 20 * rpx, 20 * rpx, 92 * rpx, 92 * rpx)
          //绘制推广码
          common.getImgInfo(that.data.wxcode)
            .then(res => {
              context.beginPath()
              context.arc(280 * rpx, 780 * rpx, 60 * rpx, 0, 2 * Math.PI) //圆形框
              context.fill()
              context.clip()
              context.drawImage(res.path, 220 * rpx, 720 * rpx, 120 * rpx, 120 * rpx)
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
  preview:function(){
    var qrcode=this.data.qrcode
    wx.previewImage({
      current: qrcode, // 当前显示图片的http链接
      urls: [qrcode] // 需要预览的图片http链接列表
    })
  },
  save:function(){
    var qrcode=this.data.qrcode;
    wx.getImageInfo({
      src: qrcode,
      success (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success(res1){
            wx.showToast({
              title: '已保存',
              icon: 'success',
              duration: 1000
            })
          }
        })
      }
    })
  },
  //重新测试
  again:function(){
    wx.navigateBack({
      delta: 1
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
    var that=this;
    return {
      title: '千万不要让孩子输在注意力上！',
      path: '/pages/test/test'
    }
  }
})