// pages/cour_detail/cour_detail.js
var common = require('../../utils/common.js');
var app=getApp();
var date_arr=[];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX:false,
    //推荐课程
    recom_course: [],
    cour_info:{},//课程信息
    yuyue_info:[],//预约数据
    judge:[],//评价信息
    collect_state:0,//收藏状态 初始为0
    cour_id:'',//课程id
    cour_type:'',//课程类型 
    cour_openid:'',//教师的openid
    student_openid:'',//普通用户的身份
    cour_tw:'',
    tea_id:'',
    judge_img:[
    ],
    tickets:[],//优惠券信息
    get_state:0,//优惠券领取状态(初始未领取))
    btn_txt:'领券',
    left_num:'',//剩余数量
    get_num:'',//已领取数量
    phone:'',//手机号码
    home_state: false,//群聊进入打开的场景
    com_id: '',//主评论id
    isjudge: false,
    focus: false,
    keyboard_height: 0,
    reply: '',
    news_id: '',
    lat: '',//用户经纬度
    lng: '',
    showDialog:false,
    time_idx:-1,//选择的时刻序号,
    day_idx:0,//默认选择首个日期
    begin_time:'',
    end_time:'',
    //日期月份数据
    date:[
    ],
    //日期时刻数组
    time:[
    ],
    code:'',
    //已选预约时间段 数据结构
    select_arr:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  //拨打电话
  call:function(){
    if(app.globalData.freeze==1){
      wx.showToast({
        title: '你已被冻结',
        icon: 'loading',
        duration: 2000
      })
    }else{
      var phone = this.data.cour_info.courContact;
      wx.makePhoneCall({
        phoneNumber: phone,
        success: function (res) {
          console.log('拨打成功')
        },
      })
    }
   
  },
  home: function (e) {
    console.log(e)
    wx.switchTab({
      url: '../index/index',
    })
  },
  //收藏课程事件
  collect:function(e){
    var that=this;
    var openid=wx.getStorageSync('openid');
    var cour_id = that.data.cour_id;
    var state = that.data.collect_state
    var userInfo = wx.getStorageSync('userInfo');//用户信息
    //首先判断用户是否授权
    if(userInfo){
      if (app.globalData.freeze == 1) {
        wx.showToast({
          title: '你已被冻结',
          icon: 'loading',
          duration: 2000
        })
      } else {
        that.setData({
          collect_state: -1 * state + 1//收藏状态
        })
        wx.request({
          url: app.globalData.url + 'index/Person/collectCourse',
          data: {
            collect_state: that.data.collect_state,
            openid: openid,
            cour_id: cour_id,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res.data)
            if (that.data.collect_state == 1) {
              wx.showToast({
                title: '收藏成功',
                icon: 'success',
                duration: 1000
              })
            } else {
              wx.showToast({
                title: '取消收藏',
                icon: 'success',
                duration: 1000
              })
            }
          }
        })
      }
    }else{
      //返回授权页面
      app.login()
    }
  },
  onLoad: function (options) {
    // console.log(options.cour_id)
    var isIphoneX = app.globalData.isIphoneX;
    this.setData({
      isIphoneX: isIphoneX,
      cour_id:options.cour_id,//课程id  接收的重要的参数
      // distance: options.distance,//课程距离 
      cour_type: options.cour_type,//课程类别
      news_id: options.news_id
    }) 
  },
