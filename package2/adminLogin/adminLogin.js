// pages/myset/adminLogin/adminLogin.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:'',//用户名
    pwd:''

  },
//获取用户名
  getName:function(e){
    this.setData({
      username:e.detail.value
    })
    console.log(e.detail.value)
  },

  //获取密码
  getPwd: function (e) {
    this.setData({
      pwd:e.detail.value
    })
    console.log(e.detail.value)
  },
//登陆
  login:function(e){
    var that=this;
    var username=that.data.username;
    var pwd=that.data.pwd;
    if(!username){
      wx.showToast({
        title: '请填写用户名',
        icon:'loading',
        duration:1000
      })
    }else if(!pwd){
      wx.showToast({
        title: '请填写密码',
        icon: 'loading',
        duration: 1000
      })
    }else{
      console.log('开始提交')
      wx.request({
        url: app.globalData.url+'index/Admin/login',
        data:{
          username:username,
          pwd:pwd
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res){
          console.log(res.data)
          if(res.data.code==200){
            wx.setStorageSync('username', username)
            wx.setStorageSync('pwd', pwd)
            wx.showToast({
              title: res.data.msg,
              icon:'success',
              duration:1000,
              success(res){
                wx.navigateTo({
                  url: '../admin/admin',
                })
              }
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              icon:'loading',
              duration:1000
            })
          }
        }
      })
    }

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
    var username=wx.getStorageSync('username');
    var pwd=wx.getStorageSync('pwd');
    if(username){
      this.setData({
        username:username,
        pwd:pwd
      })
    }
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