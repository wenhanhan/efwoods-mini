// pages/myset/yuyue/yuyue.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'tab1',
    yuyue:[],//预约数据
    // noMoreData: false,//默认更多数据
    // page: 1,//默认加载第一页数据
    state:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  handleChange ({ detail }) {
    var state;
    if(detail.key=='tab1'){
      state=0
    }else if(detail.key=='tab2'){
      state=1
    }else{
      state=2
    }
    this.setData({
      current: detail.key,
      state:state,
      yuyue:[],//预约信息置空
      // page:1,
      // noMoreData: false,
  });
    this.myAppointment(state);
},

myAppointment:function(state){
  var that=this;
  var openid=wx.getStorageSync('openid');
  wx.showLoading({
    title:'加载中'
  })
  wx.request({ 
    url: app.globalData.url + 'index/YuYue/myAppointment',
    data:{
      state:state,
      openid:openid 
    },
    header: {
      'Content-type': 'application/json'
    },
    success(res){
      console.log(Object.values(res.data))
      var data=Object.values(res.data);
      wx.hideLoading({
        complete: (res) => {},
      })
      that.setData({
        yuyue:data
      })
      // var yuyue=that.data.yuyue?that.data.yuyue:[]
      // var lastPageLength = res.data[1];//当前页消息的长度
      // if(lastPageLength<7){
      //   that.setData({
      //     noMoreData: true
      //   })
      // }
      // if(page==1){
      //   that.setData({
      //     yuyue:data
      //   })
      // }else{
      //   that.setData({
      //     yuyue:yuyue.concat(data)
      //   })
      // }
    }
  })
},
yuyue_des:function(e){
  var parent_idx=e.currentTarget.dataset.parentidx;//父数组序号
  var child_idx=e.currentTarget.dataset.childidx;//子数组序号
  var yuyue=this.data.yuyue;
  var cour_name=yuyue[parent_idx].courName;//课程名字
  var cour_address=yuyue[parent_idx].courAddressName;//课程地址
  var cour_location=yuyue[parent_idx].courAddressDes;//详细地址
  var order_id=yuyue[parent_idx].order_id;//订单号
  var lat=yuyue[parent_idx].courLat;//经度
  var long=yuyue[parent_idx].courLong;//纬度
  var cour_phone=yuyue[parent_idx].courContact;//课程电话
  var price=yuyue[parent_idx].price;//课程的价格
  var state=yuyue[parent_idx].yuyue_info[child_idx].state;
  var tab_state=this.data.state;
  var yuyue_date=yuyue[parent_idx].yuyue_info[child_idx].date;//预约日期
  var yuyue_clock=yuyue[parent_idx].yuyue_info[child_idx].clock;//预约时刻
  var pay_total=yuyue[parent_idx].pay_total;//支付的价格
  var order_time=yuyue[parent_idx].time;//预约下单的时间
  var cour_pic=yuyue[parent_idx].courImg;//课程图片
  var tea_name=yuyue[parent_idx].name;//教师姓名
  var cour_id=yuyue[parent_idx].cour_id;//课程id
  wx.navigateTo({
    url: '../yuyue_info/yuyue_info?price='+price+'&cour_name='+cour_name+'&cour_address='+cour_address+'&cour_location='+cour_location+'&lat='+lat+'&long='+long+'&cour_phone='+cour_phone+'&state='+state+'&pay_total='+pay_total+'&order_time='+order_time+'&date='+yuyue_date+'&clock='+yuyue_clock+'&cour_pic='+cour_pic+'&tea_name='+tea_name+'&cour_id='+cour_id+'&order_id='+order_id+'&tab_state='+tab_state,
  })
},
cancel:function(e){
  var that=this;
  var parent_idx=e.currentTarget.dataset.parentidx;//父数组序号
  var child_idx=e.currentTarget.dataset.childidx;//子数组序号
  var id=e.currentTarget.dataset.id;
  var clock=e.currentTarget.dataset.clock;
  var date=e.currentTarget.dataset.date;
  var forbid=e.currentTarget.dataset.forbid;
  var yuyue=that.data.yuyue;
  wx.showModal({
    title: '取消确认',
    content: '是否要取消本次预约',
    success (res) {
      if (res.confirm) {
        wx.request({
          url: app.globalData.url+'index/YuYue/cancelAppointment',
          data:{
            clock:clock,
            date:date,
            id:id,
            forbid:forbid
          },
          header: {
            'Content-type': 'application/json'
          },
          success(res){
            console.log(res.data)
            if(res.data.code==200){
              wx.showToast({
                title: res.data.msg,
                icon:"success",
                duration:1000
              })
              //将取消的数组删除
              yuyue[parent_idx].yuyue_info.splice(child_idx,1);
              if(yuyue.length==1&&yuyue[0].yuyue_info.length==0){
                yuyue=[];
              }
              that.setData({
                yuyue:yuyue
              })
            }else{
              wx.showToast({
                title: res.data.msg,
                icon:"none",
                duration:1000
              })
            }
          }
        })
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
},
judge:function(e){
  var cour_id = e.currentTarget.dataset.courid;//评价课程id
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
        url: '../../judge/judge?cour_id=' + cour_id,
      })
    } 
  }else{
    //返回授权
    app.login()
  }
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
    this.myAppointment(state);
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
    console.log('触底了')
    // var that=this;
    // var page=that.data.page;
    // var noMoreData = that.data.noMoreData;
    // var state=that.data.state;
    // if(!noMoreData){
    //   //继续加载
    //   page++;
    //   console.log(page)
    //   that.myAppointment(state,page)
    //   that.setData({
    //     page:page
    //   })
    // }else{
    //   console.log('加载完全')
    // }
  }
})