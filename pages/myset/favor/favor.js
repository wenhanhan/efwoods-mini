// pages/myset/favor/favor.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'tab1',
    current_scroll: 'tab1',
    video: [],

    //收藏课程列表 接口请求 
    course: [],

    //收藏教师列表  接口请求
    teacher: []
     
  },

  handleChange({ detail }) {
    this.setData({
      current: detail.key
    });
  },

  handleChangeScroll({ detail }) {
    this.setData({
      current_scroll: detail.key
    });
  },

  // 移除收藏的课程
  removeCour:function(e){
    var that=this;
    var openid=wx.getStorageSync('openid');
    var cour_id = e.currentTarget.dataset.courid;//课程的id
    var index = e.currentTarget.dataset.index;//课程的渲染顺序
    var course=that.data.course;
    var state=1;//已收藏
    wx.showModal({
      title: '提示',
      content: '是否移除收藏',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: app.globalData.url +'index/Person/collectCourse',
            data:{
              openid:openid,
              cour_id:cour_id,
              collect_state:0//不喜欢
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res){
              course.splice(index, 1)
              that.setData({
                course:course
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //移除喜欢的教师
  removeTea: function (e) {
    var that = this;
    var openid = wx.getStorageSync('openid');
    var tea_id = e.currentTarget.dataset.teaid;//课程的id
    var index = e.currentTarget.dataset.index;//课程的渲染顺序
    var teacher = that.data.teacher;
    var state = 1;//已收藏
    wx.showModal({
      title: '提示',
      content: '是否移除收藏',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: app.globalData.url + 'index/Person/favorTeacher',
            data: {
              openid: openid,
              tea_id: tea_id,
              favor_state: 0//不喜欢
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              teacher.splice(index, 1)
              that.setData({
                teacher: teacher
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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
    var openid=wx.getStorageSync('openid');
    //获取收藏的课程
    wx.request({
      url: app.globalData.url +'index/Person/getCollectCourse',
      data:{
        openid:openid
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
    //获取收藏的教练
    wx.request({
      url: app.globalData.url +'index/Person/getFavorTeacher',
      data:{
        openid:openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          teacher: res.data
        })
      }

    })

    //收藏的视频
    wx.request({
      url: app.globalData.url + 'index/Show/myVideoFavor',
      data: {
        openid: openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          video: res.data
        })
      }

    })
  },

  //视频跳转播放
  play: function (e) { 
    var that = this;
    var index = e.currentTarget.dataset.idx;//视频序号
    var video = that.data.video[index];
    console.log(index)
    // console.log('../show_des/show_des?video='+video.video + '&title=' + video.title + '&name=' + video.nickName + '&img=' + video.avatarUrl + '&openid=' + video.openid + '&favor=' + video.favor + '&videoid=' + video.Id)
    wx.navigateTo({
      url: '../../show_des/show_des?video=' + video.video + '&title=' + encodeURIComponent(video.title) + '&name=' + encodeURIComponent(video.nickName) + '&img=' + video.avatarUrl + '&openid=' + video.openid + '&favor=' + video.favor + '&videoid=' + video.Id+'&cover='+encodeURIComponent(video.cover),
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