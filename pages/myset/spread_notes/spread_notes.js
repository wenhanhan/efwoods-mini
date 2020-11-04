// pages/myset/spread_notes/spread_notes.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: '',
    current: 'student',
    level: 'one',
    agency_num:0,
    student_num:0,
    teacher_num:0,
    //私教一级推广人
    tea_one_level: [
      
    ],
    //私教二级推广人
    tea_two_level: [
     
    ], 
    //学员一级推广人
    stu_one_level: [
     
    ],
    //学员二级推广人
    stu_two_level: [
      
    ],
    //机构
    agency: [
     
    ],
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
    var that=this;
    var openid=wx.getStorageSync('openid');
    wx.request({
      url: app.globalData.url +'index/Spread/spreadNotes',
      // url: 'http://localhost/tp5/public/index/spread/spreadNotes',
      data:{
        openid:openid
        // openid:'ohelb5ZfZGScQ-HBlIqOhzqboa3o'
      },
      header: {
        'Content-type': 'application/json'
      },
      success(res){
        console.log(res.data)
        that.setData({
          student_num:res.data[0],
          teacher_num:res.data[1],
          agency_num:res.data[2],
          stu_one_level:res.data[3],
          tea_one_level:res.data[4],
          stu_two_level: res.data[5][0]?res.data[5][0]:[],
          tea_two_level: res.data[6][0]?res.data[6][0]:[],
          agency:res.data[7]
        })
      }
    })
  },
  input: function (e) {
    this.setData({
      text: e.detail.value
    })
  },
  handleChange({ detail }) {
    this.setData({
      current: detail.key,
      level: 'one',//级别回到初始值
      text: ''
    });
  },
  level({ detail }) {
    this.setData({
      level: detail.key
    });
  },
  search: function () {
    var that = this;
    var text = that.data.text.trim()
    if (!text) {
      wx.showToast({
        title: '请输入会员名称',
        icon: 'loading',
        duration: 1000
      })
      return
    }
    console.log('符合条件')
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