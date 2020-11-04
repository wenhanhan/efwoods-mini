// pages/cour_detail/cour_detail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cour_info:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  //拨打电话
  call: function () {
    if (app.globalData.freeze == 1) {
      wx.showToast({
        title: '你已被冻结',
        icon: 'loading',
        duration: 2000 
      })
    } else {
      var phone = this.data.cour_info.courContact;
      wx.makePhoneCall({
        phoneNumber: phone,
        success: function (res) {
          console.log('拨打成功')
        },
      })
    }

  }, 

  onLoad: function (options) {
    this.setData({
      cour_id: options.cour_id,//课程id  重要的参数
    })
    console.log(this.data.cour_tw)
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
    //查询申请的课程详情
    var that=this;
    wx.request({
      url: app.globalData.url+'index/Course/applyCourseDes',
      data:{
        cour_id:that.data.cour_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        that.setData({
          cour_info:res.data
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

  }
})