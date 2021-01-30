// pages/daily_exercise_des/daily_exercise_des.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    intro:'平板支撑（plank）是一种类似于俯卧撑的肌肉训练方法，但无需上下撑起运动，在锻炼时主要呈俯卧姿势，身体呈一线保持平衡，可以有效的锻炼腹横肌，被公认为训练核心肌群的有效方法。',
    courses:[
      {
        url:'',
        img:'https://cdn.icloudapi.cn/daily-exercise.png',
        title:'平板支撑入门',
        duration:'2分钟'
      },
      {
        url:'',
        img:'https://cdn.icloudapi.cn/daily-exercise.png',
        title:'平板支撑入门',
        duration:'2分钟'
      },
      {
        url:'',
        img:'https://cdn.icloudapi.cn/daily-exercise.png',
        title:'平板支撑入门',
        duration:'2分钟'
      },
      {
        url:'',
        img:'https://cdn.icloudapi.cn/daily-exercise.png',
        title:'平板支撑入门',
        duration:'2分钟'
      }
    ],
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
    this.setData({
      userInfo:wx.getStorageSync('userInfo')
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