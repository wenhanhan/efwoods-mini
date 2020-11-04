// pages/yuyue_des/yuyue_des.js
var app=getApp()
var common = require('../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX:false,
    isAgree: true,
    showDialog:false,
    clockShowDialog:false,
    hasCoupon:true,
    coupon:null,//优惠券
    is_use_coupon:false,
    success_yuyue:false,
    cour_info:'',
    favor_state: 0, //初始 教师喜欢状态为0
    tea_img:'',
    tea_name:'',
    tag1:'',
    tag2:'',
    tag3:'',
    yuyue_info:[],
    phone:'',//预约人的手机号
    true_total:'',//课程的总价格不使用优惠券
    news_tip:false,//是否开启消息通知
    code:'',//先获取code，避免手机号获取异常
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var isIphoneX = app.globalData.isIphoneX;
    // console.log(isIphoneX)
    console.log(options)
    this.setData({
      isIphoneX: isIphoneX,
      cour_info:options
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
    var tea_id=that.data.cour_info.tea_id;//教师的id
    var cour_id=this.data.cour_info.cour_id;//课程id
    var openid=wx.getStorageSync('openid');//
    var yuyue_info=JSON.parse(wx.getStorageSync('yuyue_clock'))
    var true_total=that.data.cour_info.price*yuyue_info.length;
    console.log(yuyue_info)
    //查询教师的信息以及是否关注该教师
    wx.request({
      url: app.globalData.url +'index/Person/favorState',
      data:{
        openid:openid,
        tea_id:tea_id
      },
      header: { 
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data)
        if(res.data==200){
          that.setData({
            favor_state: 1
          })
        }else{
          that.setData({
            favor_state: 0
          })
        }
      }
    })
    wx.request({
      url: app.globalData.url + 'index/Teacher/selectTeacher',
      data: {
        tea_id: tea_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data)
        that.setData({
          tea_img: res.data.tea_info.teaImg, //头像
          tea_name: res.data.tea_info.name, //教师姓名
          tag1: res.data.tea_info.tag1,
          tag2: res.data.tea_info.tag2?res.data.tea_info.tag2:'',
          tag3: res.data.tea_info.tag3,
          yuyue_info:yuyue_info
        })  
      }
    })
  
    //查询该课程的我的优惠券
    wx.request({
      url: app.globalData.url +'index/tickets/getMyCourseTick',
      data:{
        cour_id:cour_id,
        openid:openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data)
        if(!res.data||true_total<=res.data.money){
          that.setData({
            hasCoupon:false,//没有可用的优惠券
            total:that.data.cour_info.price*yuyue_info.length
          })
        }else{
          that.setData({
            hasCoupon:true,
            coupon:res.data,
            total:that.data.cour_info.price*yuyue_info.length-res.data.money*(that.data.is_use_coupon?1:0),
          })
        }
        console.log(that.data.hasCoupon)
      }
    })
    wx.login({
      success: (res) => {
        if(res.code){
          that.setData({
            code:res.code
          })
        }
      },
    })

  },
  //收藏事件
  favor:function(e){
    var that = this;
    var tea_id = e.currentTarget.dataset.tea_id;
    console.log(tea_id)
    var openid = wx.getStorageSync('openid');
    var state = that.data.favor_state
    that.setData({
      favor_state: -1 * state + 1 //收藏状态
    })
    wx.request({
      url: app.globalData.url + 'index/Person/favorTeacher',
      data: {
        favor_state: that.data.favor_state,
        openid: openid,
        tea_id: tea_id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        common.news(1, '', tea_id, that.data.favor_state)
        if (that.data.favor_state == 1) {
          wx.showToast({
            title: '已关注',
            icon: 'success',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: '已取消关注',
            icon: 'success',
            duration: 1000
          })
        }
      }
    })
  },
  bindAgreeChange: function (e) {
    this.setData({
        isAgree: !!e.detail.value.length
    });
},
select_coupon:function(){
  this.setData({
    showDialog:true
  })
},
disapear:function(){
  this.setData({
    showDialog:false
  })
},
clock_disapear:function(){
  this.setData({
    clockShowDialog:false
  })
},
doNotMove:function(){
  console.log('stop user scroll it!');
  return;
},

