// pages/myset/spread/spread.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cash_sum:0,
    brokerage:0,
    hidden: true,
    rule: ['1、推广佣金根据当前推广人数产生。', '2、推广人数0~100，5元/人；推广人数101~更多，6元/人。', '3、订单返佣金额根据推广人订单佣金的比例计算生成。', '4、推广规则解释权归eFIREWOODS平台所有。']
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
    var openid=wx.getStorageSync('openid')
    wx.request({
      url: app.globalData.url + 'index/Spread/myBrokerage',
      data:{
        openid:openid
      },
      header: {
        'Content-type': 'application/json'
      },
      success(res){
        console.log(res.data)
        that.setData({
          brokerage:res.data[0],
          rule:res.data[1],
          cash_sum:res.data[2]
        })
      }
    })
  },
  open: function () {
    this.setData({
      hidden: false
    })
  },
  close: function () {
    this.setData({
      hidden: true
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