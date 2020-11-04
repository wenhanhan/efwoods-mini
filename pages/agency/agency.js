// pages/agency/agency.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: false,
    admin:false,
    is_pass:'',
    agency_id:'',//机构标识
    agency_info:[],//机构信息
    judge:[],//机构评论
    judge_num:0,//评价总数
    teacher:[],//机构入驻教师
    state:0,//是否申请入驻 0审核中 1审核通过 2审核拒绝
    agency_img:[],//机构展示图片
    agency_judge_img:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var admin=options.admin;
    var isIphoneX = app.globalData.isIphoneX;
    console.log(admin)
    this.setData({
      isIphoneX:isIphoneX,
      admin:admin?admin:false,
      agency_id:options.id,
      is_pass:options.is_pass?options.is_pass:1
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
    var that=this;
    var agency_id=that.data.agency_id;
    var openid=wx.getStorageSync('openid');
    var latitude = wx.getStorageSync('address').location.lat;//本人实际位置的经纬度
    var longitude = wx.getStorageSync('address').location.lng;
    //查询机构信息
    wx.request({
      url: app.globalData.url + 'index/Agency/agencyInformation',
      data:{
        agency_id:agency_id,
        latitude:latitude,
        longitude:longitude
      },
      header: { 
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data)
        that.setData({
          agency_info:res.data,
          agency_img:res.data[0].agency_img?JSON.parse(res.data[0].agency_img):[]
        })
      }
    })
    //查询评价信息
    wx.request({
      url: app.globalData.url +'index/Agency/agencyJudgeDes',
      data:{
        agency_id:agency_id,
        page:1
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        wx.setStorageSync('judge', res.data[0])
        wx.setStorageSync('judge_img', res.data[1])
        console.log(res.data)
        that.setData({
          judge:res.data[0],
          judge_num:res.data[2],
          agency_judge_img:res.data[1] 
        })
        console.log(that.data.agency_judge_img.length)
      }
    })
    //查询是否申请入驻
    wx.request({
      url: app.globalData.url +'index/Agency/teaApplyState',
      data:{
        openid:openid,
        agency_id:agency_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data)
        that.setData({
          state:res.data
        })
        console.log(that.data.state)
      }
    })
    //查询入驻教师
    wx.request({
      url: app.globalData.url +'index/Agency/agencyTeacher',
      data:{
        agency_id:agency_id,
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
  join:function(e){
    var that=this;
    var agency_id = e.currentTarget.dataset.agencyid;
    var openid=wx.getStorageSync('openid');
    wx.request({
      url: app.globalData.url +'index/Agency/teacherApplyAgency',
      data:{
        openid:openid,
        agency_id:agency_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data)
        that.setData({
          state:201
        })
        wx.showToast({
          title: res.data.msg,
          icon:'success',
          duration:1000
        })
      }
    })
  },
  //拨打电话
  phone:function(e){
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
      success: function (res) {
        console.log('拨打成功')
      },
    })
  },
  //评价事件
  pingjia: function (e) {
    var agency_id = e.currentTarget.dataset.agencyid;//评价课程id
    var userInfo = wx.getStorageSync('userInfo');//用户信息
    //首先检测用户是否授权
    if(userInfo){
      if (app.globalData.freeze == 1) {
        wx.showToast({
          title: '你已被冻结',
          icon: 'loading',
          duration: 2000
        })
      } else {
        wx.navigateTo({
          url: '../agency_judge/agency_judge?agency_id=' + agency_id,
        })
      }
    }else{
      app.login()
    }
  },
  //图片预览
  previewImage: function (e) { 
    var current = e.target.dataset.src;
    var index = e.target.dataset.index;
    // console.log(this.data.tea_judge_img[index])
    var arr = new Array();
    arr[0] = 'https://icloudapi.cn/efire/public/uploads/judge/' + this.data.agency_judge_img[index].pic1
    arr[2] = 'https://icloudapi.cn/efire/public/uploads/judge/' + this.data.agency_judge_img[index].pic2
    arr[3] = 'https://icloudapi.cn/efire/public/uploads/judge/' + this.data.agency_judge_img[index].pic3
    this.setData({
      agency_judge_img: arr 
    })
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.agency_judge_img
    })
  },
  preview:function(e){
    var img=this.data.agency_img;
    var src=e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: img // 需要预览的图片http链接列表
    })
  },
  tea_info:function(e){
    var tea_id=e.currentTarget.dataset.id;//教师id
    wx.navigateTo({
      url:'../tea_detail/tea_detail?tea_id='+tea_id
    })
  },
  //关注教师
  guanzhu:function(e){
    var that=this;
    var userInfo = wx.getStorageSync('userInfo');//用户信息
    var tea_id=e.currentTarget.dataset.teaid;
    var state=e.currentTarget.dataset.state
    var openid=wx.getStorageSync('openid');
    var index=e.currentTarget.dataset.idx;
    var teacher=that.data.teacher;
    var t;
    //首先检测是否授权
    if(userInfo){
      if (state == 200) {
        state = 400;
        t = 0;
      } else {
        state = 200;
        t = 1;
      }
      teacher[index].state = state;
      console.log(state)
      wx.request({
        url: app.globalData.url + 'index/Person/favorTeacher',
        data: {
          openid: openid,
          tea_id: tea_id,
          favor_state: t
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
    }else{
      //返回授权
      app.login()
    }
    
  },

  //地址导航
  chooseLocation: function (e){
    var latitude=e.currentTarget.dataset.lat;
    var longitude=e.currentTarget.dataset.long;
    var name=e.currentTarget.dataset.address;
    var address=e.currentTarget.dataset.location;
    wx.openLocation({
      latitude,
      longitude,
      name,
      address,
      scale: 18,
      success(res) {
        console.log('打开成功')
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
    var id = this.data.agency_id; //课程id  重要的参数
    // common.judge(1)
    return {
      title: '向你推荐了小程序',
      path: '/pages/agency/agency?&id=' + id,
    }
  }
})