//字符串去重
quchong:function(str){
  var newStr = "";
  for (var i = 0; i < 6; i++) {
    if (newStr.indexOf(str[i]) == -1) {
      newStr += str[i];
    }
  }
  return newStr+str.substring(6);
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
      //判断课程收藏与否
    var that=this;
    var pages = getCurrentPages();//当前页面栈
    console.log(pages)
    if (pages.length == 1) {
      //分享页面进入 绘制顶部栏加主页返回
      that.setData({
        home_state: true
      })
    }
      var openid=wx.getStorageSync('openid');
      var cour_id=that.data.cour_id;
      var cour_type = that.data.cour_type;
    wx.removeStorageSync('new_city');//清除切换城市选择的新的城市
    wx.removeStorageSync('yuyue_clock');//清除预约的缓存数据
    //推荐本市区的课程 不受位置选择而改变
    var province = wx.getStorageSync('address').province;//当前的省
    var city = wx.getStorageSync('address').city;//当前的省市
    var address = province + city;
    console.log(cour_id)
    //获取课程信息
    if(!wx.getStorageSync('address')){
      wx.getLocation({
        type: 'wgs84',
        success (res) {
          console.log(res)
          wx.request({
            url: app.globalData.url + 'index/Course/courseDes',
            data: {
              cour_id: cour_id,
              lat: res.latitude,
              lng: res.longitude
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res1) { 
              console.log(res1.data)
              // console.log(res.data[1])
              that.setData({ 
                yuyue_info:res1.data[1],
                cour_info:res1.data[0][0],
                cour_openid:res1.data[0][0].openid,
                tea_id: res1.data[0][0].teaId,
                cour_tw: res1.data[0][0].courDes,
                student_openid:wx.getStorageSync('openid')
              })
              //初始化时刻列表
              if(res1.data[0][0].is_yuyue==1){
                that.get_clock(0) 
              }
            }
          })
        }
       })
    }else{
      wx.request({
        url: app.globalData.url + 'index/Course/courseDes',
        data: {
          cour_id: cour_id,
          lat: wx.getStorageSync('address').location.lat,
          lng: wx.getStorageSync('address').location.lng
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) { 
          console.log(res.data)
          // console.log(res.data[1])
          that.setData({ 
            yuyue_info:res.data[1],
            cour_info:res.data[0][0],
            cour_openid:res.data[0][0].openid,
            tea_id: res.data[0][0].teaId,
            cour_tw: res.data[0][0].courDes,
            student_openid:wx.getStorageSync('openid')
          })
          //初始化时刻列表
          if(res.data[0][0].is_yuyue==1){
            that.get_clock(0) 
          }
        }
      })
    }
  
    //判断课程收藏与否
      wx.request({
        url: app.globalData.url + 'index/Person/collectState',
        data:{
          openid:openid,
          cour_id:cour_id
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data)
          if(res.data==200){
            that.setData({
              collect_state:1
            })
          }else{
            that.setData({
              collect_state: 0
          })
        }
      }
  })

//选取课程评价
    that.get_judge(cour_id)
    //获取其他课程推荐(同类型)
    wx.request({
      url: app.globalData.url + 'index/Recommend/recommend',
      data:{
        cour_id:cour_id,
        cour_type: cour_type,
        latitude:wx.getStorageSync('address').location.lat,
        longitude:wx.getStorageSync('address').location.lng,
        address: address
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data)
        that.setData({
          recom_course:res.data
        })
      }
    })
//获取该课程的优惠券信息
  wx.request({
    url: app.globalData.url +'index/tickets/getCourseTick',
    data:{
      cour_id:cour_id
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res){
      console.log(res.data)
      // console.log(res.data[0].num)
      that.setData({
        tickets:res.data,
        left_num:res.data[0].num-res.data[0].used,
        get_num:res.data[0].used 
      })
    }
  })
//判断优惠券领取状态
wx.request({
  url: app.globalData.url + 'index/tickets/getTickState',
  data:{
    openid:openid,
    cour_id:cour_id
  },
  header: {
    'content-type': 'application/json' // 默认值
  },
  success(res){
    that.setData({
      get_state:res.data,
      btn_txt:res.data==0?'领券':'已领取'
    })
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

    //清除消息通知
    common.setNewsRead('', that.data.news_id)
    //初始化 预约配置信息 获取后七天的日期数据
    date_arr=[];
    that.afterDate(7)
    that.setData({
      date:date_arr,
      showDialog:false
    })
    console.log(date_arr)
  }, 
  //获取后n天的日期数据
  afterDate(days){
    for (let i = 0; i < days; i++) {
      let Stamp = new Date();
      let number;
      if (Stamp.getDay() == 0) {
          number = 7;
      } else {
          number = Stamp.getDay();
      }
      let num = i;
      Stamp.setDate(Stamp.getDate() + num);
      let year = Stamp.getFullYear();
      let month = Stamp.getMonth() + 1;
      let date = Stamp.getDate();
      var obj={};
      if (month < 10) {
          month = `0${month}`;//这里使用的反引号
      }
      if (date < 10) {
          obj.time_str =`${year}-${month}-0${date}`;
          obj.day=`0${date}`;
      } else {
          obj.time_str =`${year}-${month}-${date}`;
          obj.day=`${date}`;
      }
      obj.week = `周${'日一二三四五六'.charAt(new Date(obj.time_str).getDay())}`
      obj.state=false
      date_arr.push(obj)
  }
  },  
  //选取课程评价
  get_judge(cour_id) {
    var that = this;
    wx.request({
      url: app.globalData.url + 'index/Course/judgeDes',
      data: {
        cour_id: cour_id,
        page: 1
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          judge_num: res.data[0],
          judge: res.data[1],
          judge_img: res.data[2]
        })
      }
    })
  },

