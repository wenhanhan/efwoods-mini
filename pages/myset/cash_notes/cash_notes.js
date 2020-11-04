var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cash_sum:0,
    //数据结构
    cash: [
      {
        month: '2019-11',
        detail: [
          {
            title: '余额提现',
            time: '2019-11-20 11:20:20',
            type: 'cut',
            num: 1
          },
          {
            title: '提现失败',
            time: '2019-11-20 11:20:20',
            type: 'plus',
            num: 1
          },
          {
            title: '余额提现',
            time: '2019-11-20 11:20:20',
            type: 'cut',
            num: 1
          }
        ]
      },
      {
        month: '2019-10',
        detail: [
          {
            title: '余额提现',
            time: '2019-11-20 11:20:20',
            type: 'cut',
            num: 3
          },
          {
            title: '提现失败',
            time: '2019-11-20 11:20:20',
            type: 'plus',
            num: 1
          },
          {
            title: '余额提现',
            time: '2019-11-20 11:20:20',
            type: 'cut',
            num: 1
          }
        ]
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cash_sum: options.cash_sum
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
    var openid=wx.getStorageSync('openid')
    wx.request({
      url: app.globalData.url +'index/Spread/cashNotes',
      data:{
        openid:openid, 
      },
      header: {
        'Content-type': 'application/json'
      },
      success(res){
        console.log(res.data)
        that.setData({
          cash:res.data
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