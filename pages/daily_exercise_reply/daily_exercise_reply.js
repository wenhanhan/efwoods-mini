// pages/daily_exercise_reply/daily_exercise_reply.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    judge:
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
            to:{
              name:'文寒',
              openid:'123'
            },
          }
        ]
      },
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