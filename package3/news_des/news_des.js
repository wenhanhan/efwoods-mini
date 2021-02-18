// package3/news_des/news_des.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    news_id:null,
    news:{},
    other_news:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      news_id:options.news_id
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
    var news_id=this.data.news_id
    wx.request({
      url: app.globalData.url + 'index/StudyAbroad/getNewsById',
      data: {
        news_id:news_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          news:res.data[0],
          other_news:res.data[1]
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
    var news_id = this.data.news_id;
    return {
      title: '向你分享了留学资讯',
      path: '/package3/news_des/news_des?news_id=' + news_id
    }
  }
})