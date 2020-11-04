// pages/myset/jifen/jifen.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    current: 'tab1',
    current_scroll: 'tab1',
    jifen_list: [],//积分记录
    sum: '',//积分总数
    shop_integral:'',//商城积分
    sign_times: '',
    sign_score: '',
    judge_times: '',
    judge_score: '',
    share_times: '',
    share_score: '',
    jifen_des: '',
    state:0//积分表是否连通
  },


  handleChange({ detail }) {
    this.setData({
      current: detail.key
    });
  },

  handleChangeScroll({ detail }) {
    this.setData({
      current_scroll: detail.key
    });
  },
  open: function () {
    this.setData({
      hidden: false
    })
  },
  close: function () {
    this.setData({
      hidden: true
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
    //查询积分记录
    var that = this;
    var openid = wx.getStorageSync('openid');
    var unionId=wx.getStorageSync('unionId');
    var state = app.globalData.is_shop_login?1:0;
    var shop_uid=app.globalData.shop_uid;
    wx.request({
      url: app.globalData.url + 'index/Points/record',
      data: {
        openid: openid,
        state:state,
        shop_uid:shop_uid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        // console.log(res.data[0])
        that.setData({
          jifen_list: res.data[0],
          sum: res.data[1]*1,
          state:state
        })
      }
    })
    //积分设置详情
    wx.request({
      url: app.globalData.url + 'index/Points/jifenSet',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data[1][0].des)
        that.setData({
          jifen_des: res.data[1][0].des,
          sign_times: res.data[0][1].times,
          sign_score: res.data[0][1].score,
          judge_times: res.data[0][2].times,
          judge_score: res.data[0][2].score,
          share_times: res.data[0][0].times,
          share_score: res.data[0][0].score,
          stu_judge_score:res.data[0][3].score,
          stu_judge_times:res.data[0][3].times
        })
      }
    })
  },
  jump_shop:function(){
    wx.navigateToMiniProgram({
      appId: 'wx83f243f73b48c56c',
      success(res) {
        // 打开成功
        console.log('打开成功')
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