// pages/daily_exercise/daily_exercise.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    currentClass:0,
    grade:0,
    category:[
      {
        grade:'小学',
        class:['一年级','二年级','三年级','四年级','五年级','六年级']
      },
      {
        grade:'初中',
        class:['初一','初二','初三']
      },
      {
        grade:'高中',
        class:['高一','高二','高三']
      }
    ]
  },
//滑动切换
swiperTab: function (e) {
  var that = this;
  that.setData({
    currentTab: e.detail.current,
    grade:e.detail.current,
    currentClass:0
  });
},
//点击切换
clickTab: function (e) {
  var that = this;
  if (this.data.currentTab === e.target.dataset.current) {
    return false;
  } else {
    that.setData({
      currentTab: e.target.dataset.current,
      grade:e.target.dataset.current,
      currentClass:0
    })
  }
},
//切换年级
selectGrade:function(e){
  if(this.data.currentClass===e.target.dataset.current){return;}
  this.setData({
    currentClass:e.target.dataset.current
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