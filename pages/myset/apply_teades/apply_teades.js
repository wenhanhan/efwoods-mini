// pages/tea_intro/tea_intro.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    honor: '',
    experience: '',
    introduce: '',
    name: '',
    tea_img: '',
    phone:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      honor: options.honor,
      introduce: options.introduce,
      experience: options.experience,
      name: options.name,
      tea_img: options.tea_img,
      phone:options.phone
    })
  },
  //拨打电话
  call: function () {
      var phone = this.data.phone;
      wx.makePhoneCall({
        phoneNumber: phone,
        success: function (res) {
          console.log('拨打成功')
        },
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