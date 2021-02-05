// pages/daily_exercise_reply/daily_exercise_reply.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    video_id:0,
    userInfo:{},
    main_id:null,//主评论id
    placeholder:'添加评论',
    reply_name:null,
    isjudge: false,
    focus: false,
    keyboard_height:0,
    content:'',
    judge:
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
            to:{
              name:'文寒',
              openid:'123'
            },
          }
        ]
      },
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
      this.setData({
        content: e.detail.value
      })
  },
  reply:function(e){
    var userInfo = wx.getStorageSync('userInfo');//用户信息
    var mainname=e.currentTarget.dataset.mainname;
    var video_id=e.currentTarget.dataset.videoid;
    console.log(video_id)
    var main_id=e.currentTarget.dataset.type==0?this.data.main_id:e.currentTarget.dataset.type;
    console.log(this.data.isjudge)
    if(userInfo){
        this.setData({
        isjudge: true,
        video_id:video_id,
        main_id:main_id,
        reply_name:e.currentTarget.dataset.type==0?'':mainname,
        focus: true,
        placeholder:'回复 '+mainname,
    })
  }else{
    app.login()
  }
    },
      //发送评论
  send:function(){
    var that = this;
    var content = that.data.content.trim();
    var video_id = that.data.video_id;
    var main_id=that.data.main_id?that.data.main_id:''
    var reply_name=that.data.reply_name;
    that.commen_send(content,main_id,video_id,reply_name)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      main_id:options.main_id
    })
    this.getJudge(options.main_id)
  },
  getJudge(judge_id){
    var that=this;
    wx.request({
      url: app.globalData.url + 'index/Dailyexercise/getTopicInfo',
      data: {
        main_id: judge_id
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
//抽离评论函数
commen_send(content,main_id,video_id,reply_name){
  var that=this;
  var content = that.data.content.trim();
  var openid = wx.getStorageSync('openid');
  var userInfo=wx.getStorageSync('userInfo');
  if(content){
    wx.request({
      method: 'POST',
      url: app.globalData.url + 'index/Dailyexercise/judge',
      data: {
        openid: openid,
        video_id: video_id,
        main_id:main_id,
        content: content,
        headimg:userInfo.avatarUrl,
        username:userInfo.nickName,
        reply_name:reply_name
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
          that.getJudge(main_id);//提交成功，重新获取视频评论
        }
      }
    })
  }else{
    console.log('评价内容为空')
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
    this.setData({
      userInfo:wx.getStorageSync('userInfo')
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