// package3/summer_camp/summer_camp.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_fix:false,
    top_bar_height:'',//导航条高度
    swiper_height:'',
    camp:[
      {
        name:'2021西点陆军7天冬令营',
        people:'6~16周岁',
        tag:['军事拓展','感恩','体验军旅','拓展'],
        price:'3800',
        duration:'7天',
        img:'../img/camp/camp.png'
      },
      {
        name:'2021西点陆军7天冬令营',
        people:'6~16周岁',
        tag:['军事拓展','感恩','体验军旅','拓展'],
        price:'3800',
        duration:'7天',
        img:'../img/camp/camp.png'
      },
      {
        name:'2021西点陆军7天冬令营',
        people:'6~16周岁',
        tag:['军事拓展','感恩','体验军旅','拓展'],
        price:'3800',
        duration:'7天',
        img:'../img/camp/camp.png'
      },
      {
        name:'2021西点陆军7天冬令营',
        people:'6~16周岁',
        tag:['军事拓展','感恩','体验军旅','拓展'],
        price:'3800',
        duration:'7天',
        img:'../img/camp/camp.png'
      },
      {
        name:'2021西点陆军7天冬令营',
        people:'6~16周岁',
        tag:['军事拓展','感恩','体验军旅','拓展'],
        price:'3800',
        duration:'7天',
        img:'../img/camp/camp.png'
      },
      {
        name:'2021西点陆军7天冬令营',
        people:'6~16周岁',
        tag:['军事拓展','感恩','体验军旅','拓展'],
        price:'3800',
        duration:'7天',
        img:'../img/camp/camp.png'
      }
    ],
    tab_idx:0,//tab选中的位置
    city:'定位中',//市
    imgUrls:[
      {
        url:'',
        img:'https://cdn.icloudapi.cn/summer_camp.png'
      }
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    tab:['综合排序','销量优先','价格','筛选']
  },
    // 截取字符串,多余省略号显示
    substr: function (val) {
      if (val.length == 0 || val == undefined) {
        return '';
      } else if (val.length > 4) {
        return val.substring(0, 3) + "...";
      } else {
        return val;
      }
    },
  tab:function(e){
    this.setData({
      tab_idx:e.currentTarget.dataset.idx
    })
  },
  //选择城市跳转
  select_city:function(){
    wx.navigateTo({
      url: '../../pages/select_city/select_city',
    })
  },
 //获取用户位置
 getUserLocation:function(){
  var that=this;
  wx.getSetting({
    success(res){
      if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true){
        wx.showModal({
          title: '请求授权获取当前位置',
          content: '需要获取您的地理位置，请确认授权',
          success:function(res){
            if(res.cancel){
              wx.showToast({
                title: '拒绝授权',
                icon: 'none',
                duration: 1000
              })
            }else if(res.confirm){
              wx.openSetting({
                success:function(res){
                  if (res.authSetting['scope.userLocation']===true){
                    wx.showToast({
                      title: '授权成功',
                      icon: 'success',
                      duration: 1000
                    })
                    that.getLocation();
                  }else{
                    wx.showToast({
                      title: '授权失败',
                      icon: 'none',
                      duration: 1000
                    })
                  }
                }
              })
            }
          }
        })
      } else if (res.authSetting['scope.userLocation'] == undefined){
        that.getLocation();
      }else{
        that.getLocation();
      }
    }
  })

},

//获取当前经纬度
getLocation:function(){
  var that=this;
  wx.getLocation({
    type: 'wgs84',
    success: function(res) {
      var latitude = res.latitude
      var longitude = res.longitude
      var speed = res.speed
      var accuracy = res.accuracy;
      that.getLocal(latitude,longitude)
    },
    fail:function(res){
      console.log('fail' + JSON.stringify(res))
    }
  })
},
//获取当前位置
getLocal: function (latitude,longitude){
  var that=this;
  qqmapsdk.reverseGeocoder({
    location: {
      latitude: latitude,
      longitude: longitude
    },
    success:function(res){
      wx.setStorageSync('address', res.result.ad_info)
      let province = res.result.ad_info.province
      let city = res.result.ad_info.city
      that.setData({
        province: province,
        city: that.substr(city),
        latitude: latitude,
        longitude: longitude
      })
    },
    fail: function (res) {
      console.log(res);
    },
    complete: function (res) {
      // console.log(res);
    }
  })
},
onPageScroll: function(res) {
  // console.log(res);
  var swiper_height=this.data.swiper_height
  if(res.scrollTop>=swiper_height){
    //将导航栏定位
    this.setData({
      is_fix:true
    })
  }else{
    this.setData({
      is_fix:false
    })
  }
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: 'K3PBZ-PSUCD-T3A4R-P5JPH-6MCR2-KYF6K' //key秘钥 
    });
    let query = wx.createSelectorQuery();
    query.select('#swiper').boundingClientRect(
      (rect) => {
        let top = rect.top;//轮播图距离上边界的大小
        this.setData({
          top_bar_height: top
        })
        console.log('顶部导航高度' + top)
      }
    ).exec();
    query.select('#menu-nav').boundingClientRect(
      (rect) => {
        let top = rect.top;//筛选导航距离上边界的大小
        this.setData({
          swiper_height: top-this.data.top_bar_height
        })
        console.log('轮播图高度' + this.data.swiper_height)
      }
    ).exec();
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
    var select_city = app.globalData.select_city;
    if(!select_city){
      this.getUserLocation();
    }else{
      this.setData({
        city: that.substr(select_city)
      })
    }
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