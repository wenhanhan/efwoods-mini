// pages/ability_test/ability_test.js
var app=getApp()
const { $Toast } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    idx:0,
    imgUrls:[],
    professional_test:[
    ],
    hot_test:[
    ],
    hot_test_list:[
    ]
  },
  handleType:function(e){
    var index=e.currentTarget.dataset.curindex;
    var type=e.currentTarget.dataset.type;
    this.getTestList(type)
    this.setData({
      idx:index
    })
  },
  //格式插值
  format_arr(arr){
    var leng=arr.leng
    if(leng%4==0) return; 
    var add=4-leng%4
    for(var i=0;i<add;i++){
      arr.push({
        title:'',
        url:''
      })
    }
    return arr;
  },
  //跳转
  view:function(e){
    var id=e.currentTarget.dataset.id
    var type_name=e.currentTarget.dataset.typename;
    //判断是否存在题目
    if(id){
      wx.navigateTo({
        url: '../ability_test_des/ability_test_des?sub_id='+id+'&type_name='+type_name,
      })
    }else{
      $Toast({
        content: '该栏目未开放测评',
        duration:1
    });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    //获取首页轮播图
    var that=this;
    wx.request({
      url: app.globalData.url + 'index/AbilityTest/getBanner',
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
    //获取栏目
    wx.request({
      url: app.globalData.url + 'index/AbilityTest/getTopicType',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          professional_test:res.data[0],
          hot_test:that.format_arr(res.data[1])
        })
        that.getTestList(res.data[1][0].Id)
      }
    })
  },
  //获取测评列表
  getTestList(type){
    var that=this;
    wx.request({
      url: app.globalData.url + 'index/AbilityTest/getTopicByType',
      data: {
        type:type
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          hot_test_list:res.data
        })
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