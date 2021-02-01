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
      {
        url:'',
        img:'https://cdn.icloudapi.cn/sports_banner.png'
      }
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    sports_type:['高尔夫','篮球','羽毛球','足球','跆拳道','网球'],
    sports:[
      {
        img:'https://cdn.icloudapi.cn/sports_pp.png',
        url:'',
        title:'上海市第二届乒乓球比赛报名啦!',
        time:'2021-02-03至2021-02-01',
        status:'进行中',
        is_hot:true
      },
      {
        img:'https://cdn.icloudapi.cn/sports_pp.png',
        url:'',
        title:'上海市第二届乒乓球比赛报名啦!',
        time:'2021-02-03至2021-02-01',
        status:'进行中',
        is_hot:false
      },
      {
        img:'https://cdn.icloudapi.cn/sports_pp.png',
        url:'',
        title:'上海市第二届乒乓球比赛报名啦!',
        time:'2021-02-03至2021-02-01',
        status:'进行中',
        is_hot:false
      }
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
  this.setData({
    currenttab:e.detail.current,
    winheight:this.data.sports.length*(390+35)
  });
  this.checkcor();
},
// 点击标题切换当前页时改变样式
swichnav:function(e){
  var cur=e.target.dataset.current;
  if(this.data.currenttab==cur){return false;}
  else{
    this.setData({
      currenttab:cur
    })
  }
},
//判断当前滚动超过一屏时，设置tab标题滚动条。
checkcor:function(){
 if (this.data.currenttab>4){
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
      winheight:this.data.sports.length*(390+35)
    })
    qqmapsdk = new QQMapWX({
      key: 'K3PBZ-PSUCD-T3A4R-P5JPH-6MCR2-KYF6K' //key秘钥 
    });
    // 高度自适应
    // wx.getSystemInfo( { 
    //   success: function( res ) { 
    //     console.log(res)
    //     var clientheight=res.windowHeight,
    //       clientwidth=res.windowWidth,
    //       rpxr=750/clientwidth;
    //    var calc=clientheight*rpxr-180;
    //     console.log(calc)
    //     that.setData( { 
    //       winheight: calc 
    //     }); 
    //   } 
    // });
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