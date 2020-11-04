// pages/all_judge/all_judge.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    judge:[],
    judge_img: [],
    cour_id:'',
    com_id: '',//主评论id
    isjudge: false,
    focus: false,
    keyboard_height: 0,
    reply: '',
    tea_id: '',//教师id
    agency_id:'',//机构id
    state: 0,//默认加载某课程的所有评论 1代表教师的所有评论
    cour_openid:'',
    student_openid:''
  }, 


  //图片预览
  previewImage: function (e) {
    var current = e.target.dataset.src;
    var index = e.target.dataset.index;
    console.log(this.data.judge_img[index])
    var arr = new Array();
    
    for(let i in this.data.judge_img[index]){
      if(this.data.judge_img[index][i]){
        arr.push('https://icloudapi.cn/efire/public/uploads/judge/'+this.data.judge_img[index][i])
      }
    }
    
    console.log(arr)
    this.setData({
      judge_img: arr
    })
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.judge_img
    })
  },

  //评价事件
  pingjia: function (e) {
    var cour_id = e.currentTarget.dataset.courid;//评价课程id
    if (app.globalData.freeze == 1) {
      wx.showToast({
        title: '你已被冻结',
        icon: 'loading',
        duration: 2000
      })
    } else { 
      wx.navigateTo({
        url: '../judge/judge?cour_id='+cour_id+'&state=1',
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      cour_id: options.cour_id,
      tea_id: options.tea_id,
      agency_id:options.agency_id,
      state: options.cour_id ? 0 : 1,
      cour_openid:options.cour_openid
    })
    console.log(this.data.cour_id)
    console.log(this.data.state)
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
    var that = this;
    var cour_id = that.data.cour_id;
    var tea_id = that.data.tea_id;
    var agency_id=that.data.agency_id;
    that.setData({
      student_openid:wx.getStorageSync('openid')
    })
    if (cour_id) {
      that.get_judge(cour_id)
    } else if(tea_id) {
      that.get_tea_judge(tea_id)
    }else{
      that.get_agency_judge(agency_id)
    }
  },

  //查询课程所有评论
  get_judge(cour_id) {
    var that = this;
    wx.request({
      url: app.globalData.url + 'index/Course/judgeDes',
      data: {
        cour_id: cour_id,
        page: 2
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          judge_num: res.data[0],
          judge: res.data[1],
          judge_img: res.data[2]
        }) 
      }
    })
  },
  //查询机构所有评论
  get_agency_judge(agency_id){ 
    var that=this;
    wx.request({
      url: app.globalData.url + 'index/Agency/agencyJudgeDes',
      data: {
        agency_id: agency_id,
        page: 2
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.setStorageSync('judge', res.data[0])
        wx.setStorageSync('judge_img', res.data[1])
        console.log(res.data)
        that.setData({
          judge:res.data[0],
          judge_img:res.data[1]
        })
      }
    })
  },

  //获取某教师的所有评价
  get_tea_judge(tea_id) {
    var that = this;
    wx.request({
      url: app.globalData.url + 'index/Teacher/getAllJudge',
      data: {
        tea_id: tea_id,
        page: 2
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          judge_num: res.data[2],
          judge: res.data[0],
          judge_img: res.data[1]
        })
      }
    })
  },

  // 回复评论
  reply: function (e) {
    var userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      //返回授权
      app.login()
    } else {
      console.log('回复评论')
      this.setData({
        isjudge: true,
        focus: true,
        userInfo: userInfo,
        com_id: e.currentTarget.dataset.comid,
        cour_id: e.currentTarget.dataset.courid
      })
    }
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
  replyTxt: function (e) {
    console.log(e.detail.value)
    this.setData({
      reply: e.detail.value
    })
  },

  //提交回复评论
  send: function () {
    var that = this;
    var reply = that.data.reply.trim();//回复内容
    var comId = that.data.com_id;//主评论id
    var openid = wx.getStorageSync('openid')
    var courId = that.data.cour_id;//课程id
    var tea_id = that.data.tea_id;
    var state = that.data.state;
    wx.request({
      url: app.globalData.url + 'index/Person/reply',
      method: 'POST',
      data: {
        openid: openid,
        courId: courId,
        content: reply,
        com_id: comId,
        type: 1
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg,
            icon: res.data.icon,
            duration: 1000
          })
          if (state == 0) {
            that.get_judge(courId)
          } else {
            that.get_tea_judge(tea_id)
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: res.data.icon,
            duration: 1000
          })
        }
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

  }
})