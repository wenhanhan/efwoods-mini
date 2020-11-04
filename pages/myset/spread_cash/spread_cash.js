// pages/myset/spread_cash/spread_cash.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'alipay',
    text: '请填写您的支付宝号',
    state: true,//未上传
    qrcode: '',//付款码
    account: '',//账号
    name: '',//申请人姓名
    cash_num: '',//提现金额
    brokerage:0//当前佣金
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      brokerage: options.brokerage ? options.brokerage:0
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
  pay_ways: function (e) {
    var way = e.currentTarget.dataset.way;
    this.setData({
      current: way,
      text: way == 'alipay' ? '请填写您的支付宝号' : '请填写您的微信号'
    })
  },
  account: function (e) {
    console.log(e.detail.value)
    this.setData({
      account: e.detail.value.trim()
    })
  },
  username: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  cash: function (e) {
    this.setData({
      cash_num: e.detail.value
    })
  },
  upload: function () {
    var that = this;
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths
        wx.showLoading({
          title: '正在上传',
        })
        wx.uploadFile({
          url: app.globalData.url + 'index/Agency/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success(res) {
            wx.hideLoading()
            that.setData({
              state: false,
              qrcode: res.data
            })
            console.log(res.data)
          }
        })
      }
    })
  },
  submit: function () {
    var that = this;
    var way = that.data.current;
    var openid = wx.getStorageSync('openid')
    var account = that.data.account;
    var name = that.data.name;
    var qrcode = that.data.qrcode;
    var brokerage = that.data.brokerage;
    var cash_num = that.data.cash_num;
    if (!account || !name || !cash_num) {
      wx.showToast({
        title: '请完善申请信息',
        icon: 'loading',
        duration: 1000
      })
      return
    }
    if(cash_num<1){
      wx.showToast({
        title: '最低提现1元',
        icon: 'loading',
        duration: 1000
      })
      return
    }
    if (cash_num > brokerage){
      wx.showToast({
        title: '提现佣金不足'+cash_num,
        icon:'loading',
        duration:1000
      })
      return
    }
    console.log(way)
    wx.showLoading({
      title: '正在提交',
    })
    wx.request({
      url: app.globalData.url+'index/Spread/cash',
      method:'POST',
      data:{
        openid:openid,
        account:account,
        name:name,
        type:way,
        qrcode:qrcode,
        money:cash_num
      },
      header: {
        'Content-type': 'application/json'
      },
      success(res){
        wx.hideLoading() 
        wx.showToast({
          title: res.data.msg,
          icon:res.data.icon,
          duration:1000
        })
        if(res.data.code==200){
          that.setData({
            brokerage: (brokerage * 100 - cash_num * 100) / 100
          })
        }
        
        console.log(res.data)
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