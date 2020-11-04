// pages/myset/signRecord/signRecord.js
var util = require("../../utils/time-utils.js")
var util_time = require("../../utils/util.js")
var common = require('../../utils/common.js');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    start_time:'',
    deadline:'',
    inputShowed: false,
    inputVal: "",
    cour_id:'',//签到课程id
    sign_people:'',//签到人员列表
    selectWeek: 0,
    timeBean: {},
    time: '',
    judge: false,
    judge_words: '',//点评语
    judge_openid: '',//学员openid
    signId:'',//签到id
    idx:'',//签到序号
  },


  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
    console.log(this.data.inputVal)
  },
//搜索事件
  search:function(){
    var that=this;
    var cour_id=that.data.cour_id;
    var keywords = that.data.inputVal;
    wx.request({
      url: app.globalData.url + 'index/setSign/searchSignRecord',
      data:{
        cour_id:cour_id,
        keywords:keywords
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          sign_people: res.data
        })
      }
    })
  },

  //课程点评
  dianping: function (e) {
    var that = this;
    var judge_openid = e.currentTarget.dataset.openid;
    var sign_id=e.currentTarget.dataset.signid;
    var idx=e.currentTarget.dataset.idx;
    that.setData({
      judge: true,
      judge_openid: judge_openid,
      signId:sign_id,
      idx:idx
    })
  },
  cancel: function () {
    this.setData({
      judge: false
    })
  },
  setValue: function (e) {
    var words = e.detail.value
    this.setData({
      judge_words: words
    })
  },

  confirm: function (e) {
    var that = this;
    var openid = that.data.judge_openid;
    var words = that.data.judge_words;
    var courid = that.data.cour_id;
    var signId=that.data.signId;
    var sign_people = that.data.sign_people;
    var idx=that.data.idx;
    if (!words) {
      wx.showToast({
        title: '您还未填写点评语',
        icon: 'loading',
        duration: 1000
      })
    } else {
      wx.request({
        url: app.globalData.url + 'index/setSign/signJudge',
        data: {
          judge_openid: openid,
          judge_words: words,//点评语 
          cour_id: courid,
          signId:signId//签到id
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) { 
          console.log(res)
          sign_people[idx].judge=true;
          if (res.statusCode == 200) {
            common.judge(4) 
            common.news(2, courid,openid,2)
            wx.showToast({
              title: '点评完成',
              icon: 'success',
              duration: 1000,
              success(res) {
                setTimeout(function () {
                  that.setData({
                    judge: false,
                    sign_people:sign_people
                  })
                }, 1000)
              }
            })
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //接收课程id
    this.setData({
      cour_id:options.cour_id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      timeBean: util.getWeekDayList(this.data.selectWeek),
      time: util_time.formatDate(new Date())//当前时间
    })
    console.log(this.data.time)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      var that=this;
      // var cur_time = util.formatDate(new Date());//获取当前时间
      var cour_id=that.data.cour_id;
      var time = util_time.formatDate(new Date())//当前时间
      that.setData({
        deadline:time,
        start_time:time
      })
      wx.request({
        url: app.globalData.url + 'index/setSign/getSignRecord',
        data: {
          cour_id: cour_id,
          sign_time: time//当前时间
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res){
          console.log(res.data)
          that.setData({
            sign_people:res.data
          })
        }
      })
      
  },
  //选择日期
  bindDateChange:function(e){
    var that=this;
    var cour_id = that.data.cour_id;
    console.log(e)
    this.setData({
      deadline: e.detail.value
    })
    wx.request({
      url: app.globalData.url + 'index/setSign/getSignRecord',
      data: {
        cour_id: cour_id,
        sign_time: e.detail.value//选择的时间
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          sign_people: res.data
        })
      }
    })
  },
  
  /**
    * 选中了某一日，改变selectDay为选中日
    * 根据日期筛选签到人员
    */
  // dayClick: function (e) {
  //   var that = this;
  //   var timeBean = this.data.timeBean
  //   console.log(timeBean)
  //   timeBean.selectDay = e.detail;
  //   timeBean.day = timeBean.weekDayList[e.detail].day
  //   var time = timeBean.yearMonth + '-' + timeBean.day;
  //   console.log('选择的日期为' + time)
  //   //根据日期筛选
  //   var cour_id = that.data.cour_id;
  //   wx.request({
  //     url: app.globalData.url + 'index/setSign/getSignRecord',
  //     data: {
  //       cour_id: cour_id,
  //       sign_time: time//选择的时间
  //     },
  //     header: {
  //       'content-type': 'application/json' // 默认值
  //     },
  //     success(res) {
  //       console.log(res.data)
  //       that.setData({
  //         sign_people: res.data
  //       })
  //     }
  //   })
  //   this.setData({
  //     timeBean,
  //     time: time
  //   })
  // },


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