//查看更多时间
more_clock:function(){
  this.setData({
    clockShowDialog:true
  })
},
// 使用优惠券
useCoupon:function(){
  this.setData({
    is_use_coupon:!this.data.is_use_coupon,
    showDialog:false,
    total:this.data.total-this.data.coupon.money*(this.data.is_use_coupon?-1:1)
  })
},
//预约课程
yuyue:function(e){
  var that=this;
  var yuyue_info=wx.getStorageSync('yuyue_clock');//预约信息
  var cour_id=that.data.cour_info.cour_id;//课程id
  var openid=wx.getStorageSync('openid');
  var is_coupon=that.data.is_use_coupon?1:0;//是否使用了优惠券
  var coupon_id=that.data.is_use_coupon?that.data.coupon.tickId:'';//优惠券id
  var my_coupon_id=that.data.coupon?that.data.coupon.Id:'';//我的优惠券ID
  var is_pay=that.data.cour_info.is_pay;//是否需要支付
  var total=that.data.total;//支付的总金额
  var isAgree=that.data.isAgree;//是否同意会员条款
  var cour_name=that.data.cour_info.cour_name;//课程名字
  var code=that.data.code;
  if(!isAgree){
    wx.showToast({
      title: '请同意相关条款',
      icon:'loading',
      duration:1000
    })
    return
  }
  //获取手机号码
  if (e.detail.errMsg == "getPhoneNumber:fail user deny") return;
  //用户允许授权
  wx.showLoading({
    title: '正在预约',
  })
        //2. 访问登录凭证校验接口获取session_key、openid
        wx.request({
          url: app.globalData.url + 'index/index/getUserOpenid',
          data: {
            code: code
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            //3.解密
            if (res.statusCode == 200) {
              wx.request({
                url: app.globalData.url + 'index/Phone/getPhoneNumber',
                data: {
                  'encryptedData': e.detail.encryptedData,
                  'iv': e.detail.iv,
                  'session_key': res.data.session_key
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success(res1) {
                  wx.hideLoading()
                  console.log(res1)
                  console.log(res1.data.phoneNumber)//有时候获取不到
                  if (res1.statusCode == 200 && res1.data.phoneNumber) {
                    that.setData({
                      phone: res1.data.phoneNumber
                    })
                    //判断是否需要支付
                    if(is_pay==0){
                      //无需支付直接预约
                      wx.request({
                        url: app.globalData.url + 'index/YuYue/appointment',
                        method:'POST',
                        data: {
                          openid: openid,
                          // order: order,不需要订单
                          cour_id: cour_id,
                          yuyue_info: yuyue_info,
                          phone: res1.data.phoneNumber,
                          cour_name:cour_name,
                          // is_coupon:is_coupon,
                          // coupon_id:coupon_id,
                        },
                        header: {
                          'content-type': 'application/json' // 默认值
                        },
                        success(res4) {
                          console.log(res4.data)
                          that.auth_set()
                          that.setData({
                            success_yuyue:true
                          })
                        }
                      })
                      
                    }else{
                      //开始支付 判断字符金额是否等于0
                      if(total==0){
                        //不用支付直接预约
                        //保存预约信息
                        wx.request({
                          url: app.globalData.url + 'index/YuYue/appointment',
                          method:'POST',
                          data: {
                            openid: openid,
                            // order: order,不需要订单
                            cour_id: cour_id,
                            cour_name:cour_name,
                            yuyue_info: yuyue_info,
                            phone: res1.data.phoneNumber,
                            is_coupon:0,
                            // coupon_id:coupon_id,
                          },
                          header: {
                            'content-type': 'application/json' // 默认值
                          },
                          success(res4) {
                            console.log(res4.data)
                            that.auth_set()
                            that.setData({
                              success_yuyue:true
                            })
                          }
                        })
                      }else{
                        wx.request({
                          url: app.globalData.url+'index/Pay/pay',
                          data:{
                            total_fee: total,
                            openid: openid,
                            body:'课程预约'
                          },
                          header: {
                            'content-type': 'application/json' // 默认值
                          },
                          success(res2){
                            console.log(res2)
                            var data = res2.data;
                            wx.requestPayment({
                              timeStamp: data.timeStamp,
                              nonceStr: data.nonceStr,
                              package: data.package,
                              signType: data.signType,
                              paySign: data.paySign,
                              success: function (res3) {
                                // var order=res2.data.package;
                                var order_id=res2.data.out_trade_no;//商户订单号
                                //保存预约信息
                                wx.request({
                                  url: app.globalData.url + 'index/YuYue/appointment',
                                  method:'POST',
                                  data: {
                                    openid: openid,
                                    order_id: order_id,
                                    cour_id: cour_id,
                                    cour_name:cour_name,
                                    yuyue_info: yuyue_info,
                                    phone: res1.data.phoneNumber,
                                    is_coupon:is_coupon,
                                    coupon_id:coupon_id,
                                    pay_total:total//将支付的价格存储
                                  },
                                  header: {
                                    'content-type': 'application/json' // 默认值
                                  },
                                  success(res4) {
                                    console.log(res4.data)
                                    that.auth_set()
                                    that.setData({
                                      success_yuyue:true
                                    })
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
                      }
                    }
                   
                  }
                },
                fail: function (err) {
                  console.log(err);
                }
              })
            }
          }
        }) 
}, 
//开启消息通知
news_tip:function(){
  wx.requestSubscribeMessage({
    tmplIds: [
      'NI-MUUWtAGNfBzhjDDwZSXEvdpr05ynKotDkRGbDfIs'
    ],
    success (res) { 
      console.log(res)
      if(res['NI-MUUWtAGNfBzhjDDwZSXEvdpr05ynKotDkRGbDfIs']=='accept'){
        wx.navigateBack({
          delta: 1
        })
      }else{
        wx.navigateBack({
          delta: 1
        })
      }
     }
  })
},
//查询用户当前设置
auth_set:function(){
  var that=this
  wx.getSetting({
    withSubscriptions:true,
    success: (res) => {
      console.log(res)
      // console.log(res.withSubscriptions)
      if(res.subscriptionsSetting.itemSettings['NI-MUUWtAGNfBzhjDDwZSXEvdpr05ynKotDkRGbDfIs']=='accept'){
       that.setData({
         news_tip:true
       })
      }else{
       that.setData({
         news_tip:false
       })
      }
    },
  })
},
  //地址导航
  chooseLocation: function () {
    const latitude = this.data.cour_info.lat*1;
    const longitude = this.data.cour_info.long*1;
    var name = this.data.cour_info.address;
    var address = this.data.cour_info.location;
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