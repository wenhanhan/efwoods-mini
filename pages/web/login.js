// pages/web/login.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    login:false,
    userInfo:{},
    sysInfo:{
      url:'https://cdn.icloudapi.cn/red_logo.png',
      title:'eFIREWOODS'
    },
    uuid:''//用户标识
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      uuid:options.scene
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
    var userInfo=wx.getStorageSync('userInfo');
    this.setData({
      userInfo:userInfo
    })
  },
  login:function(){
    var that=this;
    var userInfo=wx.getStorageSync('userInfo');
    var openid=wx.getStorageSync('openid');
    var uuid=that.data.uuid;
    if(userInfo){
      //进行登录
      wx.request({
        url: app.globalData.url +'web/Login/miniProgramLogin',
        data:{
          openid:openid,
          uuid:uuid
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res){
          console.log(res.data)
          if(res.data.code==200){
            that.setData({
              login:true
            })
          }else{ 
            wx.showToast({
              title: res.data.msg,
              icon:'none',
              duration:1000
            })
          }
        }
      })
    }else{
      app.login()
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

  }
})