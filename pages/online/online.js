// pages/online/online.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current_index:1,
    indicatorDots: false,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    current: 'tab1',
    teacher:[
      {
        name:'李嘉树',
        career:'美国正面管教家长/学校双讲师',
        title:'体验课：如何让孩子养成好习惯？',
        dingyue:200,
        top_img:'https://cdn.icloudapi.cn/zhuanlan.png',
        headImg:'https://cdn.icloudapi.cn/recom_tea.png'
      },
      {
        name:'李嘉树',
        career:'美国正面管教家长/学校双讲师',
        title:'体验课：如何让孩子养成好习惯？',
        dingyue:200,
        top_img:'https://cdn.icloudapi.cn/zhuanlan.png',
        headImg:'https://cdn.icloudapi.cn/recom_tea.png'
      }
    ],
    all_teacher:[]
  },
  handleChange({ detail }) {
    this.setData({
      current: detail.key
    });
  },
  view:function(e){
    var that=this;
    var id=e.currentTarget.dataset.id;
    var dingyue=e.currentTarget.dataset.dingyue;
    var price=e.currentTarget.dataset.price;
    wx.navigateTo({
      url: '../zhuanlan/zhuanlan?id='+id+'&dingyue='+dingyue+'&price='+price,
    })
  },
  change:function(e) {
    this.setData({
      current_index:e.detail.current+1
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
    var openid=wx.getStorageSync('openid')
    wx.request({
      url: app.globalData.url + 'index/Zhuanlan/getZhuanLan',
      data:{
        openid:openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data)
        that.setData({
          teacher:res.data[0],
          all_teacher:res.data[1]
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
    return {
      title: '邀请一起学习',
      path: '/pages/online/online'
    }
  }
})