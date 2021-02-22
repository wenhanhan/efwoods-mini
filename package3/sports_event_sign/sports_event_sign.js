// pages/sports_event_sign/sports_event_sign.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    sex_index: 0,
    sex_array:['男','女'],
    cover:''
  },
  bindPickerAge:function(e){
    this.setData({
      sex_index: e.detail.value
    })
  },
  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var that=this;
    var form=e.detail.value
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(14[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    form.openid=wx.getStorageSync('openid')
    form.sports_id=that.data.sports_id
    //校验
    if(!form.name){
      wx.showToast({
        title: '请填写姓名信息',
        icon: 'loading',
        duration: 1000
      })
      return;
    }
    if(!form.age){
      wx.showToast({
        title: '请填写年龄信息',
        icon: 'loading',
        duration: 1000
      })
      return;
    }
    if(!form.phone||form.phone.length<11||!myreg.test(form.phone)){
      wx.showToast({
        title: '请检查手机号',
        icon: 'loading',
        duration: 1000
      })
      return;
    }
    if(!form.address){
      wx.showToast({
        title: '请填写地址信息',
        icon: 'loading',
        duration: 1000
      })
      return;
    }
    if(!form.idcard){
      wx.showToast({
        title: '请填写身份证信息',
        icon: 'loading',
        duration: 1000
      })
      return;
    }
    wx.request({
      url: app.globalData.url + 'index/SportsEvent/updateSignInfo',
      method:'POST',
      data: form,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data)
        if(res.data.code==200){
          wx.showToast({
            title: '报名成功',
            icon: 'success',
            duration: 2000,
            success(res){
              wx.navigateBack({
                delta: 1,
              })
            }
          })
          
        }else{
          wx.showToast({
            title: '请联系管理员',
            icon: 'loading',
            duration: 1000
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cover:options.cover,
      sports_id:options.sports_id,
      title:options.title
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})