//领取优惠券
  get_tick:function(e){
    var that=this;
    var state=that.data.get_state;
    var code=that.data.code;
    var openid=wx.getStorageSync('openid');//领取人的身份
    var cour_id=that.data.cour_id;
    var tick_id=e.currentTarget.dataset.tickid;//优惠券id
    var left_num=that.data.left_num;
    var get_num=that.data.get_num;
    var userInfo=wx.getStorageSync('userInfo');
    if(userInfo){
      if (app.globalData.freeze == 1) {
        wx.showToast({
          title: '你已被冻结',
          icon: 'loading',
          duration: 2000
        })
      } else {
        if (state == 1) {
          wx.showToast({
            title: '已领取',
            icon: 'loading',
            duration: 1000
          })
        } else {
          //获取手机号领取
          console.log(e)
          if (e.detail.errMsg == "getPhoneNumber:fail user deny") return;
          //用户允许授权
          // console.log("lv", e.detail.iv);
          // console.log(e.detail.encryptedData);
          wx.showLoading({
            title: '正在领取',
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
                          console.log(res1.data.phoneNumber)
                          if (res1.statusCode == 200 && res1.data.phoneNumber) {
                            that.setData({
                              phone: res1.data.phoneNumber
                            })
                            wx.request({
                              url: app.globalData.url + 'index/tickets/getTickets',
                              data: {
                                openid: openid,
                                tick_id: tick_id,
                                cour_id: cour_id,
                                phone: res1.data.phoneNumber
                              },
                              header: {
                                'content-type': 'application/json' // 默认值1
                              },
                              success(res) {
                                console.log(res.data)
                                that.setData({
                                  get_state: 1,
                                  btn_txt: '已领取',
                                  left_num: left_num - 1,
                                  get_num: get_num + 1
                                })
                                wx.showToast({
                                  title: '领取成功',
                                  icon: 'success',
                                  duration: 1000
                                })
                              }
                            })

                          }
                        },
                        fail: function (err) {
                          console.log(err);
                        }
                      })
                    }
                  }
                })
        }
      }
    }else{
      app.login()
    }
  },

