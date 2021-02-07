// pages/ability_test_des/ability_test_des.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    score:0,//答题的模拟得分
    sub_id:null,
    currenttab:0,
    option_idx:-1,
    topic:[
    ],
    type_name:'',
  },
select:function(e){
  var that=this;
  var idx=e.currentTarget.dataset.idx;
  var topic_idx=this.data.currenttab;
  var type_name=this.data.type_name;
  var topic=this.data.topic;
  var score=this.data.score;
  var sub_id=this.data.sub_id
  this.setData({
    option_idx:idx
  })
  //判断正误
  if(idx==topic[topic_idx].right[0]*1){
    score++
    this.setData({
      score:score
    })
  }
  //选择以后切换下一题
  if(topic_idx==this.data.topic.length-1){
    wx.showLoading({
      title: '正在提交',
    })
    setTimeout(function(){
      wx.reLaunch({
        url: '../ability_test_res/ability_test_res?sub_id='+sub_id+'&score='+score+'&length='+topic.length+'&type_name='+type_name,
      })
    },1000)
  }else{
    setTimeout(function(){
      topic_idx++;
      that.setData({
        currenttab:topic_idx
      })
    },1000)
  }
},
switchtab:function(e){
  this.setData({
    option_idx:-1,
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      sub_id:options.sub_id,
      type_name:options.type_name
    })
  },
  //查询题目的具体信息
  getSubject(sub_id){
    var that=this;
    wx.showLoading({
      title: '题目生成中',
    })
    wx.request({
      url: app.globalData.url + 'index/AbilityTest/getSubjectById',
      data: {
        id:sub_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data)
        wx.hideLoading({})
        that.setData({
          topic:res.data.subject
        })
      }
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
    var id=this.data.sub_id
    this.getSubject(id)
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