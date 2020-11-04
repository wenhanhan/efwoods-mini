// pages/myset/myshow/myshow.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    video: [],
    openid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      openid:options.openid
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
    //获取我的视频
    var that = this;
    var openid = that.data.openid;
    wx.request({
      url: app.globalData.url + 'index/Show/myShow',
      data: {
        openid: openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          video: res.data
        })
      }
    })
  },
  //播放函数
  play: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.idx;//视频序号
    var video = that.data.video[index];
    wx.navigateTo({
      url: '../../pages/show_des/show_des?video=' + video.video + '&title=' + encodeURIComponent(video.title) + '&name=' + encodeURIComponent(video.nickName) + '&img=' + video.avatarUrl + '&openid=' + video.openid + '&favor=' + video.favor + '&videoid=' + video.Id+'&cover='+encodeURIComponent(video.cover),
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