//评价事件
  pingjia:function(e){
    var cour_id = e.currentTarget.dataset.courid;//评价课程id
    var userInfo = wx.getStorageSync('userInfo');//用户信息
    //首先检测用户是否授权
    if(userInfo){
      if (app.globalData.freeze == 1) {
        wx.showToast({
          title: '你已被冻结',
          icon: 'loading',
          duration: 2000
        })
      } else {
        wx.navigateTo({
          url: '../judge/judge?cour_id=' + cour_id,
        })
      } 
    }else{
      //返回授权
      app.login()
    }
   
  },

  // 回复评论
  reply: function (e) {
    var userInfo = wx.getStorageSync('userInfo');//用户信息
    if (!userInfo) {
      //返回授权
      app.login()
    } else {
      console.log('回复评论')
      this.setData({
        isjudge: true,
        focus: true,
        userInfo: userInfo,
        com_id: e.currentTarget.dataset.comid
      })
    }
  },
  focus: function (e) {
    console.log(e)
    var height = e.detail.height;
    this.setData({
      keyboard_height: height
    })
  },
  cancel: function (e) {
    console.log(e)
    this.setData({
      focus: false,
      isjudge: false,
      keyboard_height: 0
    })
  },
  replyTxt: function (e) {
    console.log(e.detail.value)
    this.setData({
      reply: e.detail.value
    })
  },
  //提交回复评论
  send: function () {
    var that = this;
    var reply = that.data.reply.trim();//回复内容
    var comId = that.data.com_id;//主评论id
    var openid = wx.getStorageSync('openid')
    var courId = that.data.cour_id;//课程id
    wx.request({
      url: app.globalData.url + 'index/Person/reply',
      method: 'POST',
      data: {
        openid: openid,
        courId: courId,
        content: reply,
        com_id: comId,
        type: 1
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        if (res.data.code == 200) {
          common.news(2, courId, '', 1)
          wx.showToast({
            title: res.data.msg,
            icon: res.data.icon,
            duration: 1000
          })
          that.get_judge(courId)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: res.data.icon,
            duration: 1000
          })
        }
      }
    })
  },

  //图片预览
  previewImage:function(e){
    var current = e.target.dataset.src;
    var index = e.target.dataset.index;
    console.log(this.data.judge_img[index])
    var arr=new Array();
    arr[0] = 'https://icloudapi.cn/efire/public/uploads/judge/' +this.data.judge_img[index].pic1
    arr[1] = 'https://icloudapi.cn/efire/public/uploads/judge/' +this.data.judge_img[index].pic2
    arr[2] = 'https://icloudapi.cn/efire/public/uploads/judge/' +this.data.judge_img[index].pic3
    //删除图片数组中的空值
    for(var i=arr.length-1;i>=0;i--){
      if(arr[i].indexOf('null')!=-1){
        arr.splice(i,1)
      }
    }
    console.log(arr)
    this.setData({
      judge_img:arr
    })
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.judge_img
    })
  },
  //课程预约
  yuyue:function(){
    var yuyue_state=this.data.cour_info.is_yuyue;
    var userInfo = wx.getStorageSync('userInfo');//用户信息
    if(userInfo){
      if(yuyue_state){
        this.setData({
          showDialog:true
        })
      }else{
        wx.showToast({
          title: '该课程不可预约',
          icon:'loading'
        })
      }
    }else{
      app.login()
    }
  },
  yuyue1:function(){
    //将预约的数组放入缓存
    var yuyue_clock=this.data.select_arr;
    var address=this.data.cour_info.courAddressName;
    var location=this.data.cour_info.courAddressDes;
    var lat=this.data.cour_info.courLat;
    var long=this.data.cour_info.courLong;
    var duration=this.data.cour_info.courHour;
    var phone=this.data.cour_info.courContact;
    var price=this.data.cour_info.price;
    var cour_name=this.data.cour_info.courName;
    var cour_pic=this.data.cour_info.courImg;
    var tea_id=this.data.cour_info.teaId;
    var cour_id=this.data.cour_id;
    var is_coupon=this.data.yuyue_info.is_coupon;//是否可用优惠券
    var is_pay=this.data.yuyue_info.is_pay;//是否需要支付
    wx.setStorageSync('yuyue_clock', JSON.stringify(yuyue_clock))
    if(yuyue_clock.length){
      wx.navigateTo({
        url: '../yuyue_des/yuyue_des?cour_name='+cour_name+'&cour_pic='+cour_pic+'&price='+price+'&address='+address+'&lat='+lat+'&long='+long+'&tea_id='+tea_id+'&duration='+duration+'&phone='+phone+'&location='+location+'&cour_id='+cour_id+'&is_coupon='+is_coupon+'&is_pay='+is_pay,
      })
    }else{
      wx.showToast({
        title: '请选择预约日期',
        icon:'loading',
        duration:1000
      })
    }
    
  },
  disapear:function(){
    this.setData({
      showDialog:false
    })
  },
  doNotMove:function(){
    console.log('stop user scroll it!');
    return;
  },
  //预约时刻选择
  select_clock:function(e){
    var idx=e.currentTarget.dataset.idx;//日期数组序号
    var day_idx=this.data.day_idx;//选择的日期序号
    var date=this.data.date;//日期数组
    var time=this.data.time;//时刻数组
    var select_arr=this.data.select_arr;//预约的数据格式
    var yuyue_num=e.currentTarget.dataset.num;//预约的人数
    var is_my_yuyue=e.currentTarget.dataset.ismy;//我是否预约本时刻
    var is_overdue=e.currentTarget.dataset.isover;//该时刻是否过期
    var max_stu=this.data.yuyue_info.max_stu;//最大预约人数
    var forbid_app_time=this.data.yuyue_info.forbid_app_time;//课程开始前n分钟禁止预约
    var sys_hour=new Date().getHours();
    var sys_min=new Date().getMinutes();
    //首先判断是否过时
    if(is_overdue){
      wx.showToast({
        title: '该时刻已过时',
        icon:'none',
        duration:1000
      })
      return
    }
    //第二步判断是否禁止预约
    var a=time[idx].clock;//时间点
    var space=(parseInt(a.substring(0,2))-parseInt(sys_hour))*60+(parseInt(a.substring(3))-parseInt(sys_min))
    if(space<forbid_app_time&&day_idx==0){
      wx.showToast({
        title: '当前时刻禁止预约',
        icon:'none',
        duration:1000
      })
      return
    }
    //第三步判断是否已经预约该时刻
    if(is_my_yuyue){
      wx.showToast({
        title: '您已预约该时刻',
        icon:'none',
        duration:1000
      })
      return
    }
    //第四步判断是否约满
    if(yuyue_num>=max_stu&&max_stu!=-1){
      wx.showToast({
        title: '当前时刻已约满',
        icon:'none',
        duration:1000
      })
      return
    }
    time[idx].state=!time[idx].state;
    this.setData({
      time:time
    })
    //预约时间数据格式拼接
    var select_day=date[day_idx];//选择的具体日期
    var select_clock=time[idx];//选择的具体时刻
    console.log(select_clock)
    var child={
      week:select_day.week,//周几
      day:select_day.day,//几号
      date:select_day.time_str,//具体日期
      clock:select_clock.clock,//具体时刻
      state:0,//预约时间段的状态 为取消做准备
    }
    if(time[idx].state){
      console.log('预约了')
      select_arr.push(child)
      this.setData({
        select_arr:select_arr
      })
      console.log(select_arr)
    }else{
      console.log('取消了')
      select_arr.forEach((value,index,array)=>{
        if(value.clock==time[idx].clock){
          select_arr.splice(index,1)
          return
        }
      })
      this.setData({
        select_arr:select_arr
      })
      console.log(select_arr)
    }
  },
