// pages/daily_exercise_des/daily_exercise_des.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order:true,//排序 0代表时间 1代表热度
    main_id:null,//主评论id
    placeholder:'添加评论',
    judge_num:0,
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
  //评论排序
  judge_order:function(){
    var that=this;
    var video_id=that.data.video_id;
    this.setData({
      order:!this.data.order
    })
    var order=this.data.order?0:1
    that.getVideoJudge(video_id,order)
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
  //喜欢某条评论
  like:function(e){
    var judge_id=e.currentTarget.dataset.mainid;
    var openid=wx.getStorageSync('openid');
    var idx=e.currentTarget.dataset.idx;
    var status=e.currentTarget.dataset.likestatus;
    var judge=this.data.judge
    if(status==200){
      //取消点赞
      judge[idx].isLike=404
      judge[idx].likeNum--
    }else{
      judge[idx].isLike=200
      judge[idx].likeNum++
    }
    this.setData({
      judge:judge
    })
    wx.request({
      url: app.globalData.url + 'index/Dailyexercise/likeJudge',
        data: {
          openid: openid,
          judge_id:judge_id
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res){
          console.log(res.data)
        }
    })
  },
  //发送评论
  send:function(){
    var that = this;
    var content = that.data.content.trim();
    var video_id = that.data.video_id;
    var main_id=that.data.main_id?that.data.main_id:''
    console.log(main_id)
    that.commen_send(content,main_id,video_id,'')
  },
  //回复某人评论
  reply:function(e){
    var userInfo = wx.getStorageSync('userInfo');//用户信息
    var mainname=e.currentTarget.dataset.mainname;
    var main_id=e.currentTarget.dataset.mainid
    if(userInfo){
        this.setData({
        isjudge: true,
        focus: true,
        placeholder:'回复 '+mainname,
        main_id:main_id
    })
  }else{
    app.login()
  }
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
            that.getVideoJudge(video_id,0);//提交成功，重新获取视频评论
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
    console.log(options)
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
    this.getVideoJudge(this.data.video_id,0)
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
  getVideoJudge(video_id,order){
    var that=this;
    var openid=wx.getStorageSync('openid')
    wx.request({
      url: app.globalData.url + 'index/Dailyexercise/getVideoJudge',
      data: {
        video_id: video_id,
        order:order,
        openid:openid
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      success(res){
        console.log(res.data)
        var a=res.data;
        var b=a.judge_num;
        delete a.judge_num
        that.setData({
          judge_num:b,
          judge:a
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
        focus: true,
        main_id:null,
        placeholder:'添加评论'
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