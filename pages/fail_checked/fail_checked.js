// pages/fail_checked/fail_checked.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type:options.type
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //重新提交跳转1
  reset:function(){
    var type=this.data.type;
    if(type==1){
      //机构跳转 重新提交
      wx.redirectTo({
        url: '../agency_apply/agency_apply',
      })
    }else{
      //教师跳转 重新提交
      wx.redirectTo({
        url: '../apply/apply',
      })
    }
    
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