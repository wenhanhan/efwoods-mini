// pages/myset/invite/invite.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcode:false,
    invite_tea:[],//邀请的教师
    invite_agency:[],//邀请的机构
    current: 'tab1',
    current_scroll: 'tab1',
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
   * 生命周期函数--监听页面显示1
   */
  onShow: function () {
    var that=this;
    var openid=wx.getStorageSync('openid');
    if(!that.data.qrcode){
      wx.showLoading({
        title: '正在生成',
      })
      wx.request({
        url: app.globalData.url + 'index/Qrcode/getWXACode',
        data: {
          scene: that.data.openid,
          width: 280,
          page: 'pages/share/share'
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          wx.hideLoading()
          console.log(res.data)
          that.setData({
            qrcode: 'https://icloudapi.cn/efire/' + res.data
          })
        }
      })
    }else{
      console.log('已经生成')
    }
//已经邀请的数据
    wx.request({
      url: app.globalData.url + 'index/Apply/invite',
      data:{
        openid:openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data)
        that.setData({
          invite_tea:res.data[0],
          invite_agency:res.data[1]
        })
      }
      
    })
   
  },
  handleChange({ detail }) {
    console.log(detail)
    this.setData({
      current: detail.key
    });
  },

  handleChangeScroll({ detail }) {
    this.setData({
      current_scroll: detail.key
    });
  },
  //保存二维码
  save:function(){
    var that=this;
    wx.getImageInfo({
      src: that.data.qrcode,
      success(res){
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success(res){
            wx.showToast({
              title: '保存成功',
              icon:'success',
              duration:1000
            })
          }
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
    var that=this;
    var openid = wx.getStorageSync('openid');
    return {
      title: '向你发送邀请',
      imageUrl:that.data.qrcode,
      path: 'pages/share/share?share_openid=' + openid,
    }
  }
})