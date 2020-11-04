// pages/myset/agencySet/agencySet.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
var app = getApp();
var cityData = require('../../utils/city.js'); //引入自己定位的市区数据信息
var btn_arr = new Array();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,//默认加载首页消息
    noMoreData: false,//默认更多消息
    diqu: '地区',
    fenlei: '分类',
    text: '',//搜索内容
    fenlei_item: [],//课程分类选项
    fenlei_index: -1,//分类内容下拉框，默认不选

    quyu_open: false,//区域定位菜单打开状态（初始关闭）
    fenlei_open: false,//分类菜单打开状态（初始关闭）

    isfull: false,//遮罩层是否展开
    quyu_show: true,//第一次加载页面 隐藏动画展示
    fenlei_show: true,//第一次加载页面 隐藏展示动画
    //省市区数据定义
    cityleft: cityData.getCity(), //获取省区域的下拉框筛选项内容
    citycenter: {}, //选择市区域筛选框后的显示的中间内容部分
    cityright: {}, //选择区县区域的中间内容部分后显示的右边内容
    select1: '', //具体选择的省
    select2: '', //具体选择的市
    select3: '', //具体选择的区县
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    fixedNav: false,//筛选导航条 初始不固定
    xiding: false,//筛选内容定位不固定
    touchmove: false,//弹层出现阻止滚动穿透  同时控制遮罩显示与否
    city: '定位中',
    current: 'tab0',
    current_scroll: 'tab0',
    //课程列表 接口请求
    teacher: [],
    isdown: -1,
    idx: -1,
    tabCheck: false,//初始未点击审核
    select_province: '',//选择的省
    province: '',//省
    city: '定位中',//市
    true_city: '',//真实的城市(未截取)
    latitude: '',//经度
    longitude: '',//纬度
    select_city: false,//选择的城市
    apply: [],//申请信息
    apply_num: '',//申请的数量
    refuse: '拒绝',
    pass: '同意',
    field_type_arr:[],
    agency:[]//机构信息
  },
  //输入事件
  input: function (e) {
    this.setData({
      text: e.detail.value
    })
    console.log(e.detail.value)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
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
    var that = this;
    var address = wx.getStorageSync('')
    var new_city = wx.getStorageSync('new_city');
    var page=that.data.page; 
    this.setData({
      field_type_arr: wx.getStorageSync('apply_type')
    })
    var select_city = app.globalData.select_city;
    if (!select_city) {
      // this.getUserLocation();不用重新请求定位
      this.setData({
        city: wx.getStorageSync('address').city,
        fenlei_item: app.globalData.cour_type,
      })
    } else {
      this.setData({
        city: that.substr(select_city),
        fenlei_item: app.globalData.cour_type,
      })
    }
    var select_city = app.globalData.select_city;
    var store_city = wx.getStorageSync('address').city;
    //获得城市
    var city = select_city ? select_city : store_city;
    console.log('当前城市' + city)
    console.log('发起请求的城市' + city)
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
          cityright: a,
          // select3: ''
        })
      }
    })
    //发起网络请求 根据条件筛选 渲染课程信息
    //根据省市筛选（忽略区）
    if (!app.globalData.select_city) {
      //定位本人的位置进行筛选
      var province = wx.getStorageSync('address').province;//当前的省
      var city = wx.getStorageSync('address').city;//当前的省市
      // var district=wx.getStorageSync('address').district;//当前的区域
      // var district = '';
      //新引入变量
      var district = that.data.select3;//选择的区
      var type = that.data.fenlei_index == -1 ? '' : that.data.fenlei_index;//课程类别
      var text = that.data.text;
      var latitude = wx.getStorageSync('address').location.lat;//本人实际位置的经纬度
      var longitude = wx.getStorageSync('address').location.lng;
      console.log('请求的城市' + province + city + district)
      that.address(province, city, district, latitude, longitude, type, text,page)
    } else {
      //根据选择的位置进行筛选
      var city = app.globalData.select_city;
      //根据请求的城市定位所在省
      qqmapsdk.geocoder({
        address: city,
        success: function (res) {
          console.log(res.result)
          select_province = res.result.address_components.province
          // var select_district = res.result.address_components.district
          // var select_district = ''
          // var latitude=res.result.location.lat
          // var longitude=res.result.location.lng
          //新引入变量
          var select_district = that.data.select3;//选择的区
          var type = that.data.fenlei_index == -1 ? '' : that.data.fenlei_index;//课程类别
          type = new_city ? '' : type;//课程类型
          if (new_city) {
            that.setData({
              select3: '全部',
              diqu: '地区',
              fenlei: '分类',
            })
          }
          var text = that.data.text;
          var latitude = wx.getStorageSync('address').location.lat;//本人实际位置的经纬度
          var longitude = wx.getStorageSync('address').location.lng;

          console.log('请求的城市' + select_province + city + select_district)
          that.address(select_province, city, select_district, latitude, longitude, type, text,page)
        }
      })
    }

    //加载申请信息
    wx.request({
      url: app.globalData.url + 'index/Agency/applyAgencyInfo',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          apply: res.data,
          apply_num: res.data.length
        })
      }

    })

  },
  //切换城市
  qiehuan: function () {
    wx.navigateTo({
      url: '../../select_city/select_city',
    })
  },
  gohome: function (e) {
    console.log(e)
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //区域筛选课程函数
  address: function (province, city, district, latitude, longitude, type, text,page) {
    var that = this;
    var address = province + city + district
    wx.request({
      url: app.globalData.url + 'index/Agency/adminAgency',
      data: {
        address: address,
        latitude: latitude,
        longitude: longitude,
        //新增变量 页面记录筛选项
        district: district,
        type: type,
        text: text,
        page:page
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
         //分页功能增加
         var agency = that.data.agency ? that.data.agency : [];
         var lastPageLength = res.data.length;//当前页消息的长度
         if(page==1){
          that.setData({
            agency: res.data,
          })
         }else{
           if(!that.data.noMoreData){
            that.setData({
              agency: agency.concat(res.data),
            })
           }else{
            return;
           }
         }
         if (lastPageLength < 30) {
          that.setData({
            noMoreData: true
          })
        }
        console.log(res.data)
      }
    })

  },

  //获取用户位置
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
  //获取当前经纬度
  getLocation: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy;
        that.getLocal(latitude, longitude)
      },
      fail: function (res) {
        console.log('fail' + JSON.stringify(res))
      }
    })
  },

  //获取当前位置
  getLocal: function (latitude, longitude) {
    var that = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        wx.setStorageSync('address', res.result.ad_info)
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        var select_province;
        //将地区筛选 市 赋值
        qqmapsdk.geocoder({
          address: city,
          success: function (res) {
            select_province = res.result.address_components.province
            that.setData({
              select_province: select_province,
              select2: city,
              cityright: that.data.cityleft[select_province][city],
              select3: ''
            })
          }
        })
        that.setData({
          province: province,
          city: that.substr(city),
          true_city: city,
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
  select_city: function () {
    wx.navigateTo({
      url: '/pages/select_city/select_city',
    })
  },
  //地区选择事件
  diqu: function (e) {
    console.log(e)
    if (this.data.quyu_open) {
      this.setData({
        touchmove: false,
        quyu_open: false,
        fenlei_open: false,
        shaixuan_open: false,
        paixu_open: false,
        quyu_show: false,
        fenlei_show: true,
        shaixuan_show: true,
        paixu_show: true,
        isfull: false
      })
    } else {
      this.setData({
        touchmove: true,
        quyu_open: true,
        fenlei_open: false,
        shaixuan_open: false,
        paixu_open: false,
        quyu_show: false,
        fenlei_show: true,
        shaixuan_show: true,
        paixu_show: true,
        isfull: true
      })
    }
  },
  //分类点击事件
  fenlei: function () {
    if (this.data.fenlei_open) {
      this.setData({
        touchmove: false,
        fenlei_open: false,
        quyu_open: false,
        shaixuan_open: false,
        paixu_open: false,
        fenlei_show: false,
        quyu_show: true,
        shaixuan_show: true,
        paixu_show: true,
        isfull: false
      })
    } else {
      this.setData({
        touchmove: true,
        fenlei_open: true,
        quyu_open: false,
        shaixuan_open: false,
        paixu_open: false,
        fenlei_show: false,
        quyu_show: true,
        shaixuan_show: true,
        paixu_show: true,
        isfull: true
      })
    }
  },
  //待审核点击事件
  check: function () {
    this.setData({
      touchmove: false,
      fenlei_open: false,
      quyu_open: false,
      fenlei_show: true,
      quyu_show: true,
      isfull: false
    })
  },
  //导航菜单吸顶事件
  handleChange({ detail }) {
    console.log(detail.key)
    this.setData({
      current: detail.key,
      tabCheck: detail.key == 'tab2' ? true : false
    })
  },

  //遮罩点击隐藏事件
  hidebg: function () {
    this.setData({
      touchmove: false,
      isfull: false,
      quyu_open: false,
      fenlei_open: false
    })
  },
  //具体区域点击事件
  selectright: function (e) {
    var that = this;
    console.log('选中的城市为' + e.currentTarget.dataset.city);
    var type = that.data.fenlei_index == -1 ? '' : that.data.fenlei_index;//课程类别
    var text = that.data.text;
    // var paixu = that.data.paixu_index;//排序选项
    this.setData({
      select3: e.currentTarget.dataset.city=='全部'?'':e.currentTarget.dataset.city,
      quyu_open: false,
      fenlei_open: false,
      fenlei_show: true,
      isfull: false,
      paixu_show: true,
      touchmove: false,
      page:1,
      noMoreData: false,//默认更多消息
    });
    console.log(this.data.select3)
    if (!app.globalData.select_city) {
      //定位本人的位置进行筛选
      var province = wx.getStorageSync('address').province;//当前的省
      var city = wx.getStorageSync('address').city;//当前的省市
      var district = e.currentTarget.dataset.city;//当前的区
      var latitude = wx.getStorageSync('address').location.lat;//本人实际位置的经纬度
      var longitude = wx.getStorageSync('address').location.lng;
      //调用排序函数
      var address = province + city + district
      // console.log('请求的参数' + address+latitude+longitude+type+sex+hour+tag+paixu)
      //请求接口渲染课程列表
      wx.request({
        url: app.globalData.url + 'index/Agencyadmin/shaiXuan',
        data: {
          address: address,
          latitude: latitude,
          longitude: longitude,
          type: type,
          page:1
          // paixu: paixu
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data)
          that.setData({
            agency: res.data,
            noMoreData:res.data.length<30?true:false,
            diqu: that.substr(district, 3),
          })
        }
      })
    } else {
      //根据选择的位置进行筛选
      var city = app.globalData.select_city;
      var select_province = '';
      qqmapsdk.geocoder({
        address: city,
        success: function (res) {
          console.log(res.result)
          select_province = res.result.address_components.province
          var select_district = e.currentTarget.dataset.city;//当前的区
          console.log(select_district)
          console.log(that.data.select3)
          // var latitude=res.result.location.lat
          // var longitude=res.result.location.lng
          var latitude = wx.getStorageSync('address').location.lat;//本人实际位置的经纬度
          var longitude = wx.getStorageSync('address').location.lng;
          console.log('请求的城市' + select_province + city + select_district)
          var address = select_province + city + select_district
          wx.request({
            url: app.globalData.url + 'index/Agencyadmin/shaiXuan',
            data: {
              address: address,
              latitude: latitude,
              longitude: longitude,
              type: type,
              page:1
              // paixu: paixu
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res.data)
              that.setData({
                agency: res.data,
                diqu: that.substr(select_district, 3),
              })
            }
          })
        }
      })
    }
    console.log(this.data.select3)

  },
  //分类菜单点击函数
  select_fenlei: function (e) {
    var that = this;
    var fenlei_item = that.data.fenlei_item
    console.log('你选择的是' + e.currentTarget.dataset.index)
    // var type = e.currentTarget.dataset.index + 1;//课程类别
    var index = e.currentTarget.dataset.index
    var type = e.currentTarget.dataset.type;//课程类别(新算法)
    var fenlei = fenlei_item[index].type;
    console.log(type)
    var text = that.data.text;
    this.setData({
      fenlei_index: e.currentTarget.dataset.type,//课程真实类目
      isfull: false,
      touchmove: false,
      fenlei_open: false,
      fenlei: that.substr(fenlei, 3),
      page:1,
      noMoreData: false,//默认更多消息 
    })
    if (!app.globalData.select_city) {
      //定位本人的位置进行筛选
      var province = wx.getStorageSync('address').province;//当前的省
      var city = wx.getStorageSync('address').city;//当前的省市
      var district = that.data.select3;//选择的区
      var latitude = wx.getStorageSync('address').location.lat;//本人实际位置的经纬度
      var longitude = wx.getStorageSync('address').location.lng;
      //调用排序函数
      var address = province + city + district
      // console.log('请求的参数' + address+latitude+longitude+type+sex+hour+tag+paixu)
      //请求接口渲染课程列表
      wx.request({
        url: app.globalData.url + 'index/Agencyadmin/shaiXuan',
        data: {
          address: address,
          latitude: latitude,
          longitude: longitude,
          type: type*1,
          text: text,
          page:1
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data)
          that.setData({
            agency: res.data,
            noMoreData:res.data.length<30?true:false
          })
        }
      })
    } else {
      //根据选择的位置进行筛选
      var city = app.globalData.select_city;
      var select_province = '';
      qqmapsdk.geocoder({
        address: city,
        success: function (res) {
          console.log(res.result)
          select_province = res.result.address_components.province
          var select_district = that.data.select3;//选择的区
          console.log(select_district)
          console.log(that.data.select3)
          // var latitude=res.result.location.lat
          // var longitude=res.result.location.lng
          var latitude = wx.getStorageSync('address').location.lat;//本人实际位置的经纬度
          var longitude = wx.getStorageSync('address').location.lng;
          console.log('请求的城市' + select_province + city + select_district)
          var address = select_province + city + select_district
          wx.request({
            url: app.globalData.url + 'index/Agencyadmin/shaiXuan',
            data: {
              address: address,
              latitude: latitude,
              longitude: longitude,
              type: type * 1,
              text: text,
              page:1
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res.data)
              that.setData({
                agency: res.data,
                noMoreData:res.data.length<30?true:false
              })
            }
          })
        }
      })
    }
  },
  handleChangeScroll({ detail }) {
    this.setData({
      current_scroll: detail.key
    });
  },

  //机构详情查看
  agency_des:function(e){
    var id=e.currentTarget.dataset.id;
    var is_pass=e.currentTarget.dataset.ispass;
    wx.navigateTo({
      url: '../../pages/agency/agency?admin=1&id='+id+'&is_pass='+is_pass,
    })
  },
  //机构审核通过
  pass:function(e){
    var that=this;
    var idx=e.currentTarget.dataset.idx;
    var apply=that.data.apply;
    var openid = apply[idx].openid;//申请人身份
    var name = apply[idx].agency_name;
    var id = apply[idx].Id; 
    wx.request({
      url: app.globalData.url +'index/Agency/agencyApplyPass',
      data:{
        openid: openid,
        id: id,
        name:name
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data)
        wx.showToast({
          title: res.data.msg,
          icon:res.data.icon,
          duration:1000
        })
        apply.splice(idx,1)
        that.setData({
          apply:apply
        })
      }
    })
  },
 //审核未通过
 refuse:function(e){
  var that = this;
  var idx = e.currentTarget.dataset.idx;
  var apply = that.data.apply;
  var openid = apply[idx].openid;//申请人身份
  var name = apply[idx].agency_name;
  var id = apply[idx].Id; 
  wx.request({
    url: app.globalData.url + 'index/Agency/agencyApplyRefuse',
    data: {
      openid:openid,
      id: id,
      name:name
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {
      wx.showToast({
        title: res.data.msg,
        icon: res.data.icon,
        duration: 1000
      })
      apply.splice(idx, 1)
      that.setData({
        apply: apply
      })
    }
  })
 },

 //机构推荐
  recom:function(e){
    var that=this;
    var agency=that.data.agency;
    var agency_id=e.currentTarget.dataset.id;//机构id
    var state=e.currentTarget.dataset.state;//当前状态
    var index=e.currentTarget.dataset.idx;//索引
    state=-1*state+1;
    agency[index].is_recom=state;
    wx.request({
      url: app.globalData.url +'index/Agency/agencyRecomend',
      data:{
        agency_id:agency_id,
        state:state
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data)
        that.setData({
          agency:agency
        })
       wx.showToast({
         title: res.data.msg,
         icon:res.data.icon,
         duration:1000
       })
      }
    })
  },

  cut:function(e){
    var that = this;
    var agency = that.data.agency;
    var agency_id = e.currentTarget.dataset.id;//机构id
    var state = e.currentTarget.dataset.state;//当前状态
    var index = e.currentTarget.dataset.idx;//索引
    state = -1 * state + 1;
    agency[index].is_cut = state;
    wx.request({
      url: app.globalData.url + 'index/Agency/agencyCut',
      data: {
        agency_id: agency_id,
        state: state
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          agency: agency
        })
        wx.showToast({
          title: res.data.msg,
          icon: res.data.icon,
          duration: 1000
        })
      }
    })
  },
  //机构搜索函数
  search: function () {
    var that = this;
    wx.showLoading({
      title: '搜索中…',
    })
    var text = that.data.text;
    var type = that.data.fenlei_index == -1 ? '' : that.data.fenlei_index;//课程类别
    if (!app.globalData.select_city) {
      var province = wx.getStorageSync('address').province;//当前的省
      var city = wx.getStorageSync('address').city;//当前的省市
      var latitude = wx.getStorageSync('address').location.lat;//本人实际位置的经纬度
      var district = that.data.select3
      var longitude = wx.getStorageSync('address').location.lng;
      var address = province + city + district;
      wx.request({
        url: app.globalData.url + 'index/Agencyadmin/search',
        data: {
          address: address,
          latitude: latitude,
          longitude: longitude,
          text: text,
          type: type
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          wx.hideLoading()
          console.log(res.data)
          that.setData({
            agency: res.data,
            top_agency: null
          })
        }
      })
    } else {
      //根据选择的位置进行筛选
      var city = app.globalData.select_city;
      var select_province = '';
      //根据请求的城市定位所在省
      qqmapsdk.geocoder({
        address: city,
        success: function (res) {
          console.log(res.result)
          select_province = res.result.address_components.province
          var select_district = that.data.select3;//当前的区
          console.log(select_district)
          console.log(that.data.select3)
          // var latitude=res.result.location.lat
          // var longitude=res.result.location.lng
          var latitude = wx.getStorageSync('address').location.lat;//本人实际位置的经纬度
          var longitude = wx.getStorageSync('address').location.lng;
          console.log('请求的城市' + select_province + city + select_district)
          var address = select_province + city + select_district
          wx.request({
            url: app.globalData.url + 'index/Agencyadmin/search',
            data: {
              address: address,
              latitude: latitude,
              longitude: longitude,
              text: text,
              type: type,
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              wx.hideLoading()
              console.log(res.data)
              that.setData({
                agency: res.data,
                top_agency: null
              })
            }
          })
        }
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
    console.log('触底啦')
    var that = this; 
    var page = this.data.page;
    var noMoreData = this.data.noMoreData;
    var new_city = wx.getStorageSync('new_city');
    if(!noMoreData){
      //继续加载
      page++;
      if (!app.globalData.select_city) {
        //定位本人的位置进行筛选
        var province = wx.getStorageSync('address').province;//当前的省
        var city = wx.getStorageSync('address').city;//当前的省市
        // var district=wx.getStorageSync('address').district;//当前的区域
        // var district = '';
        //新引入变量
        var district = that.data.select3;//选择的区
        var type = that.data.fenlei_index == -1 ? '' : that.data.fenlei_index;//课程类别
        var text = that.data.text;
        var latitude = wx.getStorageSync('address').location.lat;//本人实际位置的经纬度
        var longitude = wx.getStorageSync('address').location.lng;
        console.log('请求的城市' + province + city + district)
        that.address(province, city, district, latitude, longitude, type, text,page)
      } else {
        //根据选择的位置进行筛选
        var city = app.globalData.select_city;
        var select_province = '';
        //根据请求的城市定位所在省
        qqmapsdk.geocoder({
          address: city,
          success: function (res) {
            console.log(res.result)
            select_province = res.result.address_components.province
            // var select_district = res.result.address_components.district
            // var select_district = ''
            // var latitude=res.result.location.lat
            // var longitude=res.result.location.lng
            //新引入变量
            var select_district = that.data.select3;//选择的区
            var type = that.data.fenlei_index == -1 ? '' : that.data.fenlei_index;//课程类别
            type = new_city ? '' : type;//课程类型
            if (new_city) {
              that.setData({
                select3: '全部',
                diqu: '地区',
                fenlei: '分类',
              })
            }
            var text = that.data.text;
            var latitude = wx.getStorageSync('address').location.lat;//本人实际位置的经纬度
            var longitude = wx.getStorageSync('address').location.lng;
  
            console.log('请求的城市' + select_province + city + select_district)
            that.address(select_province, city, select_district, latitude, longitude, type, text,page)
          }
        })
      }
      that.setData({
        page: page
      })
    }else{
      console.log('加载完全')
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})