// pages/myset/addCoupon/addCoupon.js
var app = getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //课程列表 接口请求
    deadline: '',
    start_time:'',
    course: [],
    cour_id:'',//课程id
    cour_name:'',//课程名字
    coupon_num:'',//优惠券数量
    coupon_money:'',//抵用金额
    coupon_des:'',//优惠券备注(已截取处理)
    coupon_des_true:''//优惠券备注
  },

//选择优惠券课程名字
  coupon_name: function (e) {
    var that=this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      index: e.detail.value,
      cour_name:that.data.course[e.detail.value].courName,
      cour_id:that.data.course[e.detail.value].Id//当前优惠券对应的课程id
    })
    console.log('课程id'+that.data.cour_id)
    console.log('课程名字' + that.data.cour_name)
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
//添加优惠券
addCoupon:function(){
  var that=this;
  var openid=wx.getStorageSync('openid');
  var cour_id=that.data.cour_id;//课程id
  var cour_name = that.data.cour_name;//课程名字
  var coupon_num = that.data.coupon_num;
  var coupon_money = that.data.coupon_money;
  var deadline=that.data.deadline;
  var coupon_des = that.data.coupon_des_true;
  if(!cour_id){
    wx.showToast({
      title: '请选择课程',
      icon:'loading',
      duration:1000
    })
  }else if(!that.checkInt(coupon_num)){
    wx.showToast({
      title: '请输入整数数量',
      icon: 'loading',
      duration: 1000
    })
  } else if (!that.checkInt(coupon_money)){
    wx.showToast({
      title: '请输入整数金额',
      icon: 'loading',
      duration: 1000
    })
  }else if(!coupon_des){
    wx.showToast({
      title: '请输入备注',
      icon: 'loading',
      duration: 1000
    })
  }else{
    wx.request({
      url: app.globalData.url +'index/Course/addCoupon',
      data:{
        openid:openid,
        courId:cour_id,
        courName:cour_name,
        num:coupon_num,
        money:coupon_money,
        deadline:deadline,
        des:coupon_des
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        if(res.data.code==201){
          wx.showToast({
            title: res.data.info,
            icon:'loading',
            duration:1000
          })
        }else if(res.data.code==200){
          wx.showToast({
            title: res.data.info,
            icon: 'success',
            duration: 2000
          })
          wx.removeStorageSync('coupon_num')
          wx.removeStorageSync('coupon_money')
          wx.removeStorageSync('coupon_des')
          wx.navigateBack({
            delta:1
          })
        }
      }
    })
  }
  
},

//判断整数
checkInt:function(string){
  var re = /^[0-9]+.?[0-9]*/;//
  if (!re.test(string)) {
    return false;
  }
  return true;
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
    var cur_time = util.formatDate(new Date());//获取当前时间
    var that=this;
    var openid=wx.getStorageSync('openid')
    this.setData({
      deadline:cur_time,
      start_time:cur_time,
      coupon_num: wx.getStorageSync('coupon_num'),
      coupon_money: wx.getStorageSync('coupon_money'),
      coupon_des:this.substr(wx.getStorageSync('coupon_des')),
      coupon_des_true: wx.getStorageSync('coupon_des')
    })
    wx.request({
      url: app.globalData.url +'index/Course/seleCourseName',
      data:{
        openid:openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          course:res.data
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