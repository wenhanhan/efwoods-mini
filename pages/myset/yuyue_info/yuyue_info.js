// pages/myset/yuyue_info/yuyue_info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yuyue:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({ 
      yuyue:options
    })
  },
  //地址导航
  chooseLocation: function () {
    const latitude = this.data.yuyue.lat*1;
    const longitude = this.data.yuyue.long*1;
    var name = this.data.yuyue.cour_address;
    var address = this.data.yuyue.cour_location;
    wx.openLocation({
      latitude,
      longitude,
      name,
      address,
      scale: 18,
      success(res) {
        console.log('打开成功')
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