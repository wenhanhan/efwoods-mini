// pages/myset/signSet/signSet.js
var QR = require("../../utils/qrcode.js")
const { $Toast } = require('../../dist/base/index');
var app=getApp()
Page({

  /**
   * 页面的初始数据 
   */
  data: {
    comment: '',
    imagePath: '',
    is_cour: false,
    openid:'',//教师身份
    cour_id:'',//课程id
    key: 'wenhan',
    image: '',
    imgsrc: '',
    sign_course:[]//签到课程
  },

  sign_code(e) {
    var that = this;
    wx.showLoading({
      title: '课程码生成中',
    })
    var cour_id=e.currentTarget.dataset.courid;
    var openid=wx.getStorageSync('openid')
    const url =cour_id+'/'+openid;//签到二维码文本信息(课程id+教师身份)
    var st = setTimeout(function () {
      var size = that.setCanvasSize();
      //绘制二维码
      that.createQrCode(url, "mycanvas", size.w, size.h);//绘制位置与view绑定
      wx.hideLoading();
      //生成二维码以后显示
      console.log(that.data.imagePath)
      clearTimeout(st);
    }, 1000)
      
  },

//签到记录跳转
  sign_record:function(e){
    var cour_id=e.currentTarget.dataset.courid;//课程id
    wx.navigateTo({
      url: '../signRecord/signRecord?cour_id='+cour_id,
    })
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
        $Toast({
          content: '课程签到码',
          duration: 0,
          mask: true,
          image: tempFilePath
          // image: 'https://i.loli.net/2017/08/21/599a521472424.jpg'
        });
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
    var openid=wx.getStorageSync('openid');
    wx.request({
      url: app.globalData.url +'index/SetSign/getSigncCourse',
      data:{
        openid:openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data)
        that.setData({
          sign_course:res.data
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