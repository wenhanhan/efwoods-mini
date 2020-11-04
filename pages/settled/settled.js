// pages/settled/settled.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    home_state:false,//是否显示返回主页按钮
    current:'tab1',
    teacher:[]//申请教师
  },
  tab1:function(){
    this.setData({
      current:'tab1'
    })
  },
  tab2:function(){
    this.setData({
      current: 'tab2'
    })
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
    var pages = getCurrentPages();//当前页面栈
    var openid=wx.getStorageSync('openid');//机构负责人id
    console.log(pages)
    if (pages.length == 1) {
      //分享页面进入 绘制顶部栏加主页返回
      this.setData({
        home_state: true
      })
    }
    //选取入驻教师
    wx.request({
      url: app.globalData.url +'index/Agency/getApplyTeacher',
      data:{
        openid:openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data)
        that.setData({
          teacher:res.data
        })
      }
    })
  },
  home: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../location/location',
    })
  },
  tea_des:function(e){
    var tea_id=e.currentTarget.dataset.teaid;
    wx.navigateTo({
      url: '../tea_detail/tea_detail?tea_id=' + tea_id
    })
  },
  //同意入驻
  agree:function(e){
    var that=this;
    var idx = e.currentTarget.dataset.idx;
    var tea_openid=e.currentTarget.dataset.teaopenid;
    var agency_id=e.currentTarget.dataset.agencyid;
    var teacher=that.data.teacher;
    teacher[idx].is_pass=1;
    wx.request({
      url: app.globalData.url +'index/Agency/passTeacherApply',
      data:{
        state:1,
        tea_openid:tea_openid,
        agency_id:agency_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data)
        that.setData({
          teacher:teacher
        })
      }
    })
  },
  //拒绝入驻
  refuse:function(e){
    var that = this;
    var idx = e.currentTarget.dataset.idx;
    // var state = e.currentTarget.dataset.state;
    var tea_openid = e.currentTarget.dataset.teaopenid;
    var agency_id = e.currentTarget.dataset.agencyid;
    var teacher = that.data.teacher;
    teacher[idx].is_pass =2;
    wx.request({
      url: app.globalData.url + 'index/Agency/refuseTeacherApply',
      data: {
        state:2,
        tea_openid: tea_openid,
        agency_id: agency_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          teacher: teacher
        })
      }
    })
  },
  modify:function(){
    wx.navigateTo({
      url: '../agency_modify/agency_modify',
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