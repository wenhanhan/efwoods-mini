// pages/myset/set_yuyue_info/set_yuyue_info.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cour_info:[],//课程信息
    stu_info:[],//预约学员信息
    yuyue_info:[],
    is_sign:[],
    no_sign:[],
    finish_state:true,//课程状态 （开课前与开课后）
    num:0//学员数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      yuyue_info:options
    })
  },

  /**:
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //查询课程的信息与预约人数
    var that=this;
    var yuyue_info=that.data.yuyue_info;
    wx.request({
      url:app.globalData.url +'index/YuYue/getAppointmentInfo',
      data:{
        cour_id:yuyue_info.cour_id,
        date:yuyue_info.date,
        clock:yuyue_info.clock,
        state:yuyue_info.state
      }, 
      header: {
        'Content-type': 'application/json'
      },
      success(res){
        console.log(res.data)
        if(yuyue_info.state!=2){
          that.setData({
            cour_info:res.data[0],
            stu_info:res.data[1],
            num:res.data[1].length
          })
        }else{ 
          that.setData({
            cour_info:res.data[0],
            is_sign:res.data[1],
            no_sign:res.data[2],
            num:res.data[1].length+res.data[2].length
          })
        }
      }
    })
  },
  //课程退款
  refund:function(e){
    var that=this;
    var stu_info=that.data.stu_info;
    var idx=e.currentTarget.dataset.idx;
    var yuyue_info=JSON.parse(stu_info[idx].yuyue_info);
    var total_fee=stu_info[idx].pay_total;//订单的总金额
    var refund_fee=total_fee/(yuyue_info.length);//退款的金额
    var order_id=stu_info[idx].order_id;//商户订单号；
    var date=that.data.yuyue_info.date;//约课日期
    var clock=that.data.yuyue_info.clock;//约课时间
    var yuyue_id=stu_info[idx].Id;//预约id
    var phone=stu_info[idx].phone;//手机号
    //新增退款单据 需要的数据
    var cour_id=that.data.yuyue_info.cour_id;
    var openid=stu_info[idx].openid;
    wx.showLoading({
      title: '正在退款',
    })
    wx.request({
      url: app.globalData.url+'index/YuYue/appointmentRefund',
      method:'POST',
      data:{
        total_fee:total_fee,
        refund_fee:refund_fee,
        out_trade_no:order_id,
        date:date,
        clock:clock,
        yuyue_id:yuyue_id,
        cour_id:cour_id,
        openid:openid,
        phone:phone
      },
      header: {
        'Content-type': 'application/json'
      },
      success(res){
        wx.hideLoading({
          complete: (res) => {},
        })
        console.log(res.data)
        if(res.data.code==200){
          //退款成功
          wx.showToast({
            title: res.data.msg,
            icon:'success',
            duration:1000
          })
          stu_info.splice(idx,1)
          that.setData({
            stu_info:stu_info,
            num:stu_info.length
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none',
            duration:1000
          })
        }
      }
    })
    
  },
   //地址导航
   chooseLocation: function () {
    const latitude = this.data.cour_info.courLat*1;
    const longitude = this.data.cour_info.courLong*1;
    var name = this.data.cour_info.courAddressName;
    var address = this.data.cour_info.courAddressDes;
    wx.openLocation({
      latitude,
      longitude,
      name,
      address,
      scale: 18,
      success(res) {
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

  }
})