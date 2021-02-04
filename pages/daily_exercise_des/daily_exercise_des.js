// pages/daily_exercise_des/daily_exercise_des.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    video_id:null,
    course:{},
    userInfo:{},
    judge:[
      {
        head:'/img/head.jpeg',
        name:'文寒',
        time:'2021/01/01',
        content:'挺好的。',
        reply:[
          {
            head:'/img/head.jpeg',
            name:'张三',
            time:'2021/01/01',
            reply_content:'挺好的。',
          },
          {
            head:'/img/head.jpeg',
            name:'李四',
            time:'2021/01/01',
            reply_content:'挺好的。',
          },
          {
            head:'/img/head.jpeg',
            name:'王五',
            time:'2021/01/01',
            reply_content:'挺好的。',
          }
        ]
      },
      {
        head:'/img/head.jpeg',
        name:'文寒',
        time:'2021/01/01',
        content:'挺好的。',
        reply:[
          {
            head:'/img/head.jpeg',
            name:'测试',
            time:'2021/01/01',
            reply_content:'挺好的。',
          },
          {
            head:'/img/head.jpeg',
            name:'测试啊',
            time:'2021/01/01',
            reply_content:'挺好的。',
          }
        ]
      }
    ]
  },
  focus: function (e) {
    console.log(e)
    var height = e.detail.height;
    this.setData({
      keyboard_height: height
    })
  },
  //开始练习
  start:function(){
    var course=this.data.course
    wx.navigateTo({
      url: '../daily_exercise_start/daily_exercise_start?video_id='+this.data.video_id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      video_id: options.video_id
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
    var video_id=that.data.video_id;
    this.setData({
      userInfo:wx.getStorageSync('userInfo')
    })
    wx.request({
      url: app.globalData.url + 'index/Dailyexercise/getVideoDes',
      data: {
        video_id: video_id
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      success(res){
        console.log(res.data)
        that.setData({
          course:res.data
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