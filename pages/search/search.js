// pages/search/search.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:'',
    isnull:false,
    hot:true,//初始显示热门搜索
    //搜索结果 教师列表
    search_teacher: [],
    //搜索结果 课程列表
    search_course: [],
    cour_type:'',
  },

//输入事件
input:function(e){
  this.setData({
    text:e.detail.value
  })
},
//搜索事件
search:function(e){
  var that=this;
  wx.showLoading({
    title: '搜索中…',
  })
  that.setData({
    hot: false,
    isnull:true,
  })
  var text = that.data.text.trim();
  if(!that.data.cour_type){
  if (!app.globalData.select_city){
    var province = wx.getStorageSync('address').province;//当前的省
    var city = wx.getStorageSync('address').city;//当前的省市
    var latitude = wx.getStorageSync('address').location.lat;//本人实际位置的经纬度
    var longitude = wx.getStorageSync('address').location.lng;
    var address=province+city;//（只保留省市）
    wx.request({
      url: app.globalData.url + 'index/ShaiXuan/search',
      data: {
        address: address,
        latitude: latitude,
        longitude: longitude,
        text:text,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        console.log(res.data)
        that.setData({
          search_course:res.data[0],
          search_teacher: res.data[1]
        })
      }
    })
  }else{
    //根据选择的位置进行筛选
    var city = app.globalData.select_city;
    var select_province = '';
    //根据请求的城市定位所在省
    qqmapsdk.geocoder({
      address: city,
      success: function (res) {
        console.log(res.result)
        select_province = res.result.address_components.province
        var latitude = wx.getStorageSync('address').location.lat;//本人实际位置的经纬度
        var longitude = wx.getStorageSync('address').location.lng;
        console.log('请求的城市' + select_province + city )
        var address = select_province + city 
        wx.request({
          url: app.globalData.url + 'index/ShaiXuan/search',
          data: {
            address: address,
            latitude: latitude,
            longitude: longitude,
            text: text,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            wx.hideLoading()
            console.log(res.data)
            that.setData({
              search_course: res.data[0],
              search_teacher: res.data[1]
            })
          }
        })
      }
    })

  }
  }else{
    var type=that.data.cour_type;
    if (!app.globalData.select_city) {
      var province = wx.getStorageSync('address').province;//当前的省
      var city = wx.getStorageSync('address').city;//当前的省市
      var latitude = wx.getStorageSync('address').location.lat;//本人实际位置的经纬度
      var longitude = wx.getStorageSync('address').location.lng;
      var address = province + city;//（只保留省市）
      wx.request({
        url: app.globalData.url + 'index/column/search',
        data: {
          address: address,
          latitude: latitude,
          longitude: longitude,
          text: text,
          cour_type:type,
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data)
          wx.hideLoading()
          that.setData({
            search_course: res.data[0],
            search_teacher: res.data[1]
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
          var latitude = wx.getStorageSync('address').location.lat;//本人实际位置的经纬度
          var longitude = wx.getStorageSync('address').location.lng;
          console.log('请求的城市' + select_province + city)
          var address = select_province + city
          wx.request({
            url: app.globalData.url + 'index/column/search',
            data: {
              address: address,
              latitude: latitude,
              longitude: longitude,
              text: text,
              cour_type:type
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res.data)
              wx.hideLoading()
              that.setData({
                search_course: res.data[0],
                search_teacher: res.data[1]
              })
            }
          })
        }
      })
    }
  }
},
//热门搜索点击
  hot_search:function(e){
    var hot_text = e.currentTarget.dataset.text;
    this.setData({
      text:hot_text
    })
    this.search();
  },


goback:function(){
  wx.navigateBack({
    delta:1
  })
},

  /**
    * 生命周期函数--监听页面显示
    */
  onShow: function () {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      cour_type: options.cour_type?options.cour_type:null
    })
    console.log(that.data.cour_type)
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