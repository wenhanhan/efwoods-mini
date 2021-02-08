
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var common = require('../../utils/common.js');
var qqmapsdk;
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dailyExercise:[],//每日一练
    is_select_city:false,
    //新的登录方式
    openid: '',
    userInfo: {},
    isIphoneX: false,
    tabbar: {},
    freeze:'',//是否被冻结
    imgUrls:[],
    courses:[
    ],
    cour_num: '',//课程卡片的数量
    //猜你喜欢 教师列表
    favor_teacher:[],
    //猜你喜欢 课程列表
    favor_course:[],
  //管理员推荐课程 教师
   home_course:[],
   home_teacher:[],
    video: [],//教练秀
    favor_course_star:[],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    province:'',//省
    city:'定位中',//市
    latitude: '',//经度
    longitude: '',//纬度
    select_city:false,//选择的城市
    more_state: false,
    identity:0,
    news:0//消息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabbar();
    var that=this;
    var isIphoneX = app.globalData.isIphoneX;
    this.setData({
      isIphoneX: isIphoneX
    })
    qqmapsdk = new QQMapWX({
      key: 'K3PBZ-PSUCD-T3A4R-P5JPH-6MCR2-KYF6K' //key秘钥 
    });

    //版本更新提示
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
    that.getRecommendCourse();
    that.getDailtExercise();
  },
  getDailtExercise(){
    var that=this;
    wx.request({
      url: app.globalData.url+'index/Recommend/getDailyExercise',
      data:{},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data)
        that.setData({
          dailyExercise:res.data
        })
      }
    })
  },
  getRecommendCourse(){
    var that=this;
   //获取推荐课程
   if (!app.globalData.select_city) {
    var province = wx.getStorageSync('address').province;//当前的省
    var city = wx.getStorageSync('address').city;//当前的省市
    var latitude = wx.getStorageSync('address').location.lat;//本人实际位置的经纬度
    console.log(latitude)
    var longitude = wx.getStorageSync('address').location.lng;
    var address = province + city;//（只保留省市）
    wx.request({
      url: app.globalData.url + 'index/Recommend/homeRecommend',
      data: {
        address: address,
        latitude: latitude,
        longitude: longitude,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        // wx.hideLoading()
        that.setData({
          favor_course: res.data,
        })
      }
    })
  } else {
    //根据选择的位置进行筛选
    console.log(44444)
    var city = app.globalData.select_city;
    var select_province = '';
    qqmapsdk.geocoder({
      address: city,
      success: function (res) {
        console.log(res.result)
        select_province = res.result.address_components.province
        var latitude = wx.getStorageSync('address').location.lat;//本人实际位置的经纬度
        var longitude = wx.getStorageSync('address').location.lng;
        console.log('请求的城市' + select_province + city)
        var address = select_province + city
        wx.request({
          url: app.globalData.url + 'index/Recommend/homeRecommend',
          data: {
            address: address,
            latitude: latitude,
            longitude: longitude,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res.data)
            // wx.hideLoading()
            that.setData({
              favor_course: res.data
            })
          }
        })
      }
    })
  }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.hidetabbar();
    var that=this;
    if(this.data.is_select_city){
      console.log(888)
      that.getRecommendCourse()
    }
    wx.removeStorageSync('new_city');//清除切换城市选择的新的城市
    //获取openid 并判断用户身份
    app.getOpenid().then(function (res) {
      if (res.status == 200) {
        that.setData({
          openid: wx.getStorageSync('openid')
        })
        console.log(that.data.openid)
        //判断用户身份
        wx.request({
          url: app.globalData.url + 'index/Identity/identity',
          data: {
            openid: that.data.openid
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            // console.log(res.data)
            wx.setStorageSync('identity', res.data[0])
            app.globalData.identity = res.data[0];
            app.globalData.vvip=res.data[1]
          }
        })
      } else {
        console.log(res.data);
      }
    });
    
    //信息再次获取
    app.globalData.identity = wx.getStorageSync('identity')
    that.setData({
      openid: wx.getStorageSync('openid'),
      userInfo: wx.getStorageSync('userInfo'),
      identity:app.globalData.identity,
      more_state:false//隐藏遮罩
    })
    console.log(app.globalData)

    var address=wx.getStorageSync('')
    var select_city = app.globalData.select_city;
    if(!select_city){
      this.getUserLocation();
    }else{
      this.setData({
        city: that.substr(select_city)
      })
    }
    //首页轮播图
    wx.request({
      url: app.globalData.url + 'index/Lunbo/getHomeBanner',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          imgUrls: res.data
        })
      }
    })

    //获取课程栏目卡片
    wx.request({
      url: app.globalData.url + 'index/Lunbo/getCourseCards',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          courses: res.data,
          cour_num: res.data.length
        })
      }
    })
