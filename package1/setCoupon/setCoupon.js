// pages/myset/setCoupon/setCoupon.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'tab1',
    current_scroll: 'tab1',
    tick: true,//优惠券列表
    isdown: -1,
    idx: -1,
    //优惠券信息
    tick_list: [
      { "title": "钢琴课程", 'money': 10, 'tea': '文寒', 'deadline': '2019-03-12 24:00:00', 'sum': 100, 'used': 10, 'checked': 10 }, { "title": "钢琴课程", 'money': 20, 'tea': '文寒', 'deadline': '2019-03-12 24:00:00', 'sum': 100, 'used': 10, 'checked': 10 }, { "title": "钢琴课程", 'money': 30, 'tea': '文寒', 'deadline': '2019-03-12 24:00:00', 'sum': 100, 'used': 10, 'checked': 10  }
    ]
  },
  

  handleChange({ detail }) {
    console.log(detail)
    this.setData({
      current: detail.key,
      tick: detail.key == 'tab1' ? true : false
    });
  },

  handleChangeScroll({ detail }) {
    this.setData({
      current_scroll: detail.key
    });
  },

  used_tick: function () {
    this.setData({
      current: 'tab1',
      current_scroll: 'tab1',
      tick: true,
    });
  },
  use_tick: function () {
    this.setData({
      current: 'tab2',
      current_scroll: 'tab2',
      tick: false
    });
  },
//跳转事件
  //编辑跳转
  editCoupon: function (e) {
    var couponId = e.currentTarget.dataset.couponid
    console.log(e)
    wx.navigateTo({
      url: '../editCoupon/editCoupon?couponId='+couponId,
    })
  },
//增加优惠券
add:function(){
  wx.navigateTo({
    url: '../addCoupon/addCoupon',
  })
},
  // 扫码核销优惠券 
  //思路：第一步校验核销人身份；第二步将学员优惠券核销状态置为1；第三步将优惠券核销数加1
  //二维码内容 优惠券id+学员openid+教师openid(新算法改为课程id))
  check: function () {
    var openid = wx.getStorageSync('openid');//核销教师身份
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      success(res) {
        var tick_id = res.result.split("/")[0]; //主要获取优惠券的id
        var stu_openid = res.result.split("/")[1];//学员openid
        var tea_openid = res.result.split("/")[2];//教师openid
        if (openid != tea_openid) {
          wx.showToast({
            title: '身份无法识别',
            icon: 'loading',
            duration: 2000
          })
        } else {
          //身份验证通过开始请求
          wx.request({
            url: app.globalData.url + 'index/Check/check',
            data: {
              stu_openid: stu_openid,
              tea_openid: tea_openid,
              tick_id: tick_id
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res.data)
              wx.showToast({
                title: res.data.msg,
                icon: res.data.icon,
                duration: 1000
              })
            }
          })
        }

      }
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
        url: app.globalData.url +'index/Course/seleCoupon',
        data:{
          openid:openid
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data)
          that.setData({
            tick_list:res.data
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