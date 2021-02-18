//app.js
App({

  //自己对wx.hideTabBar的一个封装
  hidetabbar() {
    wx.hideTabBar({
      fail: function () {
        setTimeout(function () { // 做了个延时重试一次，作为保底。
          wx.hideTabBar()
        }, 500)
      }
    });
  },
  getSystemInfo: function () {
    let t = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        let modelmes = res.model;
        if (modelmes.search('iPhone X') != -1) {
          t.globalData.isIphoneX = true
        }
      }
    });
  },
  editTabbar: function () {
    let tabbar = this.globalData.tabBar;
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },

  //promise异步加载获取openid
  getOpenid: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      wx.login({
        success: function (res) {
          //code 获取用户信息的凭证
          if (res.code) {
            //请求获取用户openid
            wx.request({
              url: that.globalData.url + 'index/index/getUserOpenid',
              data: { "code": res.code },
              method: 'GET',
              header: {
                'Content-type': 'application/json'
              },
              success: function (res) {
                console.log(res.data)
                wx.setStorageSync('openid', res.data.openid);//存储openid
                wx.setStorageSync('session_key', res.data.session_key);//缓存unionId
                var res = {
                  status: 200,
                  data: res.data.openid
                }
                resolve(res);
              }
            });
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
            reject('error');
          }
        }
      })
    });
  }, 


  //查询入驻费用
  fee: function () {
    var that = this;
    wx.request({
      url: that.globalData.url + 'index/Pay/entryFee',
      data: {},
      header: {
        'Content-type': 'application/json'
      },
      success(res) {
        console.log(res.data)
        wx.setStorageSync('fee', res.data)
        that.globalData.fee = res.data;
      }
    })
  },
  //查询是否开启审核
  isMiniChecking:function(){
    var that=this;
    wx.request({
      url: that.globalData.url+'index/systemConfig/isChecking',
      data:{},
      header: {
        'Content-type': 'application/json'
      },
      success(res){
        console.log('审核状态'+res.data)
        that.globalData.is_checking=res.data==1?true:false
      }
    })
  },

  //查询商城是否登录
  is_shop_login:function(unionId,openid){
    var that=this;
    wx.request({
      url: that.globalData.url +'index/Auth/isShopLogin',
      data:{
        unionId:unionId,
        openid:openid
      },
      header: {
        'Content-type': 'application/json'
      },
      success(res){
        console.log(res.data)
        if(res.data.code==200){
          that.globalData.is_shop_login=true,
          that.globalData.shop_uid=res.data.shop_uid
        }else{
          that.globalData.is_shop_login=false,
          that.globalData.shop_uid=false
        }
      }
    })
  },
  //公共登录方法
  login:function(){
    var that=this;
    //登录
    wx.login({
      success:res=>{
         // 发送 res.code 到后台换取 openId, sessionKey, unionId
         if(res.code){
           wx.request({
             url: that.globalData.url + 'index/index/getUserOpenid',
             data: { "code": res.code },
             method: 'GET',
             header: {
               'Content-type': 'application/json'
             },
             success(res){
               console.log(res.data)
               wx.setStorageSync('session_key', res.data.session_key);//缓存unionId
               wx.setStorageSync('openid', res.data.openid);//存储openid
             }
           })
         }
      }
    })
    //获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // wx.setStorageSync('userInfo', res.userInfo)
              console.log('已经授权')
              //存储用户信息
              // wx.request({
              //   url: that.globalData.url + 'user/sendCode1',
              // })

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          //使用绝对路径
          wx.navigateTo({
            url: '/pages/auth/auth',
          })
        }
      }
    })
  },

  //查询课程类别
  course_type:function(){ 
    var that=this;
    return new Promise((resolve,reject)=>{
      wx.request({
        // url: this.globalData.url +'index/Course/seleCourType',
        url: that.globalData.url + 'index/Course/selectType',//新接口
        data: {},
        header: {
          'content-type': 'application/json' // 默认值
        },
        success:res=>resolve(res)
      })
    })
  },

  //获取用户身份 最先判断
  getIdentity(openid){
    var that=this;
    wx.request({
      url: that.globalData.url + 'index/Identity/identity',
      data: {
        openid: openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log('先判断身份'+res.data[0])
        that.globalData.identity = res.data[0];
        that.globalData.vvip=res.data[1]
      }
    })
  },

  onLaunch: function (options) {
    this.hidetabbar();
    this.getSystemInfo();
    this.fee();
    //是否正在审核
    this.isMiniChecking();
    // 展示本地存储能力
    var that=this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录获取openid
    this.getOpenid() 
    var unionId=wx.getStorageSync('unionId');
    //存在unionId必定存在openid
    var openid=wx.getStorageSync('openid');
    //获取身份
    this.getIdentity(openid)
    if(unionId){
      //判断用户是否登录商城端
      this.is_shop_login(unionId,openid)
    }else{
      console.log('未登录')
    }
    // 获取用户信息
    // this.getUserInfo();
    console.log("[onLaunch] 本次场景值:", options.scene)
    that.globalData.home_state=options.scene
    //请求课程类型  异步加载请求数据返还给全局变量
    that.course_type()
    .then(res=>{
          wx.setStorageSync('apply_type', res.data)
          that.globalData.apply_type = res.data
          // console.log(res.data)
          // console.log(that.globalData.apply_type)
          var a = { Id: 0, type: "全部", img: "", pub: 0 }
          var b = res.data;
          b.unshift(a)
          that.globalData.cour_type = b
          console.log(that.globalData.cour_type)
    })

  },

  onShow: function () {
    let that = this;
    wx.getSystemInfo({
      success: res => {
        console.log('手机信息res'+res.model)
        console.log('手机信息' + res)
        let modelmes = res.model;
        if (modelmes.search('iPhone X') != -1) {
          that.globalData.isIphoneX = true
        }

      }
    })

  },

  globalData: {
    is_shop_login:false,
    shop_uid:'',//商城端用户id
    isIphoneX: false,
    userInfo: null,
    select_city:null,
    is_checking:false,
    identity:null,
    vvip:null,
    fee: '',//入驻费用
    freeze:null,//用户是否被冻结
    home_state:false,//用户进入的场景值
    // url:'http://tp5.com/index.php/',
    // url:'http://localhost/tp5/public/index.php/',
    url:'https://icloudapi.cn/efire/public/index.php/',
    cour_type:[
      
    ],//课程分类信息
    apply_type:[],//申请类型
    cour_img_url:'https://icloudapi.cn/efire/public/uploads/course/',//课程图片存放目录
    // cour_img_url:'http://tp5.com/uploads/course/',//课程图片存放目录
    // cour_img_url: 'http://localhost/tp5/public/uploads/course/',//课程图片存放目录 

    tabBar: {
      "backgroundColor": "#ffffff",
      "color": "#A6A6A6",
      "selectedColor": "#FACC3C",
      "list": [
        {
          "pagePath": "/pages/index/index",
          "iconPath": "icon/home.png",
          "selectedIconPath": "icon/home1.png",
          "text": "首页"
        },
        {
          "pagePath": "/pages/course/course",
          "iconPath": "icon/course.png",
          "selectedIconPath": "icon/course1.png",
          "text": "课程"
        },
        {
          "pagePath": "/pages/show/show",
          "iconPath": "icon/show.png",
          "isSpecial": true,
          "text": "动态"
        },
        {
          "pagePath": "/pages/teacher/teacher",
          "iconPath": "icon/teacher.png",
          "selectedIconPath": "icon/teacher1.png",
          "text": "教练"
        },
        {
          "pagePath": "/pages/myset/coach/coach",
          "iconPath": "icon/my.png",
          "selectedIconPath": "icon/my1.png",
          "text": "我的"
        }
      ]
    }


  }
})