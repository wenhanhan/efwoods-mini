// pages/login/login.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invite: false,
    share_openid: '',
    scene: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //判断进入的场景
    var share_openid = options.share_openid;
    var scene = options.scene;
    if (share_openid || scene) {
      that.setData({
        invite: true,
        share_openid: share_openid ? share_openid : scene
      })
    }
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

  },
  onGotUserInfo: function (e) {
    var that = this;
    var openid=wx.getStorageSync('openid');
    var unionId=wx.getStorageSync('unionId'); 
    var sessionKey=wx.getStorageSync('session_key');
    wx.setStorageSync('userInfo', e.detail.userInfo)
    console.log(e)
    if(e.detail.userInfo){
      //同意授权
      //获取用户的unionId;
      wx.request({
        url: app.globalData.url+'index/Open/getUnionId',
        data:{
          appid:'wx475a3683acbb603d',
          encryptedData:e.detail.encryptedData,
          iv:e.detail.iv,
          sessionKey:sessionKey
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res){
          console.log(res.data)
          // var res = JSON.parse(res.data);
          //获取unionId后存储
          if(res.data.code==0){
            var info = JSON.parse(res.data.info)
            wx.setStorageSync('unionId', info.unionId)
            //判断商城小程序是否登录
            app.is_shop_login(info.unionId,openid)
             //1、存储用户信息2、回退页面
            wx.request({
              url: app.globalData.url +'index/index/insertUserInfo',
              data:{
                openid: wx.getStorageSync('openid'),
                nickName:e.detail.userInfo.nickName,
                sex:e.detail.userInfo.gender,
                avatarUrl:e.detail.userInfo.avatarUrl,
                unionId:info.unionId
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success(res) {
                console.log(res.data)
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          }else{
            wx.navigateBack({
              delta:1
            })
          }
        }
      })
      //1、存储用户信息2、回退页面
      // wx.request({
      //   url: app.globalData.url +'index/index/insertUserInfo',
      //   data:{
      //     openid: wx.getStorageSync('openid'),
      //     nickName:e.detail.userInfo.nickName,
      //     sex:e.detail.userInfo.gender,
      //     avatarUrl:e.detail.userInfo.avatarUrl,
      //   },
      //   header: {
      //     'content-type': 'application/json' // 默认值
      //   },
      //   success(res) {
      //     console.log(res.data)
      //     wx.navigateBack({
      //       delta: 1
      //     })
      //   }
      // })
    }
    
    // if (res.detail.userInfo) {
    //   wx.setStorageSync('userInfo', res.detail.userInfo)
    //   if (that.data.invite) {
    //     wx.redirectTo({
    //       url: '../invite_apply/invite_apply?share_openid=' + that.data.share_openid,
    //     })
    //   } else {
    //     wx.switchTab({
    //       url: '../index/index',
    //     })
    //   }
    // } else {

    // }

  }
})