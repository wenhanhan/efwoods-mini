// pages/daily_exercise_ranking/daily_exercise_ranking.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    my_time:0,//用户当前的训练时长
    multiArray: [['小学','初中','高中'], ['一年级', '二年级','三年级','四年级','五年级','六年级']],
    multiIndex: [0, 0],
    cate_index:0,
    period_index:0,
    scroll_height: 0,
    category:['平板支撑训练','仰卧起坐','体前屈'],
    period:['当天','本周','本月'],
    type:[
      {
        grade:'小学',
        class:['一年级','二年级','三年级','四年级','五年级','六年级']
      },
      {
        grade:'初中',
        class:['初一','初二','初三']
      },
      {
        grade:'高中',
        class:['高一','高二','高三']
      }
    ],
    ranking_list:[
      {
        ranking:1,
        avatar:'/img/head.jpeg',
        name:'文寒',
        time:'10分钟'
      },
      {
        ranking:2,
        avatar:'/img/head.jpeg',
        name:'文寒',
        time:'10分钟'
      },
      {
        ranking:3,
        avatar:'/img/head.jpeg',
        name:'文寒',
        time:'10分钟'
      },
      {
        ranking:4,
        avatar:'/img/head.jpeg',
        name:'文寒',
        time:'10分钟'
      },
      {
        ranking:5,
        avatar:'/img/head.jpeg',
        name:'文寒',
        time:'10分钟'
      },
      {
        ranking:6,
        avatar:'/img/head.jpeg',
        name:'文寒',
        time:'10分钟'
      },
      {
        ranking:7,
        avatar:'/img/head.jpeg',
        name:'文寒',
        time:'10分钟'
      },
      
    ],
    my_rank:[],
    userInfo:{}
  },
  // 年级大类
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var that=this;
    this.setData({
        multiIndex: e.detail.value
    })
    var video_title=this.data.category[this.data.cate_index]
    var period=this.data.period_index
    var grade=this.data.type[e.detail.value[0]].class[e.detail.value[1]]
    that.getRankInfo(video_title,grade,period,'')
},
bindMultiPickerColumnChange: function (e) {
    var that=this;
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var multiArray = this.data.multiArray,
        multiIndex = this.data.multiIndex
    // console.log(e.detail)
    multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
        case 0:
            switch (multiIndex[0]) {
                case 0:
                    multiArray[1] = ['一年级', '二年级','三年级','四年级','五年级','六年级'];
                    break;
                case 1:
                    multiArray[1] = ['初一', '初二', '初三'];
                    break;
                case 2:
                    multiArray[1] = ['高一', '高二', '高三'];
                    break;

            }
    }
    console.log(multiIndex);
    this.setData({
        multiArray,
        multiIndex
    });
},
  //切换锻炼类目
  bindCategory: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      cate_index: e.detail.value
    })
    var that=this;
    var video_title=this.data.category[e.detail.value]
    var period=this.data.period_index
    var grade=this.data.type[this.data.multiIndex[0]].class[this.data.multiIndex[1]]
    that.getRankInfo(video_title,grade,period,'')
  },
  //切换排名周期
  bindPeriod: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var that=this;
    this.setData({
      period_index: e.detail.value
    })
    var video_title=this.data.category[this.data.cate_index]
    var period=e.detail.value
    var grade=this.data.type[this.data.multiIndex[0]].class[this.data.multiIndex[1]]
    that.getRankInfo(video_title,grade,period,'')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
    this.setData({
      scroll_height: windowHeight * 750 / windowWidth - 290 - 30,
      video_id:options.video_id,//上一级页面传递
      my_time:options.time,
      userInfo:wx.getStorageSync('userInfo')
    })
    //查询训练项目
    that.getExerciseItem()
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
    var time=that.data.my_time
    var video_id=that.data.video_id;
    var openid=wx.getStorageSync('openid');
    console.log(!time)
    if(time==0||!time){
      //首页跳转
      that.getRankInfo('','','','')
    }else{
      //每日一练跳转
      wx.request({
        url: app.globalData.url+'index/Dailyexercise/saveExerciseInfo',
        method: 'POST',
        data:{
          openid:openid,
          video_id:video_id,
          duration:time
        },
        header: {
          'content-type': 'application/json' // 默认值1
        },
        success(res){
          console.log(res.data)
          if(res.data.code==200){
            //查询排名
            that.getRankInfo('','',0,video_id)
          }else{
            //提交失败
            that.getRankInfo('','',0,video_id)
          }
        }
      })
    }
  },
  //查询排名
  getRankInfo(video_name,grade,period,video_id){
    var that=this;
    var openid=wx.getStorageSync('openid');
    wx.request({
      url: app.globalData.url+'index/Dailyexercise/getRankInfo',
      data:{
        period:period,
        grade:grade,
        video_title:video_name,
        video_id:video_id,
        openid:openid
      },
      header: {
        'content-type': 'application/json' // 默认值1
      },
      success(res){
        console.log(res.data)
        that.setData({
          ranking_list:res.data[0],
          my_rank:res.data[1]
        })
      } 
    })
  },
  //查询项目
  getExerciseItem(){
    var that=this;
    wx.request({
      url: app.globalData.url+'index/Dailyexercise/getExerciseItem',
      data:{
      },
      header: {
        'content-type': 'application/json' // 默认值1
      },
      success(res){
        console.log(res.data)
        that.setData({
          category:res.data
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