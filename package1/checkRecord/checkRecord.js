// pages/myset/checkRecord/checkRecord.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      money:'',
      courName:'',
      sum:'',
      used:'',
      checked:'',
      deadline:'',
      tickId:'',
      get_list:[]//领取人员列表
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      courName:options.courName,
      money:options.money,
      used:options.used,
      checked:options.checked,
      deadline:options.deadline,
      tickId:options.tickId
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
    var tick_id=that.data.tickId
    wx.request({
      url: app.globalData.url + 'index/check/checkRecord',
      data:{
        tick_id:tick_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data)
        that.setData({
          get_list:res.data
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