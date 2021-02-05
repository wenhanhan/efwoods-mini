// pages/daily_exercise_des/daily_exercise_des.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isjudge: false,
    focus: false,
    video_id:null,
    keyboard_height:0,
    content:'',
    course:{},
    userInfo:{},
    judge:[
      {
        head:'/img/head.jpeg',
        name:'文寒',
        time:'2021/01/01',
        content:'挺好的。',
        reply:[
          {
            head:'/img/head.jpeg',
            name:'张三',
            time:'2021/01/01',
            reply_content:'挺好的。',
          },
          {
            head:'/img/head.jpeg',
            name:'李四',
            time:'2021/01/01',
            reply_content:'挺好的。',
          },
          {
            head:'/img/head.jpeg',
            name:'王五',
            time:'2021/01/01',
            reply_content:'挺好的。',
          }
        ]
      },
      {
        head:'/img/head.jpeg',
        name:'文寒',
        time:'2021/01/01',
        content:'挺好的。',
        reply:[
          {
            head:'/img/head.jpeg',
            name:'测试',
            time:'2021/01/01',
            reply_content:'挺好的。',
          },
          {
            head:'/img/head.jpeg',
            name:'测试啊',
            time:'2021/01/01',
            reply_content:'挺好的。',
          }
        ]
      }
    ]
  },
  focus: function (e) {
    console.log(e)
    var height = e.detail.height;
    this.setData({
      keyboard_height: height
    })
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
  judgeTxt: function (e) {
      console.log(e.detail.value)
      this.setData({
        content: e.detail.value
      })
  },
  //发送评论
  send:function(){
    var that = this;
    var content = that.data.content.trim();
    var openid = wx.getStorageSync('openid');
    var video_id = that.data.video_id;
    var userInfo=wx.getStorageSync('userInfo');
    if(content){
      wx.request({
        method: 'POST',
        url: app.globalData.url + 'index/Dailyexercise/judge',
        data: {
          openid: openid,
          video_id: video_id,
          content: content,
          headimg:userInfo.avatarUrl,
          username:userInfo.nickName
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data)
          if(res.data==87014){
            wx.showToast({
              title: '评论内容不合法',
              icon:'loading',
              duration:1000
            })
          }else{
            that.setData({
              content:'',
              focus:false,//评论完成输入框下拉回到初始态
              keyboard_height:0
            })
            wx.showToast({
              title: '评论成功',
              icon: 'success',
              duration: 1000
            })
            that.getVideoJudge(video_id);//提交成功，重新获取视频评论
          }
        }
      })
    }else{
      console.log('评价内容为空')
    }
  },
  //开始练习
  start:function(){
    var course=this.data.course
    wx.navigateTo({
      url: '/package3/daily_exercise_start/daily_exercise_start?video_id='+this.data.video_id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var isIphoneX = app.globalData.isIphoneX;
    this.setData({
      video_id: options.video_id,
      isIphoneX: isIphoneX
    })
    this.getVideoJudge(options.video_id)
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
    var video_id=that.data.video_id;
    this.setData({
      userInfo:wx.getStorageSync('userInfo')
    })
    wx.request({
      url: app.globalData.url + 'index/Dailyexercise/getVideoDes',
      data: {
        video_id: video_id
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      success(res){
        console.log(res.data)
        that.setData({
          course:res.data
        })
      }
    })
  },
  getVideoJudge(video_id){
    var that=this;
    wx.request({
      url: app.globalData.url + 'index/Dailyexercise/getVideoJudge',
      data: {
        video_id: video_id
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      success(res){
        console.log(res.data)
        that.setData({
          judge:res.data
        })
      }
    })
  },
  //查看主评论的全部回复
  view:function(e){
    var main_id=e.currentTarget.dataset.mainid
    wx.navigateTo({
      url: '/package3/daily_exercise_reply/daily_exercise_reply?main_id='+main_id,
    })
  },
  //开始评论
  judge:function(){
//首先判断是否授权
var userInfo = wx.getStorageSync('userInfo');//用户信息
if(userInfo){
  this.setData({
    isjudge: true,
    focus: true
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})