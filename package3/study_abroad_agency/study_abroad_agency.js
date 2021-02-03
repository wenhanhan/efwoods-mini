// package3/study_abroad_agency/study_abroad_agency.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city:'定位中',//市
    imgUrls:[
      {
        url:'',
        img:'https://cdn.icloudapi.cn/study_abroad_agency.png'
      }
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    agency:[
      {
        img:'../img/agency2.png',
        name:'兴致体育',
        tag:'高尔夫/足球'
      },
      {
        img:'../img/agency2.png',
        name:'兴致体育',
        tag:'高尔夫/足球'
      },
      {
        img:'../img/agency2.png',
        name:'兴致体育',
        tag:'高尔夫/足球'
      },
      {
        img:'../img/agency2.png',
        name:'兴致体育',
        tag:'高尔夫/足球'
      }
    ]
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: 'K3PBZ-PSUCD-T3A4R-P5JPH-6MCR2-KYF6K' //key秘钥 
    });
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