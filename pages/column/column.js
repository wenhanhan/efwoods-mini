// pages/course/course.js
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
    shaixuan: '筛选',
    paixu: '排序',
    shaixuan_state:false,
    title:'',//页面标题
    cour_type:'',//课程的分类
    fenlei_item: [],//课程分类选项
    paixu_item: ['距离最近', '人气优先', '评分最高', '价格最高', '价格最低'],//排序选项
    cate_item: ['体育模块', '艺术模块', ''],//课程分类选项
    btn_index: [],//按钮坐标
    btn_arr: [],//按钮坐标
    shaixuan_arr: [],//筛选选项
    btn_string: [],//按钮坐标数组（已转字符串）  
    paixu_index: 0, //排序内容下拉框，默认第一个(很重要)
    fenlei_index: -1,//分类内容下拉框，默认不选中
    quyu_open: false,//区域定位菜单打开状态（初始关闭）
    paixu_open: false,//排序菜单打开状态（初始关闭）
    fenlei_open: false,//分类菜单打开状态（初始关闭）
    shaixuan_open: false,//筛选菜单打开状态(初始关闭)
    isfull: false,//遮罩层是否展开
    quyu_show: true,//第一次加载页面 隐藏动画展示
    paixu_show: true,//第一次加载页面 隐藏展示动画
    fenlei_show: true,//第一次加载页面 隐藏展示动画
    //省市区数据定义
    cityleft: cityData.getCity(), //获取省区域的下拉框筛选项内容
    citycenter: {}, //选择市区域筛选框后的显示的中间内容部分
    cityright: {}, //选择区县区域的中间内容部分后显示的右边内容
    select1: '', //具体选择的省
    select2: '', //具体选择的市
    select3: '', //具体选择的区县

    shaixuan_show: true,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    top_bar_height: '',//导航条高度
    swiper_height: '',//轮播图高度
    menu_nav_top: '',//筛选导航上边距
    swiper_top: '',//轮播上边距
    fixedNav: false,//筛选导航条 初始不固定
    xiding: false,//筛选内容定位不固定
    touchmove: false,//弹层出现阻止滚动穿透  同时控制遮罩显示与否
    city: '定位中',
    imgUrls: [],
    current: 'tab0',
    current_scroll: 'tab0',

    // 筛选初始数据
    shaixuan_cate: [
      '性别', '时间', '条件'
    ],
    shaixuan_item: [
      ['男教师', '女教师'], ['10-30分钟', '20-40分钟', '45-60分钟', '60分钟以上'], ['一对一', '小班课程', '大师杯课程', '试听课程']
    ],
    shaixuan_arr: [],//筛选结果数组
    cate: [],//筛选排序选项数组
    start_time: '',//选择的课程开始时长
    end_time: '',//课程结束时长
    select_province: '',//选择的省
    province: '',//省
    city: '定位中',//市
    true_city: '',//真实的城市(未截取)
    latitude: '',//经度
    longitude: '',//纬度
    select_city: false,//选择的城市
    //小标签设置
    oneChecked: false,
    tags: [
      {
        name: '标签一',
        checked: false,
        color: 'default'
      },
      {
        name: '标签二',
        checked: false,
        color: 'red'
      },
      {
        name: '标签三',
        checked: true,
        color: 'blue'
      },
      {
        name: '标签4️',
        checked: true,
        color: 'green'
      }
    ]

  },

  /**
   * 监听页面滚动事件
   */
  onPageScroll: function (e) {
    //监听页面滑动
    if (e.scrollTop > this.data.swiper_height) {
      //将导航条位置固定
      this.setData({
        fixedNav: true,
        xiding: true,
        menu_fixed_top: this.data.top_bar_height
      })
    } else {
      this.setData({
        fixedNav: false,
        xiding: false,
        menu_fixed_top: ''
      })
    }
    // console.log(e.scrollTop)
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var cour_type = options.cour_type;
    var title;
    //根据类目id判断类目
    wx.request({
      url: app.globalData.url + 'index/column/getCourName',
      data: {
        cour_type: cour_type
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        wx.setNavigationBarTitle({
          title: res.data,
        })
      }
    })
    that.setData({
      cour_type: cour_type
    })
    qqmapsdk = new QQMapWX({
      key: 'K3PBZ-PSUCD-T3A4R-P5JPH-6MCR2-KYF6K' //key秘钥

    });

    //判断顶部导航条的高度（轮播图距离顶部的高度）
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
          swiper_height: top - this.data.top_bar_height
        })
        console.log('轮播图高度' + this.data.swiper_height)
      }
    ).exec();

    wx.removeStorageSync('btn_arr');//清空按钮数组
    wx.setStorageSync('btn_arr', [[-1, -1]])
    wx.setStorageSync('test', 123)
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
    var select_city = app.globalData.select_city;
    var new_city = wx.getStorageSync('new_city');
    var page=that.data.page;
    var cour_type = that.data.cour_type;//传入的课程的类别
    if (!select_city) {
      // this.getUserLocation();不用重新请求定位
      this.setData({
        city: wx.getStorageSync('address').city,
        fenlei_item: app.globalData.cour_type,
      })
    } else {
      this.setData({
        city: that.substr(select_city, 4),
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
      // var type = that.data.fenlei_index == -1 ? '' : that.data.fenlei_index;//课程类别
      var sex = '', hour = '', tag = '';
      var start_time = that.data.start_time;
      var end_time = that.data.end_time;
      var cate = that.data.cate;//选好的排序分类
      var shaixuan_arr = that.data.shaixuan_arr;//选好的选项
      for (var i = 0; i < cate.length; i++) {
        if (cate[i] == 'sex') {
          sex = shaixuan_arr[i] == '男教师' ? 1 : 0
        } else if (cate[i] == 'hour') {
          hour = shaixuan_arr[i]
        } else {
          tag = shaixuan_arr[i]
        }
      }
      var paixu = that.data.paixu_index;//排序选项
      console.log('测试筛选项')
      console.log(that.data.start_time)
      console.log(that.data.end_time)
      console.log(sex)
      console.log(tag)
      console.log(paixu)

      var latitude = wx.getStorageSync('address').location.lat;//本人实际位置的经纬度
      var longitude = wx.getStorageSync('address').location.lng;
      console.log('请求的城市' + province + city + district)
      that.address(province, city, district, latitude, longitude, cour_type, sex, start_time, end_time, tag, paixu,page)
    } else {
      //根据选择的位置进行筛选
      var city = app.globalData.select_city;
      //根据请求的城市定位所在省
      qqmapsdk.geocoder({
        address: city,
        success: function (res) {
          console.log(res.result)
          select_province = res.result.address_components.province
          //新引入变量
          var select_district = that.data.select3;//选择的区
          var type = that.data.fenlei_index == -1 ? '' : that.data.fenlei_index;          type = new_city ? '' : type;//课程类型
          if (new_city) {
            that.setData({
              select3: '全部',
              diqu: '地区',
              shaixuan: '筛选',
              paixu: '排序',
            })
          }
          var sex = '', hour = '', tag = '';
          var start_time = that.data.start_time;
          var end_time = that.data.end_time;
          var cate = that.data.cate;//选好的排序分类
          var shaixuan_arr = that.data.shaixuan_arr;//选好的选项
          for (var i = 0; i < cate.length; i++) {
            if (cate[i] == 'sex') {
              sex = shaixuan_arr[i] == '男教师' ? 1 : 0;
              sex = new_city ? '' : sex;
            } else if (cate[i] == 'hour') {
              hour = shaixuan_arr[i];
              hour = new_city ? '' : hour;
            } else {
              tag = shaixuan_arr[i];
              tag = new_city ? '' : tag;
            }
          }
          var paixu = new_city ? '' : that.data.paixu_index;//排序选项
          console.log('测试筛选项')
          console.log(that.data.start_time)
          console.log(that.data.end_time)
          console.log(sex)
          console.log(tag)
          console.log(paixu)
          var latitude = wx.getStorageSync('address').location.lat;//本人实际位置的经纬度
          var longitude = wx.getStorageSync('address').location.lng;

          console.log('请求的城市' + select_province + city + select_district)
          that.address(select_province, city, select_district, latitude, longitude, cour_type, sex, start_time, end_time, tag, paixu,page)
        }
      })
    }
    //获取类目轮播图 
    wx.request({
      url: app.globalData.url + 'index/Lunbo/getColumnBanner',
      data: {
        cour_type: that.data.cour_type
      },
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

  },
  //区域筛选课程函数
  address: function (province, city, district, latitude, longitude, cour_type, sex, start_time, end_time, tag, paixu,page) {
    var that = this;
    var address = province + city + district
    wx.request({
      url: app.globalData.url + 'index/column/getCourse',
      data: {
        address: address,
        latitude: latitude,
        longitude: longitude,
        cour_type:cour_type,
        //新增变量
        district: district,
        sex: sex,
        start_time: start_time,
        end_time: end_time,
        tag: tag,
        paixu: paixu,
        page:page
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //分页功能增加
        var course = that.data.course ? that.data.course : [];
        var lastPageLength = res.data.length;//当前页消息的长度
        if(page==1){
          that.setData({
            course: res.data
          })
        }else{
          if(!that.data.noMoreData){
            that.setData({
              course:course.concat(res.data)
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
  substr: function (val, len) {
    if (val.length == 0 || val == undefined) {
      return '';
    } else if (val.length > len) {
      return val.substring(0, len - 1) + "...";
    } else {
      return val;
    }
  },
  //选择城市跳转
  select_city: function () {
    wx.navigateTo({
      url: '../select_city/select_city',
    })
  },
  //搜索框跳转
  search: function (e) { 
    console.log(e)
    var type=e.currentTarget.dataset.type;//课程类别
    wx.navigateTo({
      url: '../search/search?cour_type='+type,
    })
  },

  //切换城市
  qiehuan: function () {
    wx.navigateTo({
      url: '../select_city/select_city',
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
  //分类按钮 点击改变样式
  select_cate: function (e) {
    //选中的坐标数组
    var btn_arr = wx.getStorageSync('btn_arr')
    var btn_row = e.currentTarget.dataset.cate;
    var btn_col = e.currentTarget.dataset.item;
    var btn_index = [btn_row, btn_col];
    //当前选中的按钮坐标
    var num = btn_arr.length;
    var btn_arr_x = new Array();
    var i = 0;
    console.log('num' + num)
    //将选中的不同行的按钮坐标放入数组
    for (var i = 0; btn_arr[i][0] != btn_row; i++) {
      if (i == num - 1) {
        btn_arr.push(btn_index)
        this.setData({
          btn_index: btn_index,
        })
      }
    }
    btn_arr[i] = btn_index;
    this.setData({
      btn_index: btn_index,
    })
    wx.setStorageSync('btn_arr', btn_arr)
    this.setData({
      btn_arr: btn_arr
    })
    console.log(btn_arr)
  },

  //分类按钮重置事件
  btn_reset: function () {
    wx.removeStorageSync('btn_arr');//清空按钮缓存
    wx.setStorageSync('btn_arr', [[-1, -1]]);//初始化按钮数组
    this.setData({
      btn_arr: ''//将按钮清空
    })
  },
  //分类按钮提交事件  分类筛选
  btn_sure: function () {
    var btn_arr = this.data.btn_arr;//已选数组
    console.log(this.data.btn_arr)
    var btn_arr_length = btn_arr.length - 1;//已选的类目数量(除去初始数组（-1，-1)）
    var shaixuan_item = this.data.shaixuan_item;//每个类目条件
    var shaixuan_arr = new Array();//将已选类目放入数组
    var cate = new Array();//选择的类目数组
    var start_time = '';//课程开始时长
    var end_time = '';//课程结束时长
    for (var i = 0; i < btn_arr_length; i++) {
      if (btn_arr[i + 1][0] == 0) {
        cate[i] = 'sex'
      } else if (btn_arr[i + 1][0] == 1) {
        cate[i] = 'hour'
        if (btn_arr[i + 1][1] == 0) {
          start_time = 10;
          end_time = 30;
        } else if (btn_arr[i + 1][1] == 1) {
          start_time = 20;
          end_time = 40;
        } else if (btn_arr[i + 1][1] == 2) {
          start_time = 45;
          end_time = 60
        } else {
          start_time = 60
        }
      } else {
        cate[i] = 'tag'
      }
      shaixuan_arr[i] = shaixuan_item[btn_arr[i + 1][0]][btn_arr[i + 1][1]];
    }
    console.log('你选择的是' + shaixuan_arr);
    console.log('顺序是' + cate)
    console.log(start_time)
    console.log(end_time)
    this.setData({
      shaixuan_arr: shaixuan_arr,
      cate: cate,
      start_time: start_time,
      end_time: end_time,
      touchmove: false,
      isfull: false,
      quyu_open: false,
      paixu_open: false,
      shaixuan_open: false,
      fenlei_open: false,
      shaixuan: shaixuan_arr.length == 0 ? '筛选' : '筛选' + '(' + shaixuan_arr.length + ')',
      page:1,
      noMoreData: false,//默认更多消息
    })
    var that = this;
    var type = that.data.cour_type;//课程类别(页面传递过来的)
    var sex = '', hour = '', tag = '';
    var start_time = that.data.start_time;
    var end_time = that.data.end_time;
    var cate = that.data.cate;//选好的排序分类
    var shaixuan_arr = that.data.shaixuan_arr;//选好的选项
    for (var i = 0; i < cate.length; i++) {
      if (cate[i] == 'sex') {
        sex = shaixuan_arr[i] == '男教师' ? 1 : 0
      } else if (cate[i] == 'hour') {
        hour = shaixuan_arr[i]
      } else {
        tag = shaixuan_arr[i]
      }
    }
    var paixu = that.data.paixu_index;//排序选项
    //......................开始筛选
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
        url: app.globalData.url + 'index/ShaiXuan/shaiXuan',
        data: {
          address: address,
          latitude: latitude,
          longitude: longitude,
          type: type,
          sex: sex,
          start_time: start_time,
          end_time: end_time,
          tag: tag,
          paixu: paixu,
          page:1
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data)
          that.setData({
            course: res.data,
            shaixuan_state:true,
            noMoreData:res.data.length<30?true:false
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
          // var latitude=res.result.location.lat
          // var longitude=res.result.location.lng
          var latitude = wx.getStorageSync('address').location.lat;//本人实际位置的经纬度
          var longitude = wx.getStorageSync('address').location.lng;
          console.log('请求的城市' + select_province + city + select_district)
          var address = select_province + city + select_district
          wx.request({
            url: app.globalData.url + 'index/ShaiXuan/shaiXuan',
            data: {
              address: address,
              latitude: latitude,
              longitude: longitude,
              type: type,
              sex: sex,
              start_time: start_time,
              end_time: end_time,
              tag: tag,
              paixu: paixu,
              page:1
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res.data)
              that.setData({
                course: res.data,
                noMoreData:res.data.length<30?true:false,
                shaixuan_state: true
              })
            }
          })
        }
      })
    }



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
  //筛选点击事件

  shaixuan: function () {
    if (this.data.shaixuan_open) {
      this.setData({
        touchmove: false,
        shaixuan_open: false,
        quyu_open: false,
        fenlei_open: false,
        paixu_open: false,
        shaixuan_show: false,
        quyu_show: true,
        fenlei_show: true,
        paixu_show: true,
        isfull: false,
      })
    } else {
      this.setData({
        touchmove: true,
        shaixuan_open: true,
        quyu_open: false,
        fenlei_open: false,
        paixu_open: false,
        shaixuan_show: false,
        quyu_show: true,
        fenlei_show: true,
        paixu_show: true,
        isfull: true
      })
    }
  },

  //排序点击事件
  paixu: function () {
    if (this.data.paixu_open) {
      this.setData({
        touchmove: false,
        paixu_open: false,
        quyu_open: false,
        fenlei_open: false,
        shaixuan_open: false,
        paixu_show: false,
        quyu_show: true,
        fenlei_show: true,
        shaixuan_show: true,
        isfull: false
      })
    } else {
      this.setData({
        touchmove: true,
        paixu_open: true,
        quyu_open: false,
        fenlei_open: false,
        shaixuan_open: false,
        paixu_show: false,
        quyu_show: true,
        fenlei_show: true,
        shaixuan_show: true,
        isfull: true
      })
    }
  },


  //导航菜单吸顶事件
  handleChange({ detail }) {
    let query = wx.createSelectorQuery();
    query.select('#swiper').boundingClientRect(
      (rect) => {
        let top = rect.top;//轮播图距离上边界的大小
        this.setData({
          swiper_top: top
        })
        console.log('轮播图距离页面顶部的高度' + top)
      }
    ).exec();

    //判断导航距离上边界的位置
    query.select('#menu-nav').boundingClientRect(
      (rect) => {
        let top = rect.top;//导航距离上边界的大小
        console.log('导航条距顶' + top)
        console.log(this.data.top_bar_height)
        if (top >= this.data.top_bar_height) {
          wx.pageScrollTo({
            scrollTop: top + (this.data.swiper_top * -1),
            duration: 0
          })
          console.log(top + (this.data.swiper_top * -1))
        }
      }
    ).exec();

    this.setData({
      current: detail.key,
    })
  },

  //遮罩点击隐藏事件
  hidebg: function () {
    this.setData({
      touchmove: false,
      isfull: false,
      quyu_open: false,
      paixu_open: false,
      shaixuan_open: false,
      fenlei_open: false
    })
  },


  //具体区域点击事件  区域筛选
  selectright: function (e) {
    var that = this;
    console.log('选中的城市为' + e.currentTarget.dataset.city);
    var type = that.data.cour_type;//课程类别(页面传递过来的)
    var sex = '', hour = '', tag = '';
    var start_time = that.data.start_time;
    var end_time = that.data.end_time;
    var cate = that.data.cate;//选好的排序分类
    var shaixuan_arr = that.data.shaixuan_arr;//选好的选项
    for (var i = 0; i < cate.length; i++) {
      if (cate[i] == 'sex') {
        sex = shaixuan_arr[i] == '男教师' ? 1 : 0
      } else if (cate[i] == 'hour') {
        hour = shaixuan_arr[i]
      } else {
        tag = shaixuan_arr[i]
      }
    }
    var paixu = that.data.paixu_index;//排序选项
    this.setData({
      select3: e.currentTarget.dataset.city=='全部'?'':e.currentTarget.dataset.city,
      quyu_open: false,
      fenlei_open: false,
      shaixuan_open: false,
      paixu_open: false,
      fenlei_show: true,
      shaixuan_show: true,
      paixu_show: true,
      isfull: false,
      touchmove: false,
      page:1,
      noMoreData: false,//默认更多消息
    });
    //开始筛选
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
        url: app.globalData.url + 'index/ShaiXuan/shaiXuan',
        data: {
          address: address,
          latitude: latitude,
          longitude: longitude,
          type: type,
          sex: sex,
          start_time: start_time,
          end_time: end_time,
          tag: tag,
          paixu: paixu,
          page:1
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data)
          that.setData({
            diqu: that.substr(district, 3),
            course: res.data,
            noMoreData:res.data.length<30?true:false,
            shaixuan_state: false
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
            url: app.globalData.url + 'index/ShaiXuan/shaiXuan',
            data: {
              address: address,
              latitude: latitude,
              longitude: longitude,
              type: type,
              sex: sex,
              start_time: start_time,
              end_time: end_time,
              tag: tag,
              paixu: paixu,
              page:1
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res.data)
              that.setData({
                course: res.data,
                diqu: that.substr(select_district, 3),
                noMoreData:res.data.length<30?true:false,
                shaixuan_state: false
              })
            }
          })
        }
      })
    }
    console.log(this.data.select3)
  },

  //分类菜单点击函数  分类筛选（不需要）
  // select_fenlei: function (e) {
  //   var that = this;
  //   console.log('你选择的分类下标是' + e.currentTarget.dataset.index)
  //   var type = e.currentTarget.dataset.index + 1;//课程类别
  //   var sex = '', hour = '', tag = '';
  //   var start_time = that.data.start_time;
  //   var end_time = that.data.end_time;
  //   var cate = that.data.cate;//
  //   var shaixuan_arr = that.data.shaixuan_arr;//选好的选项
  //   for (var i = 0; i < cate.length; i++) {
  //     if (cate[i] == 'sex') {
  //       sex = shaixuan_arr[i] == '男教师' ? 1 : 0
  //     } else if (cate[i] == 'hour') {
  //       hour = shaixuan_arr[i]
  //     } else {
  //       tag = shaixuan_arr[i]
  //     }
  //   }
  //   var paixu = that.data.paixu_index;//排序选项
  //   this.setData({
  //     fenlei_index: e.currentTarget.dataset.index,
  //     isfull: false,
  //     touchmove: false,
  //     fenlei_open: false
  //   })
  //   //开始筛选
  //   if (!app.globalData.select_city) {
  //     //定位本人的位置进行筛选
  //     var province = wx.getStorageSync('address').province;//当前的省
  //     var city = wx.getStorageSync('address').city;//当前的省市
  //     var district = that.data.select3;//选择的区
  //     var latitude = wx.getStorageSync('address').location.lat;//本人实际位置的经纬度
  //     var longitude = wx.getStorageSync('address').location.lng;
  //     //调用排序函数
  //     var address = province + city + district
  //     // console.log('请求的参数' + address+latitude+longitude+type+sex+hour+tag+paixu)
  //     //请求接口渲染课程列表
  //     wx.request({
  //       url: app.globalData.url + 'index/ShaiXuan/shaiXuan',
  //       data: {
  //         address: address,
  //         latitude: latitude,
  //         longitude: longitude,
  //         type: type,
  //         sex: sex,
  //         start_time: start_time,
  //         end_time: end_time,
  //         tag: tag,
  //         paixu: paixu
  //       },
  //       header: {
  //         'content-type': 'application/json' // 默认值
  //       },
  //       success(res) {
  //         console.log(res.data)
  //         that.setData({
  //           course: res.data
  //         })
  //       }
  //     })

  //   } else {
  //     //根据选择的位置进行筛选
  //     var city = app.globalData.select_city;
  //     var select_province = '';
  //     //根据请求的城市定位所在省
  //     qqmapsdk.geocoder({
  //       address: city,
  //       success: function (res) {
  //         console.log(res.result)
  //         select_province = res.result.address_components.province
  //         var select_district = that.data.select3;//当前的区
  //         // var latitude=res.result.location.lat
  //         // var longitude=res.result.location.lng
  //         var latitude = wx.getStorageSync('address').location.lat;//本人实际位置的经纬度
  //         var longitude = wx.getStorageSync('address').location.lng;
  //         console.log('请求的城市' + select_province + city + select_district)
  //         var address = select_province + city + select_district
  //         wx.request({
  //           url: app.globalData.url + 'index/ShaiXuan/shaiXuan',
  //           data: {
  //             address: address,
  //             latitude: latitude,
  //             longitude: longitude,
  //             type: type,
  //             sex: sex,
  //             start_time: start_time,
  //             end_time: end_time,
  //             tag: tag,
  //             paixu: paixu
  //           },
  //           header: {
  //             'content-type': 'application/json' // 默认值
  //           },
  //           success(res) {
  //             console.log(res.data)
  //             that.setData({
  //               course: res.data
  //             })
  //           }
  //         })
  //       }
  //     })
  //   }

  // },

  //排序菜单点击函数  排序筛选
  select_paixu: function (e) {
    var that = this;
    var type = that.data.cour_type;//课程类别(页面传递过来的)
    var sex = '', hour = '', tag = '';
    var start_time = that.data.start_time;
    var end_time = that.data.end_time;
    var cate = that.data.cate;//选好的排序分类
    var shaixuan_arr = that.data.shaixuan_arr;//选好的选项
    for (var i = 0; i < cate.length; i++) {
      if (cate[i] == 'sex') {
        sex = shaixuan_arr[i] == '男教师' ? 1 : 0
      } else if (cate[i] == 'hour') {
        hour = shaixuan_arr[i]
      } else {
        tag = shaixuan_arr[i]
      }
    }
    var paixu = e.currentTarget.dataset.index;//排序选项
    console.log('你选择的是' + e.currentTarget.dataset.index)
    this.setData({
      paixu_index: e.currentTarget.dataset.index,
      isfull: false,
      touchmove: false,
      paixu_open: false,
      paixu: that.substr(that.data.paixu_item[paixu], 3),
      page:1,
      noMoreData: false,//默认更多消息
    })
    //开始筛选
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
        url: app.globalData.url + 'index/ShaiXuan/shaiXuan',
        data: {
          address: address,
          latitude: latitude,
          longitude: longitude,
          type: type,
          sex: sex,
          start_time: start_time,
          end_time: end_time,
          tag: tag,
          paixu: paixu,
          page:1
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data)
          that.setData({
            course: res.data,
            noMoreData:res.data.length<30?true:false,
            shaixuan_state: true
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
            url: app.globalData.url + 'index/ShaiXuan/shaiXuan',
            data: {
              address: address,
              latitude: latitude,
              longitude: longitude,
              type: type,
              sex: sex,
              start_time: start_time,
              end_time: end_time,
              tag: tag,
              paixu: paixu,
              page:1
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res.data)
              that.setData({
                course: res.data,
                noMoreData:res.data.length<30?true:false,
                shaixuan_state: true
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

  //小标签设置
  oneChange(event) {
    this.setData({
      'oneChecked': event.detail.checked
    })
  },
  onChange(event) {
    const detail = event.detail;
    this.setData({
      ['tags[' + event.detail.name + '].checked']: detail.checked
    })

  },
  //点击查看详情

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('触底啦')
    var that = this; 
    var page = this.data.page;
    var noMoreData = this.data.noMoreData;
    var new_city = wx.getStorageSync('new_city');
    var cour_type = that.data.cour_type;//传入的课程的类别
    if(!noMoreData){
      page++;
      if (!app.globalData.select_city) {
        //定位本人的位置进行筛选
        var province = wx.getStorageSync('address').province;//当前的省
        var city = wx.getStorageSync('address').city;//当前的省市
        // var district=wx.getStorageSync('address').district;//当前的区域
        // var district = '';
        //新引入变量
        var district = that.data.select3;//选择的区
        // var type = that.data.fenlei_index == -1 ? '' : that.data.fenlei_index;//课程类别
        var sex = '', hour = '', tag = '';
        var start_time = that.data.start_time;
        var end_time = that.data.end_time;
        var cate = that.data.cate;//选好的排序分类
        var shaixuan_arr = that.data.shaixuan_arr;//选好的选项
        for (var i = 0; i < cate.length; i++) {
          if (cate[i] == 'sex') {
            sex = shaixuan_arr[i] == '男教师' ? 1 : 0
          } else if (cate[i] == 'hour') {
            hour = shaixuan_arr[i]
          } else {
            tag = shaixuan_arr[i]
          }
        }
        var paixu = that.data.paixu_index;//排序选项
        console.log('测试筛选项')
        console.log(that.data.start_time)
        console.log(that.data.end_time)
        console.log(sex)
        console.log(tag)
        console.log(paixu)
  
        var latitude = wx.getStorageSync('address').location.lat;//本人实际位置的经纬度
        var longitude = wx.getStorageSync('address').location.lng;
        console.log('请求的城市' + province + city + district)
        that.address(province, city, district, latitude, longitude, cour_type, sex, start_time, end_time, tag, paixu,page)
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
            //新引入变量
            var select_district = that.data.select3;//选择的区
            var type = that.data.fenlei_index == -1 ? '' : that.data.fenlei_index;          type = new_city ? '' : type;//课程类型
            if (new_city) {
              that.setData({
                select3: '全部',
                diqu: '地区',
                shaixuan: '筛选',
                paixu: '排序',
              })
            }
            var sex = '', hour = '', tag = '';
            var start_time = that.data.start_time;
            var end_time = that.data.end_time;
            var cate = that.data.cate;//选好的排序分类
            var shaixuan_arr = that.data.shaixuan_arr;//选好的选项
            for (var i = 0; i < cate.length; i++) {
              if (cate[i] == 'sex') {
                sex = shaixuan_arr[i] == '男教师' ? 1 : 0;
                sex = new_city ? '' : sex;
              } else if (cate[i] == 'hour') {
                hour = shaixuan_arr[i];
                hour = new_city ? '' : hour;
              } else {
                tag = shaixuan_arr[i];
                tag = new_city ? '' : tag;
              }
            }
            var paixu = new_city ? '' : that.data.paixu_index;//排序选项
            console.log('测试筛选项')
            console.log(that.data.start_time)
            console.log(that.data.end_time)
            console.log(sex)
            console.log(tag)
            console.log(paixu)
            var latitude = wx.getStorageSync('address').location.lat;//本人实际位置的经纬度
            var longitude = wx.getStorageSync('address').location.lng;
  
            console.log('请求的城市' + select_province + city + select_district)
            that.address(select_province, city, select_district, latitude, longitude, cour_type, sex, start_time, end_time, tag, paixu,page)
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