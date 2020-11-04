// pages/myset/set_yuyue/set_yuyue.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'tab1',
    yuyue:[],
    state:0,
    remind:[],//已经提醒的数组
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
    var state=this.data.state;
    this.getAppointment(state)
    this.setData({
      remind:wx.getStorageSync('remind')?wx.getStorageSync('remind'):[]
    })
  },
  handleChange ({ detail }) {
    var state;
    if(detail.key=='tab1'){
      state=0
    }else if(detail.key=='tab2'){ 
      state=1;
    }else{
      state=2;
    }
    this.setData({
        current: detail.key,
        state:state,
        yuyue:[]
    });
    this.getAppointment(state) 
},

getAppointment:function(state){
  var that=this;
  var openid=wx.getStorageSync('openid');
  wx.showLoading({
    title:'加载中'
  })
  wx.request({ 
    url: app.globalData.url +'index/YuYue/appointmentManage',
    data:{
      openid:openid,
      state:state
    }, 
    header: {
      'Content-type': 'application/json'
    },
    success(res){
      console.log(res.data)
      wx.hideLoading({
        complete: (res) => {},
      })
      that.setData({
        yuyue:res.data
      })
    }
  })
},
//开课提醒
reminder:function(e){
  var that=this;
  var yuyue=that.data.yuyue;
  var idx=e.currentTarget.dataset.idx;
  var state=e.currentTarget.dataset.state;
  var remind=wx.getStorageSync('remind')?wx.getStorageSync('remind'):[]
  console.log(remind)
  if(state==0){
    wx.showToast({
      title: '请在开课前30分钟之内提醒',
      icon:'none',
      duration:1000
    })
    return 
  }
  //判断是否已提醒
  for(var i=0;i<remind.length;i++){
    if(remind[i].date==yuyue[idx].date&&remind[i].clock==yuyue[idx].clock){
      wx.showToast({
        title: '请勿重复提醒',
        icon:'none',
        duration:1000
      })
      return
    }
  }
  wx.request({
    url: app.globalData.url+'index/YuYue/remindOpening',
    method:'POST',
    data:{
      cour_name:yuyue[idx].cour_name,
      tea_name:yuyue[idx].tea_name,
      date:yuyue[idx].date,
      clock:yuyue[idx].clock,
      address:yuyue[idx].cour_address,
      touser:yuyue[idx].xueyuan
    },
    header: {
      'Content-type': 'application/json'
    },
    success(res){
      console.log(res.data)
      var item={
        date:yuyue[idx].date,
        clock:yuyue[idx].clock
      }
      remind.push(item)
      wx.setStorageSync('remind', remind)
      wx.showToast({
        title: '已提醒',
        icon:'success',
        duration:1000
      })
    }
  })
},
yuyue_des:function(e){
  var yuyue=this.data.yuyue;
  var idx=e.currentTarget.dataset.idx;
  var state=this.data.state;//预约的状态
  var date=yuyue[idx].date;
  var clock=yuyue[idx].clock;
  var cour_id=yuyue[idx].cour_id;
  wx.navigateTo({
    url: '../set_yuyue_info/set_yuyue_info?cour_id='+cour_id+'&date='+date+'&clock='+clock+'&state='+state,
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