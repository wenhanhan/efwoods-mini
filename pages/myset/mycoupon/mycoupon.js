var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'tab2',
    current_scroll: 'tab2',
    tick_state:false,//显示失效券
    isdown:-1,
    idx:-1,
    //优惠券信息
    valid_tick: [],
    invalid_tick:[]
  },

// 优惠券点击图标下拉事件
  down:function(e){
    var isdown=-1*this.data.isdown;
    this.setData({
      isdown:isdown,
      idx: e.currentTarget.dataset.idx
    })
  },

  handleChange({ detail }) {
    console.log(detail)
    this.setData({
      current: detail.key,
      tick_state:detail.key=='tab1'?true:false
    });
  },

  handleChangeScroll({ detail }) {
    this.setData({
      current_scroll: detail.key
    });
  },

  used_tick:function(){
    this.setData({
      current: 'tab1',
      current_scroll:'tab1',
      tick_state:true,
    });
  },
  use_tick: function () {
    this.setData({
      current: 'tab2',
      current_scroll: 'tab2',
      tick_state:false
    });
  },

//核销优惠券
 check:function(e){
   wx.navigateTo({
     url: '/pages/myset/coupon_des/coupon_des'
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
    var openid=wx.getStorageSync('openid');
    wx.request({
      url: app.globalData.url +'index/Tickets/myTickets',
      data:{
        openid:openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data)
        that.setData({
          valid_tick:res.data[0],
          invalid_tick:res.data[1].concat(res.data[2])
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