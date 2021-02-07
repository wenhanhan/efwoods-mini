// pages/sports_event_des/sports_event_des.js
var app=getApp()
const { $Toast } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sports_id:null,
    sports_info:{},
    state:0//资讯的实效
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      sports_id:options.sports_id,
      state:options.state
    })
    console.log(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  baoming:function(){
    var state=this.data.state;
    var userInfo = wx.getStorageSync('userInfo');//用户信息
    var is_sign=this.data.sports_info.is_sign;
    var cover=this.data.sports_info.cover;
    var sports_id=this.data.sports_id;
    if(userInfo){
      if(state==0){
        if(is_sign==0){
          wx.navigateTo({
            url: '../sports_event_sign/sports_event_sign?sports_id='+sports_id+'&cover='+cover,
          })
        }else{
          $Toast({
            content: '您已经报名',
            duration:1
        });
        }
      }else if(state==1){
        $Toast({
          content: '报名未开始',
          duration:1
      });
      }else{
        $Toast({
          content: '赛事报名已结束',
          duration:1
      });
      }
    }else{
      app.login()
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;
    var id=this.data.sports_id
    var openid=wx.getStorageSync('openid')
    //加载赛事资讯
    wx.request({
      url: app.globalData.url + 'index/SportsEvent/getSportsById',
      data: {
        id:id,
        openid:openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          sports_info:res.data
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