//判断用户是否被冻结 0未被冻结 1 已被冻结
    wx.request({
      url: app.globalData.url + 'index/Identity/freeze',
      data: {
        openid: that.data.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          freeze: res.data
        })
        app.globalData.freeze = res.data;
      }
    })

    //获取教练秀视频
    wx.request({
      url: app.globalData.url + 'index/Show/showVideo',
      data: {
        type:0,
        page:1
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        // console.log(res.data)
        that.setData({
          video: res.data
        })
      }
    })
    //判断是否有未读消息
    wx.request({
      url: app.globalData.url +'index/News/isNewsUnRead',
      data:{
        openid:that.data.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data)
        that.setData({
          news:res.data
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
  more_info: function () {
    var state = this.data.more_state;
    console.log(state)
    this.setData({
      more_state: state == true ? false : true
    })
  },
  //查看消息
  news: function () {
    wx.navigateTo({
      url: '../news/news',
    })
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
  //切换城市
  qiehuan:function(){ 
    wx.navigateTo({
      url: '../select_city/select_city',
    })
  },
  //视频播放事件
  play: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.idx;//视频序号
    var video = that.data.video[index];
    wx.navigateTo({
      url: '../show_des/show_des?video=' + video.video + '&title=' + encodeURIComponent(video.title) + '&name=' + encodeURIComponent(video.nickName) + '&img=' + video.avatarUrl + '&openid=' + video.openid + '&favor=' + video.favorPerson.length + '&videoid=' + video.Id+'&cover='+encodeURIComponent(video.cover),
    })
  },

  //教练详情页跳转
  tea_des:function(e){
    var tea_id=e.currentTarget.dataset.teaid;
    wx.navigateTo({
      url: '../tea_detail/tea_detail?tea_id=' + tea_id,
    })
  },
  //课程详情页挑战
  //检测是否授权 只有授权才可查看教师详情
  course_des:function(e){
    // var userInfo = wx.getStorageSync('userInfo');//用户信息
    var cour_id=e.currentTarget.dataset.courid;//课程id
    var distance=e.currentTarget.dataset.distance;//课程距离
    var cour_type = e.currentTarget.dataset.courtype;//课程类别
    wx.navigateTo({
      url: '../cour_detail/cour_detail?cour_id=' + cour_id + '&distance=' + distance + '&cour_type=' + cour_type,
    })
  },
  jump_shop: function () {
    wx.navigateToMiniProgram({
      appId: 'wx83f243f73b48c56c',
      success(res) {
        // 打开成功
        console.log('打开成功')
      }
    })
  },

//更多下拉事件
check:function(){
  var that = this;
  var userInfo = wx.getStorageSync('userInfo');
  if(userInfo){
    if (app.globalData.freeze == 1) {
      wx.showToast({
        title: '你已被冻结',
        icon: 'loading',
        duration: 2000
      })
    }else{
      console.log('可以核销')
      common.check()
    }
  }else{
    app.login()
  }
},
  scan:function(){
    var that=this;
    var userInfo=wx.getStorageSync('userInfo');
    var openid = wx.getStorageSync('openid');
    if(userInfo){
      console.log('scan') 
      if (app.globalData.freeze == 1) {
        wx.showToast({
          title: '你已被冻结',
          icon: 'loading',
          duration: 2000
        })
      } else {
        wx.scanCode({
          onlyFromCamera: true,
          scanType: ['qrCode'],
          success(res) {
            console.log('扫描成功'+res.result);
            var cour_id = res.result.split("/")[0]; //主要获取课程签到码的课程id1
            if (cour_id % 1 === 0) {
              console.log(cour_id)
              wx.showToast({
                title: '正在签到',
                icon: 'loading',
                duration: 2000,
                success(res) {
                  wx.request({
                    url: app.globalData.url + 'index/Sign/sign',
                    data: {
                      openid: openid,
                      courId: cour_id * 1
                    },
                    header: {
                      'content-type': 'application/json' // 默认值
                    },
                    success(res) {
                      common.judge(2)
                      wx.showToast({
                        title: '签到成功',
                        icon: 'success',
                        duration: 1000,
                        success(res) {
                          wx.navigateTo({
                            url: '../myset/sign/sign',
                          })
                          // that.getSignInfo()
                        }
                      })
                    }
                  })
                }
              })
            } else {
              wx.showToast({
                title: '无效签到码',
                icon: 'loading',
                duration: 2000
              })
            }

          }
        })
      }
    }else{
      app.login()
    }
  },
  ticket:function(){
    var userInfo=wx.getStorageSync('userInfo')
    if(userInfo){
      wx.navigateTo({
        url: '../myset/mycoupon/mycoupon',
      })
    }else{
      app.login()
    }
  },
  spread:function(){
    var userInfo = wx.getStorageSync('userInfo')
    if(userInfo){
      wx.navigateTo({
        url: '../myset/spread_card/spread_card',
      })
    }else{
      app.login()
    }
  },
  dingyue:function(){
    var userInfo = wx.getStorageSync('userInfo')
    if(userInfo){
      wx.navigateTo({
        url: '../myset/my_dingyue/my_dingyue',
      })
    }else{
      app.login()
    }
  },
  //快速入驻
  join:function(){
    wx.navigateTo({
      url: '../share/share',
    })
  },
    //课程点击跳转
    course_des:function(e){
      var cour_id = e.currentTarget.dataset.courid;//课程id
      var distance = e.currentTarget.dataset.distance;//课程距离
      var cour_type = e.currentTarget.dataset.courtype;//课程类别
      this.setData({
        is_select_city:false
      })
      wx.navigateTo({
        url: '../cour_detail/cour_detail?cour_id=' + cour_id + '&distance=' + distance + '&cour_type=' + cour_type,
      })
    },
  fresh:function(e){
    wx.showLoading({
      title: '正在寻找~',
    })
    setTimeout(() => {
      wx.hideLoading({
      })
    }, 500);
    this.getRecommendCourse()
  },
  //更多热门动态
  more_hot:function(){
    wx.switchTab({
      url: '../show/show',
    })
  },
  more_exercise:function(){
    wx.navigateTo({
      url: '../../package3/daily_exercise/daily_exercise',
    })
  },
  viewDailyExercise:function(e){
    var id=e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../package3/daily_exercise_des/daily_exercise_des?video_id='+id,
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