// pages/daily_exercise_start/daily_exercise_start.js
const { $Message } = require('../../dist/base/index');
const videoCtx=wx.createVideoContext('myVideo')
import Dialog from '../dist/dialog/dialog';
var app=getApp()
var timer=null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    video_id:'',
    idx:0,
    timing:'00:00',
    time:0,//训练的总秒数
    course:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      video_id:options.video_id,
      videoCtx:wx.createVideoContext('myVideo', this)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  
  //训练
  play:function(e){
    var idx=e.currentTarget.dataset.idx;//选择播放的视频
    this.setData({
      idx:idx
    })
  },
  //继续训练
  start:function(){
    var that=this;
    var time=this.data.time;
    clearInterval(timer)
    timer=setInterval(function(){
      time++;
      that.setData({
        timing:that.sec_to_time(time),
        time:time
      })
    },1000)
  },
  //暂停播放
  stop:function(e){
    clearInterval(timer)
  },
  //视频播放完毕事件
  end:function(){
    var idx=this.data.idx;
    var time=this.data.time;
    var that=this;
    if(idx<this.data.course.content.length-1){
      idx++;
      this.setData({
        idx:idx
      })
    }else{
      console.log('全部播放完毕')
      //清除计时器
      clearInterval(timer)
      this.setData({
        idx:-1
      })
      //弹窗提示 是否结束或者继续从头开始训练
      Dialog.setDefaultOptions({
        confirmButtonText:'结束训练',
        cancelButtonText:'再来一次'
      })
      Dialog.confirm({
        title: '训练完毕',
        message: '是否要再来一遍',
      })
        .then(() => {
          // 清空计时器 将结果提交 跳转到排行榜页面
          clearInterval(timer)
          wx.redirectTo({
            url: '/package3/daily_exercise_ranking/daily_exercise_ranking?time='+time+'&video_id='+that.data.video_id,
          })
        })
        .catch(() => {
          // 重启计时器 视频从头开始播放
          that.setData({
            idx:0
          })
          that.data.videoCtx.play()
        });
    }
  },
  //结束训练
  close:function(){
    var time=this.data.time;
    var that=this;
    clearInterval(timer)
    this.data.videoCtx.pause()
    //重置按钮的默认设置
    Dialog.resetDefaultOptions()
    Dialog.confirm({
      title: '结束训练',
      message: '是否要结束当前训练',
    })
      .then(() => {
        // 清空计时器 将结果提交 跳转到排行榜页面
        clearInterval(timer)
        wx.redirectTo({
          url: '/package3/daily_exercise_ranking/daily_exercise_ranking?time='+time+'&video_id='+that.data.video_id,
        })
      })
      .catch(() => {
        // 重启计时器 视频继续播放
        that.data.videoCtx.play()
      });
  },
  //格式化日期事件 转化为分秒
  sec_to_time(t){
    if (!t) return;
    if (t < 60) return "00:" + ((i = t) < 10 ? "0" + i : i);
    if (t < 3600) return "" + ((a = parseInt(t / 60)) < 10 ? "0" + a : a) + ":" + ((i = t % 60) < 10 ? "0" + i : i);
    if (3600 <= t) {
    var a, i, e = parseInt(t / 3600);
    return (e < 10 ? "0" + e : e) + ":" + ((a = parseInt(t % 3600 / 60)) < 10 ? "0" + a : a) + ":" + ((i = t % 60) < 10 ? "0" + i : i);
}
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;
    var video_id=this.data.video_id;
    var time=this.data.time;
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
        //开始计时
        clearInterval(timer)
        timer=setInterval(function(){
          time++;
          console.log(that.sec_to_time(time))
          that.setData({
            timing:that.sec_to_time(time),
            time:time
          })
        },1000)
        console.log(timer)
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