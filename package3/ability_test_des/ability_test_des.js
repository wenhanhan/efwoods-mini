// pages/ability_test_des/ability_test_des.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sub_id:null,
    currenttab:0,
    option_idx:-1,
    topic:[
      {
        title:'1、网球运动中两个最基本的底线技术是: ( )',
        option:['A.攻球和削球','B.攻球和发球','C.搓球和削球','D.削球和高压球'],
        right:[0,'A']
      },
      {
        title:'2、网球运动中两个最基本的底线技术是: ( )',
        option:['A.攻球和削球','B.攻球和发球','C.搓球和削球','D.削球和高压球'],
        right:[1,'B']
      },
      {
        title:'3、网球运动中两个最基本的底线技术是: ( )',
        option:['A.攻球和削球','B.攻球和发球','C.搓球和削球','D.削球和高压球'],
        right:[2,'C']
      },
      {
        title:'3、网球运动中两个最基本的底线技术是: ( )',
        option:['A.攻球和削球','B.攻球和发球','C.搓球和削球','D.削球和高压球'],
        right:[2,'C']
      },
      {
        title:'3、网球运动中两个最基本的底线技术是: ( )',
        option:['A.攻球和削球','B.攻球和发球','C.搓球和削球','D.削球和高压球'],
        right:[2,'C']
      },
      {
        title:'3、网球运动中两个最基本的底线技术是: ( )',
        option:['A.攻球和削球','B.攻球和发球','C.搓球和削球','D.削球和高压球'],
        right:[2,'C']
      }
    ]
  },
select:function(e){
  var idx=e.currentTarget.dataset.idx;
  var that=this;
  var topic_idx=this.data.currenttab;
  this.setData({
    option_idx:idx
  })
  //选择以后切换下一题
  console.log(topic_idx)
  if(topic_idx==this.data.topic.length-1){
    //直接跳转结果页面
    console.log('跳转啦')
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
      sub_id:options.sub_id
    })
  },
  //查询题目的具体信息
  getSubject(sub_id){
    var that=this;
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