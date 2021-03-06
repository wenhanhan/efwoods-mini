// package3/summer_camp/summer_camp.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
var cityData = require('../../utils/city.js'); //引入自己定位的市区数据信息
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shaixuan:0,//筛选页面回传参数
    address:'',
    cityleft: cityData.getCity(), //获取省区域的下拉框筛选项内容
    price_order:false,
    order:0,//默认按综合排序
    is_fix:false,
    top_bar_height:'',//导航条高度
    swiper_height:'',
    camp:[
    ],
    tab_idx:0,//tab选中的位置
    city:'定位中',//市
    imgUrls:[],
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
    var that=this;
    var price_order=this.data.price_order;
    var idx=e.currentTarget.dataset.idx
    
    if(idx==this.data.tab_idx&&idx==2){
      price_order=!price_order
      that.setData({
        price_order:price_order
      })
    }
    this.setData({
      tab_idx:e.currentTarget.dataset.idx
    })
    if(idx==0){
      that.getCamp(0)
    }else if(idx==1){
      that.getCamp(1)
    }else if(that.data.price_order&&idx==2){
      that.getCamp(21)
    }else if(!that.data.price_order&&idx==2){
      that.getCamp(22)
    }else{
      this.setData({
        shaixuan:0
      })
      wx.navigateTo({
        url: '../summer_camp_shaixuan/summer_camp_shaixuan',
      })
    }
    //开启排序
  },
  //选择城市跳转
  select_city:function(){
    wx.navigateTo({
      url: '../../pages/select_city/select_city',
    })
  },
   //输入事件
   input: function (e) {
    this.setData({
      text: e.detail.value
    })
  },
  search:function(){
    var that=this;
    wx.showLoading({
      title: '搜索中…',
    })
    var address=this.data.address
    var text = that.data.text.trim();
    wx.request({
      url: app.globalData.url + 'index/SummerCamp/searchCamp',
      data: {
        address: address,
        key:text
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        console.log(res.data)
        that.setData({
          camp: res.data,
        })
      }
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
    var shaixuan=this.data.shaixuan?this.data.shaixuan:0;
    console.log(shaixuan)
    var select_city = app.globalData.select_city;
    var new_city = wx.getStorageSync('new_city');
    // var province = wx.getStorageSync('address').province;//当前的省
    // var city = wx.getStorageSync('address').city;//当前的省市
    if(!select_city){
      this.getUserLocation();
    }else{
      this.setData({
        city: that.substr(select_city)
      })
    }
    that.setData({
      tab_idx:0
    })
    var select_city = app.globalData.select_city;
    var store_city = wx.getStorageSync('address').city;
    //获得城市
    var city = select_city ? select_city : store_city;
     //获得省
     var select_province;
     qqmapsdk.geocoder({
       address: city,
       success: function (res) {
         select_province = res.result.address_components.province
         console.log(select_province)
         wx.setStorageSync('select_address', res.result)
         //插入全部
         var a = that.data.cityleft[select_province][city];
         if (a.indexOf('全部') == -1) {
           a.unshift('全部')
         }
         that.setData({
           select_province: select_province,
           select2: city,
         })
       }
     })
     if (!app.globalData.select_city){
      var province = wx.getStorageSync('address').province;//当前的省
      var city = wx.getStorageSync('address').city;//当前的省市
      var district = that.data.select3;//选择的区
      var address = province + city;
      console.log('请求的城市' + province + city + district)
      //获取首页轮播图与夏令营列表
    wx.request({
      url: app.globalData.url + 'index/SummerCamp/getBanner',
      data: {
        address:address,
        shaixuan:shaixuan
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          imgUrls: res.data[0],
          camp:res.data[1],
          address:address
        })
      }
    })
     }else{
      //从选择的省市筛选
      var city = app.globalData.select_city;
      qqmapsdk.geocoder({
        address: city,
        success: function (res) {
          select_province = res.result.address_components.province
          var address = select_province + city 
          wx.request({
            url: app.globalData.url + 'index/SummerCamp/getBanner',
            data: {
              address:address,
              shaixuan:shaixuan
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res.data)
              that.setData({
                imgUrls: res.data[0],
                camp:res.data[1],
                address:address
              })
            }
          })
        }
      })
     }
    //获取banner
    
  },
  getCamp(order){
    var that=this;
    // var province = wx.getStorageSync('address').province;//当前的省
    // var city = wx.getStorageSync('address').city;//当前的省市
    var address = that.data.address;
    wx.request({
      url: app.globalData.url + 'index/SummerCamp/getCampByOrder',
      data: {
        address:address,
        order:order
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          camp:res.data
        })
      }
    })
  },
  view:function(e){
    var camp_id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../summer_camp_des/summer_camp_des?camp_id='+camp_id,
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