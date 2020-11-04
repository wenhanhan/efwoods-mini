// pages/user/user.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    headimg:'',
    percent: 0,
    status: 'normal',
    qujian:[],//经验区间
    fensi:'',//粉丝数
    sign:'',//签到数
    show:'',//教练秀
    exp:'',//经验值
    level:'',//等级值
    percent:'',
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
    this.setData({
      name:wx.getStorageSync('userInfo').nickName,
      headimg:wx.getStorageSync('userInfo').avatarUrl
    })
    var that=this;
    var openid=wx.getStorageSync('openid');
    wx.request({
      url: app.globalData.url+'index/User/qujian',
      data:{},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data)
        that.setData({
          qujian:res.data
        })
      }
    })
    //经验值 等级 升级百分比
    wx.request({
      url: app.globalData.url +'index/User/experience',
      data:{
        openid:openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data)
        that.setData({
          exp:res.data.exp,
          level:res.data.level,
          // level:5,
          percent:res.data.percent,
          show:res.data.video_play_times,
          sign:res.data.sign_num,
          fensi:res.data.fensi
        })
      }
    })
  
  },
  jump_shop:function(){
    wx.navigateToMiniProgram({
      appId: 'wx83f243f73b48c56c',
      success(res) {
        // 打开成功
        console.log('打开成功')
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