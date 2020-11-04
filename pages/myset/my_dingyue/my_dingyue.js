// pages/myset/my_dingyue/my_dingyue.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'tab1',
    teacher:[],
    video:[],
    mp3:[]
  },
  handleChange({ detail }) {
    this.setData({
      current: detail.key
    });
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
      url: app.globalData.url + 'index/Zhuanlan/myDingyue',
      data: {
        openid: openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        that.setData({
          teacher:res.data
        })
      }
    })

  },
  study:function(e) {
    var that=this;
    var id=e.currentTarget.dataset.id;
    var dingyue=1;
    var price=e.currentTarget.dataset.price;
    wx.navigateTo({
      url: '../../zhuanlan/zhuanlan?id='+id+'&dingyue='+dingyue+'&price='+price,
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