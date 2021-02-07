// package3/study_abroad/study_abroad.js
const { $Toast } = require('../../dist/base/index');
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    imgUrls:[],
    agency:[
      {
        name:'兴致体育',
        img:'../img/agency1.png',
        address:'上海市'
      },
      {
        name:'兴致体育',
        img:'../img/agency2.png',
        address:'上海市'
      },
      {
        name:'兴致体育',
        img:'../img/agency1.png',
        address:'上海市'
      },
      {
        name:'兴致体育',
        img:'../img/agency2.png',
        address:'上海市'
      }
    ],
    news:[]
  },
  view:function(e){
    var news_id=e.currentTarget.dataset.newsid;
    wx.navigateTo({
      url: '../news_des/news_des?news_id='+news_id,
    })
  },
  //电话咨询
  call:function(){
    wx.makePhoneCall({
      phoneNumber: '021-58879166',
    })
  },
  //院校排行
  school:function(){
    $Toast({
      content: '该模块暂未开放',
      duration:1
  });
  },
  more_news:function(){
    wx.navigateTo({
      url: '../study_abroad_news/study_abroad_news',
    })
  },
  more_agency:function(){
    wx.navigateTo({
      url: '../study_abroad_agency/study_abroad_agency',
    })
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
  //获取首页轮播图与赛事类别
    wx.request({
      url: app.globalData.url + 'index/StudyAbroad/getBanner',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          imgUrls: res.data[0],
          news:res.data[1],
          agency:res.data[2]
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