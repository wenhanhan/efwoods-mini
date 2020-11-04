// pages/news/news.js
const { $Message } = require('../../dist/base/index');
var common = require('../../utils/common.js');
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,//默认加载首页消息
    sysNum: 0,//系统消息的数量
    judgeNum: 0,
    fansNum: 0,
    noMoreData: false,//默认更多消息
    status: true, //true为正常显示，false为显示删除按钮
    idx: -1,//选中的消息行
    news: [],
    status: true, //true为正常显示，false为显示删除按钮
    idx: -1//选中的消息行
  },
  touchS(e) {
    // 获得起始坐标
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
    this.setData({
      idx: e.currentTarget.dataset.idx,
      status: true
    })
    console.log(e)
  },
  touchM(e) { 
    // 获得当前坐标
    this.currentX = e.touches[0].clientX;
    this.currentY = e.touches[0].clientY;
    var index = e.currentTarget.dataset.idx;
    console.log(index)
    var idx = this.data.idx;
    console.log(e)
    const x = this.startX - this.currentX; //横向移动距离
    const y = Math.abs(this.startY - this.currentY); //纵向移动距离，若向左移动有点倾斜也可以接受
    if (x > 35 && y < 110) {
      //向左滑是显示删除
      this.setData({
        status: false
      })
    } else if (x < -35 && y < 110) {
      //向右滑
      this.setData({
        status: true
      })
    }
  },
  dele: function (e) {
    console.log('delete')
    var that = this;
    var news = that.data.news;
    var idx = e.currentTarget.dataset.idx;
    var id = e.currentTarget.dataset.id;//消息id
    var type = e.currentTarget.dataset.type;//消息类型
    var state=e.currentTarget.dataset.state;//删除消息的
    wx.request({
      url: app.globalData.url + 'index/News/deleteNews',
      data: {
        id: id
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      success(res) {
        console.log(res.data)
      }
    })
    news.splice(idx, 1)
    wx.showToast({
      title: '已删除',
      icon: 'success',
      duration: 1000
    })
    if (type == 0) {
      var sysNum = that.data.sysNum - 1;
      that.setData({
        news: news,
        sysNum: sysNum<0?0:sysNum
      })
    }
    if (type == 1) {
      var fansNum = that.data.fansNum - 1;
      that.setData({
        news: news,
        fansNum: fansNum<0?0:fansNum
      })
    }
    if (type == 2) {
      var judgeNum = that.data.judgeNum - 1;
      that.setData({
        news: news,
        judgeNum:judgeNum<0?0:judgeNum
      })
    }
  },

  //将消息全部已读
  clean: function () {
    var news = this.data.news;
    common.setNewsRead(2, '')
    for (var i = 0; i < news.length; i++) {
      news[i].read = 1
    }
    this.setData({
      news: news,
      sysNum: 0,
      judgeNum: 0,
      fansNum: 0
    })
    wx.showToast({
      title: '已全部已读',
      icon: 'success',
      duration: 1000
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
    var that = this;
    //查询所有消息
    that.getNews(that.data.page)
    //将系统消息与粉丝消息置为已读
    common.setNewsRead(0, '')
    common.setNewsRead(1, '')
  },

  getNews(page) {
    var that = this;
    var noMoreData = that.data.noMoreData;
    var openid=wx.getStorageSync('openid')
    // var openid = 'ohelb5ZfZGScQ-HBlIqOhzqboa3o';
    wx.request({
      url: app.globalData.url + 'index/News/getAllNews',
      data: {
        openid: openid,
        page: page
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      success(res) {
        console.log(res.data)
        var news = that.data.news ? that.data.news : [];
        var lastPageLength = res.data[0].length;//当前页消息的长度
        if (lastPageLength < 10) {
          that.setData({
            noMoreData: true
          })
        }
        if (page == 1) {
          that.setData({
            news: res.data[0],
            sysNum: res.data[1],
            fansNum: res.data[2],
            judgeNum: res.data[3]
          })
        } else {
          that.setData({
            news: news.concat(res.data[0]),
            sysNum: res.data[1],
            fansNum: res.data[2],
            judgeNum: res.data[3]
          })
        }
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
    console.log('触底啦')
    var that = this;
    var page = this.data.page;
    var noMoreData = this.data.noMoreData;
    if (!noMoreData) {
      //继续加载
      page++;
      console.log(page)
      that.getNews(page)
      that.setData({
        page: page
      })
    } else {
      console.log('加载完全')
    }
  },

  
})