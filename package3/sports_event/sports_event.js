// pages/sports event/sports event.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winheight:"",//窗口高度
    currenttab:0, //预设当前项的值
    scrollleft:0, //tab标题的滚动条位置
    isIphoneX:false,
    city:'定位中',//市
    imgUrls:[
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    sports_type:['高尔夫','篮球','羽毛球','足球','跆拳道','网球'],
    sports:[
    ]
  },
//选择城市跳转
select_city:function(){
  wx.navigateTo({
    url: '../select_city/select_city',
  })
},
//搜索框跳转
search:function(){
  wx.navigateTo({
    url: '../search/search',
  })
},
// 滚动切换标签样式
switchtab:function(e){
  console.log(this.data.sports_type[e.detail.current].Id)
  this.getSportsList(this.data.sports_type[e.detail.current].Id)
  this.setData({
    currenttab:e.detail.current,
    // winheight:this.data.sports[this.data.currenttab].length==0
  });
  this.checkcor();
},
// 点击标题切换当前页时改变样式
swichnav:function(e){
  var cur=e.target.dataset.current;
  if(this.data.currenttab==cur){
    console.log(this.data.sports_type[cur].Id)
    this.getSportsList(this.data.sports_type[cur].Id)
    return false;
  }
  else{
    this.setData({
      currenttab:cur
    })
  }
},
//判断当前滚动超过一屏时，设置tab标题滚动条。
checkcor:function(){
 if (this.data.currenttab>3){
  this.setData({
   scrollleft:300
  })
 }else{
  this.setData({
   scrollleft:0
  })
 }
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
    var that=this;
    var isIphoneX = app.globalData.isIphoneX;
    this.setData({
      isIphoneX: isIphoneX,
    })
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
    //获取首页轮播图与赛事类别
    wx.request({
      url: app.globalData.url + 'index/SportsEvent/getBanner',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          imgUrls: res.data[0],
          sports_type:res.data[1]
        })
        that.getSportsList(res.data[1][0].Id)
      }
    })
  },
  //获取赛事列表
  getSportsList(type){
    var that=this;
    var sports=this.data.sports;
    var province = wx.getStorageSync('address').province;//当前的省
    var city = wx.getStorageSync('address').city;//当前的省市
    var address = province + city;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'index/SportsEvent/getSportsList',
      data: {
        type:type,
        address:address
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        wx.hideLoading({
        })
        that.setData({
          sports:res.data,
          winheight:res.data[that.data.currenttab].length==0?425:res.data[that.data.currenttab].length*425
        })
      }
    })
  },
  //跳转
  view:function(e){
    var sports_id=e.currentTarget.dataset.id;
    var state=e.currentTarget.dataset.state;
    wx.navigateTo({
      url: '../sports_event_des/sports_event_des?sports_id='+sports_id+'&state='+state,
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