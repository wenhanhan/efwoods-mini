// pages/myset/addCoupon/addCoupon.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //课程列表 接口请求
    coupon_id:'',//优惠券id
    coupou:[],//优惠券信息
    deadline: '',
    coupon_name:'',//课程名字
    coupon_num: '',//优惠券数量
    coupon_money: '',//抵用金额
    coupon_des: '',//优惠券备注
  },

  //选择优惠券课程名字
  coupon_name: function (e) {
   wx.showToast({
     title: '请设置其他选项',
     icon:'loading',
     duration:1000
   })
  },
  //优惠券截止日期
  bindDateChange: function (e) {
    this.setData({
      deadline: e.detail.value
    })
  },

  // 截取字符串,多余省略号显示
  substr: function (val) {
    if (val.length == 0 || val == undefined) {
      return '';
    } else if (val.length > 12) {
      return val.substring(0, 16) + "...";
    } else {
      return val;
    }
  },
  //点击输入事件
  input: function (e) {
    console.log(e)
    var type = e.currentTarget.dataset.type;
    var title = e.currentTarget.dataset.title;
    var cate = e.currentTarget.dataset.cate;
    console.log(type)
    wx.navigateTo({
      url: '../../pages/edit/edit?type=' + type + '&title=' + title + '&cate=' + cate
    })
  },
  //保存优惠券
  save_btn:function(e){
    var that=this;
    var couponId = wx.getStorageSync('couponId');//优惠券id
    var courName=that.data.coupon_name;
    var num=that.data.coupon_num;
    var money=that.data.coupon_money;
    var deadline=that.data.deadline;
    var des=that.data.coupon_des;
    wx.showModal({
      title: '请慎重修改',
      content: '是否修改',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + 'index/Course/updateCoupon',
            data: {
              Id: couponId,
              courName: courName,
              num: num,
              money: money,
              deadline: deadline,
              des: des,
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res.data)
              wx.removeStorageSync('coupon_money')
              wx.removeStorageSync('coupon_des')
              wx.removeStorageSync('couponId')
              wx.removeStorageSync('coupon_num')
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 5000,
                success:function(){
                  wx.navigateBack({
                    delta:1
                  })
                }
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.setStorageSync('couponId', options.couponId)//缓存更改的优惠券id
    that.setData({
      coupon_id:options.couponId
    })
    console.log(options.couponId)
    wx.request({
      url: app.globalData.url +'index/Course/seleIdCoupon',
      data:{
        couponId:that.data.coupon_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          coupon_name:res.data[0].courName,
          coupon_num:res.data[0].num,
          coupon_money:res.data[0].money,
          deadline:res.data[0].deadline,
          coupon_des:res.data[0].des
        })
        console.log(res.data)
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
    var that=this;
    that.setData({
      coupon_num: wx.getStorageSync('coupon_num') ? wx.getStorageSync('coupon_num'):that.data.coupon_num,
      coupon_money: wx.getStorageSync('coupon_money') ? wx.getStorageSync('coupon_money'):that.data.coupon_money,
      deadline: wx.getStorageSync('deadline') ? wx.getStorageSync('deadline'):that.data.deadline,
      coupon_des: wx.getStorageSync('coupon_des') ? wx.getStorageSync('coupon_des'):that.data.coupon_des
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