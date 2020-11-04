var app=getApp();
//异步回调 type参数
const judge=type=>{
  var openid = wx.getStorageSync('openid');
  var state = app.globalData.is_shop_login ? 1 : 0;
  var shop_uid = app.globalData.shop_uid;
  return new Promise((resolve,reject)=>{
    wx.request({ 
      url: app.globalData.url + 'index/Points/points',
      data: {
        openid: openid, 
        point_type: type,
        shop_uid: shop_uid,
        state: state//积分表连通状态
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => resolve(res)
    }) 
  }) 
} 
//消息通知 active表示用户关注动作
function news(type, cour_id, tea_id,active) {
  var openid = wx.getStorageSync('openid');
  wx.request({
    url: app.globalData.url + 'index/News/tips',
    data: {
      from_openid: openid,
      type: type,
      cour_id: cour_id,
      tea_id: tea_id,
      active: active,
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {
      console.log(res.data)
    }
  })
}
//将消息置为已读
function setNewsRead(type, id) {
  var openid = wx.getStorageSync('openid')
  wx.request({
    url: app.globalData.url + 'index/News/setNewsRead',
    data: {
      openid: openid,
      type: type,
      newsid: id
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {
      console.log(res.data)
    }
  })
}
//获取网络图片地址信息 url参数
const getImgInfo=url=>{
  return new Promise((resolve,reject)=>{
    wx.getImageInfo({
      src: url,
      success:res=>resolve(res)
    })
  })
}
//核销优惠券二维码
function check(){
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
          title: '无效核销码',
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
}

// function judge(type){
//   var openid=wx.getStorageSync('openid');
//   var state = app.globalData.is_shop_login ? 1 : 0;
//   var shop_uid = app.globalData.shop_uid;
//   wx.request({
//     url: app.globalData.url+'index/Points/points',
//     data:{
//       openid:openid,
//       point_type:type,
//       shop_uid:shop_uid,
//       state:state//积分表连通状态
//     },
//     header: {
//       'content-type': 'application/json' // 默认值
//     },
//     success(res){
//       console.log(res.data)
//       return res.data;
//     }
//   })
// }
// 支付函数
function pay(total_fee, openid) {
  var total_fee = total_fee;
  wx.request({
    url: app.globalData.url + 'index/Pay/pay',
    // method: "POST",
    data: {
      total_fee: total_fee,
      openid: openid,
      body:'eFIREWOODS'
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {  //后端返回的数据
      var data = res.data;
      console.log(data);
      console.log(data.timeStamp);
      wx.requestPayment({
        timeStamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.package,
        signType: data.signType,
        paySign: data.paySign,
        success: function (res) {
          return data;
          wx.showModal({
            title: '支付成功',
            content: '',
          })
        },
        fail: function (res) {
          console.log(res);
        }
      })
    }
  })
}
module.exports={
  judge:judge,
  getImgInfo: getImgInfo,
  news: news,
  setNewsRead: setNewsRead,
  pay:pay,
  check:check
}