//获取时刻
  get_clock(idx){
    var that=this;
    // var yuyue_info=that.data.yuyue_info;//课程可选预约信息字段
    var openid=wx.getStorageSync('openid');
    // console.log(yuyue_info)
    var cour_id=that.data.cour_id;
    var date=that.data.date;//当前日期后七天的数据
    var duration=that.data.cour_info.courHour;//课程时长
    // var time_set=JSON.parse(yuyue_info.time_set)
    // var clock=[]//间隔时刻数组
    // var begin_time;
    // var end_time;
    // var j=0;
    that.setData({
      day_idx:idx,
      select_arr:[],//清空选择的预约数据
    })
    // var select_week=date[idx].week
    // console.log(date[idx])
    // console.log('你选择是'+select_week)
    //后台请求获取时刻数组
    wx.request({
      url: app.globalData.url+'index/YuYue/getClock',
      data: {
        openid: openid,
        week: date[idx].week,
        date:date[idx].time_str,
        cour_id:cour_id ,
        duration:duration 
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data)
        that.setData({
          time:res.data[0],
          begin_time:res.data[1],
          end_time:res.data[2]
        })
      } 
    })
    //查找当前选择日期的开课时间段
    // time_set.forEach((value,index,array) => {
    //   value.date.forEach((val,idx,arr)=>{
    //     if(val.day==select_week&&val.state){
    //       //查找预约日期的时间段
    //       begin_time=time_set[index].multiArray[0][time_set[index].multiIndex[0]]//开始时间
    //       end_time=time_set[index].multiArray[1][time_set[index].multiIndex[1]]//结束时间
    //       var start_hour=parseInt(begin_time.substring(0,2))//开始时间的小时数
    //       var start_min=parseInt(begin_time.substring(3,5))//m开始时间的分钟数
    //       var end_hour=parseInt(end_time.substring(0,2))//结束时间的小时数
    //       var cur_hour=start_hour;
    //       while(parseInt(cur_hour)<parseInt(end_hour)){
    //         var sub_time=start_min+j*duration;
    //         var sub_min=sub_time%60==0?'00':sub_time%60;//分钟
    //         // console.log(sub_time)
    //         var sub_hour=Math.floor(sub_time/60);//小时
    //         var cur_hour=start_hour+sub_hour;
    //         if(cur_hour.toString().length==1){
    //           cur_hour='0'+cur_hour
    //         }
    //         var cur_clock=cur_hour+':'+sub_min
    //         var arr={
    //           clock:cur_clock,
    //           state:false
    //         }
    //         clock.push(arr)
    //         j++;
    //       }
    //       // console.log(clock)
    //     }
    //   })
    // });
    // // console.log(clock)
    // //为了显示方便 将数组插入假元素
    // var disable=5-clock.length%5;
    // for(var i=0;i<disable;i++){
    //   var dis_arr={
    //     clock:'',
    //     state:false
    //   }
    //   clock.push(dis_arr)
    // }
  },

  //日期选择
  select_day:function(e){
    var idx=e.currentTarget.dataset.idx;
    this.get_clock(idx)
  },

  //位置函数
  getUserLocation: function () {
    var that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权获取当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (res) {
                    if (res.authSetting['scope.userLocation'] === true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      that.getLocation();
                    } else {
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
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          that.getLocation();
        } else {
          that.getLocation();
        }
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
    var cour_id = this.data.cour_id; //课程id  重要的参数
    var cour_type = this.data.cour_type;
    var distance = this.data.distance;
    if(app.globalData.freeze==1){
      wx.showToast({
        title: '你已被冻结',
        icon: 'loading',
        duration: 2000
      })
    }else{
      common.judge(1)
        .then(res => {
          console.log(res.data)
        })
      return {
        title: '向你推荐了小程序',
        path: '/pages/cour_detail/cour_detail?&cour_id=' + cour_id + '&cour_type=' + cour_type + '&distance=' + distance,
      }
    }
  }
})