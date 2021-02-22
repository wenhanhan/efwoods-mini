// pages/myset/coach/coach.js
var app=getApp()
const { $Toast } = require('../../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: false,
    tabbar: {},
    identity:'',//身份
    vvip:0,//vvip
    headimg:'',//头像
    nickname:'',//昵称
    course_num:'',//课程数
    judge_num:'',//评价数
    favor_num:'',//喜欢数
    exp:'',//经验值
    level:'',//等级
    tag1:'',//标签
    tag2:'',
    tag3:'',
    sex:'',//性别
    code:'',
    zige:'',
    agency_code: '',//机构入驻状态码
    teacher_code:'',//教师入驻状态码
    login:false,
    jifen_sum:0,
    state:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabbar();
    var isIphoneX = app.globalData.isIphoneX;
    this.setData({
      isIphoneX: isIphoneX
    })
  },

  //授权
  login: function () {
    //检查是否授权登录方法
    var that = this;
    var userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      that.setData({
        nickname: userInfo.nickName,
        headimg: userInfo.avatarUrl,
        login: true
      })
    } else {
      app.login()
    }
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
    app.hidetabbar();
    var that = this;
    wx.removeStorageSync('new_city');//清除切换城市选择的新的城市
    var openid = wx.getStorageSync('openid');
    var level;
    var userInfo = wx.getStorageSync('userInfo');
    //检查登录
    if(userInfo){
       //渲染用户头像与性别
      that.setData({
        headimg: wx.getStorageSync('userInfo').avatarUrl,
        nickname: that.substr(wx.getStorageSync('userInfo').nickName, 8),
        sex: wx.getStorageSync('userInfo').gender,
        login:true
      })
    }else{
      //未登陆
      that.setData({
        nickname: '点击登录',
        headimg: '/img/logo.png',
        login: false
      })
    }
    //判断用户身份
      wx.request({
        url: app.globalData.url + 'index/Identity/identity',
        data: {
          openid: openid
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data)
          that.setData({
            identity: res.data[0],
            vvip: res.data[1]
          })
          app.globalData.identity = res.data[0];
          app.globalData.vvip = res.data[1]
        }
      })
   //判断用户是否完善教师身份
     wx.request({
       url: app.globalData.url +'index/Identity/hasInfo',
       data: {
         openid: openid
       },
       header: {
         'content-type': 'application/json' // 默认值
       },
       success(res){
         console.log(res.data)
         that.setData({
           code:res.data.code
         })
       }
     })


      //获取教师总体信息
      wx.request({
        url: app.globalData.url + 'index/teacher/getTeacherInfo',
        data:{
          openid:openid
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res){
          console.log(res.data)
          that.setData({
            course_num:res.data[0],
            judge_num:res.data[1],
            favor_num:res.data[2],
            level:res.data[7],
            tag1:res.data[4],
            tag2:res.data[5],
            tag3:res.data[6]
          })
        }

      })

    //判断用户是否具有分享资格
    wx.request({
      url: app.globalData.url + 'index/Identity/shareCode',
      data: {
        openid: openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          zige: res.data
        })
      }
    })

    //判断用户是否进行机构入驻
    wx.request({
      url: app.globalData.url + 'index/Agency/applyState',
      data: {
        'openid': openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data.msg)
        console.log(res.data.code)
        that.setData({ 
          agency_code: res.data.code
        })
      }
    })
    //判断用户是否进行教师申请
    wx.request({
      url: app.globalData.url + 'index/Apply/applyState',
      data: {
        'openid': openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data.msg)
        console.log(res.data)
        that.setData({
          teacher_code: res.data.code
        })
      }
    }) 

    //经验值 等级 升级百分比
    wx.request({
      url: app.globalData.url + 'index/User/experience',
      data: {
        openid: openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          exp: res.data.exp,
        })
      }
    })
    //积分查询
    var unionId = wx.getStorageSync('unionId');
    var state = app.globalData.is_shop_login ? 1 : 0;
    var shop_uid = app.globalData.shop_uid;
    wx.request({
      url: app.globalData.url + 'index/Points/record',
      data: {
        openid: openid,
        state: state,
        shop_uid: shop_uid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          jifen_sum:res.data[1] * 1,
          state: state
        })
      }
    })
  
  },

  // 截取字符串,多余省略号显示
  substr: function (val, num) {
    if (val.length == 0 || val == undefined) {
      return '';
    } else if (val.length > num) {
      return val.substring(0, num) + "...";
    } else {
      return val;
    }
  },
  teacher_apply:function(){
    var userInfo = wx.getStorageSync('userInfo')
    var code=this.data.teacher_code;//教师入驻状态码
    if(userInfo){
      if (code == 401) {
        wx.navigateTo({
          url: '../../apply/apply',
        })
      } else if (code == 402) {
        wx.navigateTo({
          url: '../../agency_pay/agency_pay?type=2',
        })
      } else if (code == 200) {
        wx.navigateTo({ 
          url: '../../settled/settled',
        })
      } else if (code == 202) {
        wx.navigateTo({
          url: '../../checking/checking',
        })
      } else if (code == 201) {
        //审核未通过
        wx.navigateTo({
          url: '../../fail_checked/fail_checked?type=2',
        })
      } else {
        wx.navigateTo({
          url: '../../apply/apply',
        })
      }
    }else{
      app.login()
    }
   
  },

  agency_apply: function () {
    var userInfo = wx.getStorageSync('userInfo')
    var code = this.data.agency_code;//机构入驻状态码
    if(userInfo){
      if (code == 401) {
        wx.navigateTo({
          url: '../../agency_apply/agency_apply',
        })
      } else if (code == 402) {
        wx.navigateTo({
          url: '../../agency_pay/agency_pay?type=1',
        })
      } else if (code == 200) {
        wx.navigateTo({
          url: '../../settled/settled',
        })
      } else if (code == 202) {
        wx.navigateTo({
          url: '../../checking/checking',
        })
      } else if (code == 201) {
        //审核未通过 
        wx.navigateTo({
          url: '../../fail_checked/fail_checked?type=1',
        })
      } else {
        wx.navigateTo({
          url: '../../agency_apply/agency_apply',
        })
      }
    }else{
      app.login()
    }
    
  },

  handleDefault: function () {
    console.log(888)
    $Message({
      content: '请先完善授课信息',
      type: 'warning'
    });
  },

  //栏目跳转
  //我的签到
  mysign:function(e){
    var userInfo = wx.getStorageSync('userInfo')
    if(userInfo){
      wx.navigateTo({
        url: '../sign/sign',
      })
    }else{
      app.login()
    }
  },
  //我的优惠券
  mycoupon:function(e){
    var userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      wx.navigateTo({
        url: '../mycoupon/mycoupon',
      })
    } else {
      app.login()
    }
  },
  //我的收藏
  myfavor:function(e){
    var userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      wx.navigateTo({
        url: '../favor/favor',
      })
    } else {
      app.login()
    }
  },
  //我的积分
  myjifen:function(e){
    var userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      wx.navigateTo({
        url: '../jifen/jifen',
      })
    } else {
      app.login()
    }
  },
  //我的预约
  myyuyue:function(){
    var userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      wx.navigateTo({
        url: '../yuyue/yuyue',
      })
    } else {
      app.login()
    }
  },
  //我的订阅
    mydingyue:function(e){
      var userInfo = wx.getStorageSync('userInfo')
      if (userInfo) {
        wx.navigateTo({
          url: '../my_dingyue/my_dingyue',
        })
      } else {
        app.login()
      }
    },
  //授课信息
  personal:function(e){
    var userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      wx.navigateTo({
        url: '../personal/personal',
      })
    } else {
      app.login()
    }
  },
  //我的课程
  mycourse:function(e){
    var userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      wx.navigateTo({
        url: '../../../package1/mycourse/mycourse',
      })
    } else {
      app.login()
    }
  },
  //优惠券发布
  setCoupon:function(e){
    var userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      wx.navigateTo({
        url: '../../../package1/setCoupon/setCoupon',
      })
    } else {
      app.login()
    }
  },
  //签到管理
  signSet:function(e){
    var userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      wx.navigateTo({
        url: '../../../package1/signSet/signSet',
      })
    } else {
      app.login()
    }
  },
  //预约管理
  yuyueSet:function(e){
    var userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      wx.navigateTo({
        url: '../set_yuyue/set_yuyue',
      })
    } else {
      app.login()
    }
  },
//教练秀管理
myshow:function(e){
  var userInfo = wx.getStorageSync('userInfo')
  if (userInfo) {
    wx.navigateTo({
      url: '../../../package1/myshow/myshow',
    })
  } else {
    app.login()
  }
},
//邀请码
invite:function(e){
  var userInfo = wx.getStorageSync('userInfo')
  if (userInfo) {
    if(this.data.identity==0&&this.data.vvip==0){
      //请联系管理员
      $Toast({
        content: '请联系管理员',
        duration:2
      });
    }else{ 
      wx.navigateTo({
        url: '../../myset/spread/spread',
      })
    }
  } else {
    app.login()
  }
},
//绑定手机号
bindPhone:function(){
  var userInfo = wx.getStorageSync('userInfo')
  if(userInfo){
    //绑定手机号页面
    wx.navigateTo({
      url: '../bind_phone/bind_phone',
    })
  }else{
    app.login()
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

  }
})