// pages/myset/admin/admin.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headimg:'',//管理员头像
    nickname:'',//管理员昵称
    sex:'',//管理员性别
    user_num:'',//注册用户数
    tea_num:'',//教师数量
    cour_num:'',//课程数量
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
    //渲染管理员头像与性别
    that.setData({
      headimg: wx.getStorageSync('userInfo').avatarUrl,
      nickname: wx.getStorageSync('userInfo').nickName,
      sex: wx.getStorageSync('userInfo').gender
    })

    wx.request({
      url: app.globalData.url+'index/Admin/count',
      data:{
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data)
        that.setData({
          user_num:res.data[0],
          tea_num:res.data[1],
          cour_num:res.data[2]
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