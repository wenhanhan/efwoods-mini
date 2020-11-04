// pages/agency_pay/agency_pay.js
var common = require('../../utils/common.js'); //引入自己定位的市区数据信息
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'',//付费类型 1机构付费 2教师付费
    fee:'',//支付费用
  },
  pay:function(e){
    var openid=wx.getStorageSync('openid');
    var fee = e.currentTarget.dataset.fee;//支付费用
    var type=e.currentTarget.dataset.type;//付费类型 1代表机构 2代表教师
    // var agency_fee = app.globalData.fee[0].pay;
    console.log(fee)
    // var res=common.pay(agency_fee,openid);//支付结果
    var pay_url='';
    if(type==1){
      pay_url ='index/Agency/paid'
    }else if(type==2){
      pay_url ='index/Apply/teaApplyPay'
    }

    wx.request({
      url: app.globalData.url + 'index/Pay/pay',
      // method: "POST",
      data: {
        total_fee: fee,
        openid: openid,
        body:'入驻付费'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res1) {  //后端返回的数据
        var data = res1.data;
        console.log(data);
        console.log(data.timeStamp);
        wx.requestPayment({
          timeStamp: data.timeStamp,
          nonceStr: data.nonceStr,
          package: data.package,
          signType: data.signType,
          paySign: data.paySign,
          success: function (res) {
            var order=res1.data.package;
            //保存订单
            wx.request({
              url: app.globalData.url + pay_url,
              data: {
                openid: openid,
                order: order
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success(res) {
                console.log(res.data)
                wx.showToast({
                  title: '支付成功',
                  icon: 'success',
                  duration: 1000
                })
                setTimeout(function () {
                  wx.redirectTo({
                    url: '../checking/checking',
                  })
                }, 1000)
              }
            })
           
          },
          fail: function (res) {
            wx.showToast({
              title: '支付失败',
              icon:'loading',
              duration:1000
            })
          }
        })
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type:options.type
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
    //查询支付费用
    var that=this;
    var type=that.data.type;
    wx.request({
      url: app.globalData.url+'index/Pay/typeFee',
      data:{
        type:type
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        that.setData({
          fee:res.data
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