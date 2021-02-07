// package3/summer_camp_des/summer_camp_des.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    camp_id:null,
    camp:{
      title:'2020拼搏体育14天足球夏令营',
      price:5000,
      people:'6~15周岁',
      address:'上海',
      author:'兴致体育',
      duration:'7天',
      content:'<div>Hello World!</div>'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      camp_id:options.camp_id
    })
  },
  favor:function(e){
    var that=this;
    var camp_id=this.data.camp.Id
    var camp=that.data.camp;
    camp.is_favor=!camp.is_favor
    var openid=wx.getStorageSync('openid')
    wx.request({
      url: app.globalData.url + 'index/SummerCamp/favorCamp',
      data: {
       openid:openid,
       camp_id:camp_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data)
        if(camp.is_favor){
          wx.showToast({
            title: '已收藏',
            icon:'success'
          })
        }else{
          wx.showToast({
            title: '已取消',
            icon:'success'
          })
        }
        that.setData({
          camp:camp
        })
      }
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
    var that=this;
    var openid=wx.getStorageSync('openid');
    wx.request({
      url: app.globalData.url + 'index/SummerCamp/getSummerCampInfo',
      data: {
       camp_id:that.data.camp_id,
       openid:openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          camp:res.data
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