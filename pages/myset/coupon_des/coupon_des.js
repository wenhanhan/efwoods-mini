// pages/myset/coupon_des/coupon_des.js
//导入二维码生成文件
var QR = require("../../../utils/qrcode.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment: '',
    imagePath: '',
    image: '',
    tickId:'',//优惠券id 很重要
    imgsrc: '',
    courName:'',
    teaName:'',
    deadline:'',
    state:'',
    used: '',//是否失效 1代表失效 0代表有效
    openid:'',//个人身份
    tea_openid:'',//发放该优惠券教师的身份
    first:true,//是否第一次生成
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      courName:options.courName,
      teaName:options.teaName,
      deadline:options.deadline,
      state:options.state,
      used:options.used,
      tickId:options.tickId,
      openid:wx.getStorageSync('openid'),
      tea_openid:options.tea_openid
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
    var that = this;
    if(that.data.state==0&&that.data.first==true){
      wx.showLoading({
        title: '核销码生成中',
      })
    }

    //二维码内容
    var url = that.data.tickId + '/' + that.data.openid + '/' + that.data.tea_openid
    var st = setTimeout(function () {
      var size = that.setCanvasSize();
      //绘制二维码
      that.createQrCode(url, "mycanvas", size.w, size.h);//绘制位置与view绑定
      wx.hideLoading();
      clearTimeout(st);
    }, 1000)

  },

//新绘制算法
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 320;//不同屏幕下canvas的适配比例；设计稿是750宽
      var scale2 = 750 / 340;//不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      var height = res.windowWidth / scale2;//canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  }, 
  createQrCode: function (url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url, canvasId, cavW, cavH);
    setTimeout(() => { this.canvasToTempImage(); }, 1000);

  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      height: 500,
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        console.log(tempFilePath);
        that.setData({
          imagePath: tempFilePath//存入data中
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  //预览二维码照片
  previewImg: function (e) {
    var img = this.data.imagePath;
    console.log(img);
    this.setData({
      first:false
    })
    if (img.length == 0) {

    } else {
      wx.previewImage({
        current: img, // 当前显示图片的http链接
        urls: [img] // 需要预览的图片http链接列表
      })
    }

  },
  //调用button事件绘制二维码
  nextstep: function (e) {
    var that = this;
    var url = that.data.comment;//二维码内容
    var st = setTimeout(function () {
      var size = that.setCanvasSize();
      //绘制二维码
      that.createQrCode(url, "mycanvas", size.w, size.h);//绘制位置与view绑定
      clearTimeout(st);
    }, 1000)

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