// pages/myset/spread_card/spread_card.js
var common = require('../../../utils/common.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pixelRatio: '',//像素比
    rpx: '',//单位换算
    canvas_width: '',
    canvas_height: '',
    maskHidden: true,
    wxcode: ''
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
    var that = this;
    var openid=wx.getStorageSync('openid')
    //获取机器屏幕宽度
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
    //
    //生成推广码
    wx.showLoading({
      title: '生成中…',
    })
    console.log(openid)
    wx.request({
      // url: 'http://localhost/wx/getCode.php', 
      url: app.globalData.url + 'index/Qrcode/getWXACode',
      data: {
        scene: openid,
        width: 280,
        page: 'pages/share/share'
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
        that.shengcheng()
      }
    })
  },
  //生成推广海报
  shengcheng: function () {
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
    var bk ='https://cdn.icloudapi.cn/spread_bg.png'
    var name = wx.getStorageSync('userInfo').nickName;
    var headimg = wx.getStorageSync('userInfo').avatarUrl;
    var context = wx.createCanvasContext('mycanvas');
    context.save();
    // context.drawImage(bk, 0, 0, canvas_width, canvas_height);
    //异步绘图
    //绘制头像
    common.getImgInfo(bk)
      .then(res=>{
        context.drawImage(res.path, 0, 0, canvas_width, canvas_height);
        //绘制姓名
        // context.setFontSize(32 * rpx);
        context.setFillStyle('#ffffff');
        context.font="normal bold 32px sans-serif"
        context.fillText(name, 200 * rpx, 130 * rpx)
        context.draw(true);
        common.getImgInfo(headimg)
          .then(res => {
            context.save()
            context.beginPath()
            context.arc(120 * rpx, 150 * rpx, 64 * rpx, 0, 2 * Math.PI) //圆形框
            context.setStrokeStyle('white')
            context.setLineWidth("12");
            context.stroke()
            context.fill()
            context.clip()
            context.drawImage(res.path, 56 * rpx, 86 * rpx, 128 * rpx, 128 * rpx)
            //绘制推广码
            common.getImgInfo(that.data.wxcode)
              .then(res => {
                context.beginPath()
                context.arc(580 * rpx, 1192 * rpx, 80 * rpx, 0, 2 * Math.PI) //圆形框
                context.fill()
                context.clip()
                context.drawImage(res.path, 500 * rpx, 1112 * rpx, 160 * rpx, 160 * rpx)
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
        wx.showToast({
          title: '已保存',
          icon: 'success',
          duration: 1000
        })
        // wx.showModal({
        //   content: '图片已保存到相册，赶紧晒一下吧~',
        //   showCancel: false,
        //   confirmText: '好的',
        //   confirmColor: '#333',
        //   success: function (res) {
        //     if (res.confirm) {
        //       console.log('用户点击确定');
        //       /* 该隐藏的隐藏 */
        //       that.setData({
        //         maskHidden: false
        //       })
        //     }
        //   }, fail: function (res) {
        //     console.log(11111)
        //   }
        // })
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

  }
})