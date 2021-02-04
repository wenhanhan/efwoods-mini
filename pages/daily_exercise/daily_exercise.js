// pages/daily_exercise/daily_exercise.js
var app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    top_bar_height:'',
    swiper_height:'',
    is_fixed:false,
    currentTab: 0,
    currentClass:0,
    grade:0,
    category:[
      {
        grade:'小学',
        class:['一年级','二年级','三年级','四年级','五年级','六年级'],
        video:[
          {

          }
        ],
        selected:0
      },
      {
        grade:'初中',
        class:['初一','初二','初三'],
        video:[
          {

          }
        ],
        selected:0
      },
      {
        grade:'高中',
        class:['高一','高二','高三'],
        video:[
          {

          }
        ],
        selected:0
      }
    ],
    video:[
      {
        name:'',
        title:'',
        duration:'',
        join_num:'',
        cover:'',
        id:''
      }
    ]
  },
//滑动切换
swiperTab: function (e) {
  var that = this;
  that.setData({
    currentTab: e.detail.current,
    grade:e.detail.current,
    currentClass:0
  });
  var grade=that.data.category[e.detail.current].class[0]
  that.getVideo(grade,e.detail.current)
},
//点击切换
clickTab: function (e) {
  var that = this;
  if (this.data.currentTab === e.target.dataset.current) {
    return false;
  } else {
    that.setData({
      currentTab: e.target.dataset.current,
      grade:e.target.dataset.current,
      currentClass:0
    })
    //加载默认的视频
    var grade=that.data.category[e.target.dataset.current].class[0]
    that.getVideo(grade,e.target.dataset.current)
  }
},
//切换年级
selectGrade:function(e){
  var that=this;
  if(this.data.currentClass===e.target.dataset.current){return;}
  this.setData({
    currentClass:e.target.dataset.current
  })
  var arr=that.data.category;
  var grade=arr[that.data.grade].class[e.target.dataset.current]
  //加载视频
  that.getVideo(grade,that.data.currentTab)
},
//切换视频
getVideo(grade,tab_index){
  var that=this;
  var cate=that.data.category;
  wx.request({
    url: app.globalData.url + 'index/Dailyexercise/getAllVideo',
    data: {
      grade: grade
    },
    header: {
      'content-type': 'application/json' // 默认值 
    },
    success(res) {
        cate[0].video=res.data[0]
        cate[1].video=res.data[1]
        cate[2].video=res.data[2]
      cate[tab_index].video=res.data[3]
      that.setData({
        category:cate,
      })
    }
  })
},
view:function(e){
  var video_id=e.currentTarget.dataset.id;
  wx.navigateTo({
    url: '../daily_exercise_des/daily_exercise_des?video_id='+video_id,
  })
},
onPageScroll: function(res) {
  // console.log(res);
  var swiper_height=this.data.swiper_height
  if(res.scrollTop>=swiper_height){
    //将导航栏定位
    this.setData({
      is_fixed:true
    })
  }else{
    this.setData({
      is_fixed:false
    })
  }
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    let query = wx.createSelectorQuery();
    query.select('#swiper').boundingClientRect(
      (rect) => {
        let top = rect.top;//轮播图距离上边界的大小
        this.setData({
          top_bar_height: top
        })
        console.log('顶部导航高度' + top)
      }
    ).exec();
    query.select('#tab_bar').boundingClientRect(
      (rect) => {
        let top = rect.top;//筛选导航距离上边界的大小
        this.setData({
          swiper_height: top-this.data.top_bar_height
        })
        console.log('轮播图高度' + this.data.swiper_height)
      }
    ).exec();
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
    that.getVideo('一年级',0)
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