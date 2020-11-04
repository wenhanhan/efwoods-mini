// pages/myset/sign/sign.js
var common = require('../../../utils/common.js');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'tab0',//默认选中全部
    cour_type: [],//课程类目
    wrap: true,//评语的长度
    signlist:[
      {"title":"高尔夫课程","tea":"文寒","class":"高尔夫课程基础班","date":"2019-03-15 12:00:00"}
    ],
    news_id: '', 
  },

// 扫码签到函数
  scan:function(){
    var that=this;
    var openid=wx.getStorageSync('openid');
    if(app.globalData.freeze==1){
      wx.showToast({
        title: '你已被冻结',
        icon: 'loading',
        duration: 2000
      })
    }else{
      wx.scanCode({
        onlyFromCamera: true,
        scanType: ['qrCode'],
        success(res) {
          var cour_id = res.result.split("/")[0]; //主要获取课程签到码的课程id1
          if(cour_id%1===0){
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
                    if(res.data.code==200){
                      common.judge(2)
                      wx.showToast({
                        title: res.data.msg,
                        icon: 'success',
                        duration: 1000,
                        success(res) {
                          that.getSignInfo()
                        }
                      })
                    }else{
                      //签到失败
                      wx.showToast({
                        title: res.data.msg,
                        icon:'none',
                        duration:1000
                      })
                    }
                  }
                })
              }
            })
          }else{
            wx.showToast({
              title: '无效签到码',
              icon:'loading',
              duration:2000
            })
          }
          
        }
      })
    }
  },

  getSignInfo:function(){
    //加载签到数据
    var that = this;
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: app.globalData.url + 'index/Sign/getSignInfo',
      data: {
        openid: openid,
        cour_type: 0
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          signlist: res.data
        })
      }
    })
  },

  // 截取字符串,多余省略号显示
  substr: function (val) {
    if (val.length == 0 || val == undefined) {
      return '';
    } else if (val.length > 12) {
      return val.substring(0, 16) + "...";
    } else {
      return val;
    }
  },

  //根据栏目筛选签到课程
  handleChange({ detail }) {
    var that = this;
    var openid = wx.getStorageSync('openid');
    var cour_type = detail.key.substring(3);//课程类目
    console.log(cour_type)
    this.setData({
      current: detail.key
    });

    wx.request({
      url: app.globalData.url + 'index/Sign/getSignInfo',
      data: {
        openid: openid,
        cour_type: cour_type
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          signlist: res.data
        })
      }
    })


  },


  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      news_id: options.news_id
    })
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
    this.getSignInfo()
    var cour_type = app.globalData.cour_type;
    this.setData({
      cour_type: cour_type
    })
    //清除消息通知
    common.setNewsRead('', this.data.news_id)
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

})