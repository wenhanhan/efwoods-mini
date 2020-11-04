// pages/myset/editYuyue/editYuyue.js
const { $Toast } = require('../../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_pay : false,//是否付费
    is_coupon:false,//是否可用优惠券
    max_stu:-1,//最大预约人数，-1不限制
    duration:'',//单节课程时长
    before_time: 10,
    end_time:10,
    // array: [30, 45, 60],
    // index: 0,
    clock_arr:[
      {
        date:[
          {
            day:'周一',
            state:true
          },
          {
            day:'周二',
            state:true
          },
          {
            day:'周三',
            state:true
          },
          {
            day:'周四',
            state:true
          },
          {
            day:'周五',
            state:true
          },
          {
            day:'周六',
            state:true
          },
          {
            day:'周日',
            state:true
          }
        ],
        multiArray:[
          ['06:00', '06:30','07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:30','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:00','23:30',],
          ['06:00', '06:30','07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:30','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:00','23:30',],
         ],
         multiIndex:[0, 33]
      },

    ],//最终选择的日期数组
    time_idx:'',//点击增加的日期数组序号
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
    //查询预约设置状态
    var is_set_yuyue=wx.getStorageSync('is_set_yuyue');
    if(is_set_yuyue){
      //读取上次保存的预约配置
      this.setData({
        is_pay:wx.getStorageSync('is_yuyue_pay'),
        is_coupon:wx.getStorageSync('is_yuyue_coupon'),
        max_stu:wx.getStorageSync('max_stu'),
        // duration:wx.getStorageSync('duration'),
        before_time:wx.getStorageSync('forbid_app_time'),
        end_time:wx.getStorageSync('forbid_cancel_time'),
        clock_arr:JSON.parse(wx.getStorageSync('time_set'))
      })

    }else{
      //才用系统默认方式初始化
      console.log('采用系统默认方式')
    }
  },
  input:function(e){
    this.setData({
      max_stu:e.detail.value?e.detail.value:-1
    })
  },
  pay(event){
    const detail = event.detail;
    this.setData({
        'is_pay' : detail.value
    })
    
},
coupon(event){
  const detail = event.detail;
  this.setData({
      'is_coupon' : detail.value
  })
},
//课程开始前n分钟无法预约
forbid_yuyue ({ detail }) {
  this.setData({
      before_time: detail.value
  })
},
forbid_cancel ({ detail }) {
  this.setData({
      end_time: detail.value
  })
},
// duration: function(e) {
//   console.log('picker发送选择改变，携带值为', e.detail.value)
//   this.setData({
//       index: e.detail.value
//   })
// },
bindMultiPickerChange: function (e) {
  console.log('picker发送选择改变，携带值为', e.detail.value)
  if(e.detail.value[0]>=e.detail.value[1])
  {
    $Toast({
      content: '请检查开课时间'
  });
    return
  }
  var time_idx=this.data.time_idx;
  var arr=this.data.clock_arr;
  arr[time_idx].multiIndex=e.detail.value
  this.setData({
    clock_arr:arr
  })
},
bindMultiPickerColumnChange: function (e) {
  console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
  var time_idx=this.data.time_idx;
  var data = {
    multiArray: this.data.clock_arr[time_idx].multiArray,
    multiIndex: this.data.clock_arr[time_idx].multiIndex
  };
  data.multiIndex[e.detail.column] = e.detail.value;
  console.log(data.multiIndex);
  this.setData(data);
},
picker:function(e){
  console.log(e)
  this.setData({
    time_idx:e.currentTarget.dataset.tidx
  })
},
//选择周几
select_week:function(e){
  var idx=e.currentTarget.dataset.idx;//当前选择的日期序号
  var clock_idx=e.currentTarget.dataset.cidx;//增加的时间数组序号
  var clock_arr=this.data.clock_arr;
  clock_arr[clock_idx].date[idx].state=!clock_arr[clock_idx].date[idx].state;
  this.setData({
    clock_arr:clock_arr
  })
  console.log(clock_arr)
},
//添加开课时间
add_time:function(){
  var clock_arr=this.data.clock_arr;
  if(clock_arr.length==7){
    $Toast({
      content: '请勿添加重复开课日期'
  });
    return;
  }
  var date=[
    {
      day:'周一',
      state:false
    },
    {
      day:'周二',
      state:false
    },
    {
      day:'周三',
      state:false
    },
    {
      day:'周四',
      state:false
    },
    {
      day:'周五',
      state:false
    },
    {
      day:'周六',
      state:false
    },
    {
      day:'周日',
      state:false
    }
  ]
  var multiArray= [
     ['06:00', '06:30','07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:30','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:00','23:30',],
     ['06:00', '06:30','07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:30','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:00','23:30',],
    ]
  var multiIndex=[0, 33]
  var clock_arr=this.data.clock_arr;
  var arr={
    date:date,
    multiArray:multiArray,
    multiIndex:multiIndex
  }
  clock_arr.push(arr)
  console.log(clock_arr)
  this.setData({
    clock_arr:clock_arr
  })
},
//保存函数
  save:function(){
    var that=this;
    var clock_arr=that.data.clock_arr;
    var max_stu=that.data.max_stu;
    if(max_stu==0){
      $Toast({
        content: '最大预约人数不为0'
    });
    return
    }
    var week=[];//选择的周数组
    clock_arr.forEach((val,idx,arr) => {
      val.date.forEach((value,index,array)=>{
        // console.log(value)
        if(value.state){
          week.push(index)
        }
      })
    });
    console.log(week)
    if(week.length==0){
      $Toast({
        content: '请添加开课日期'
    });
    }else{
      if(that.isRepeat(week)){
        $Toast({
          content: '存在重复开课日期!'
      });
      }else{
        $Toast({
          content: '正在保存',
          type: 'loading',
          duration:0
      });
      //剔除无效的数组
      for(var i=0;i<clock_arr.length;i++){
        for(var j=0,t=0;j<clock_arr[i].date.length;j++){
          console.log(clock_arr[i].date[j].state)
          if(!clock_arr[i].date[j].state){
            t++;
          }
        }
        // console.log(i)
        // console.log(t)
        if(t==7){
          //将无效数组剔除
          clock_arr.splice(i,1)
          console.log(clock_arr)
          that.setData({
            clock_arr:clock_arr
          })
        }
      }
      console.log(clock_arr)
      //将设置内容放在缓存
      wx.setStorageSync('is_yuyue_pay', that.data.is_pay)
      wx.setStorageSync('is_yuyue_coupon', that.data.is_coupon)
      wx.setStorageSync('max_stu',parseInt(that.data.max_stu))
      // wx.setStorageSync('duration', that.data.array[that.data.index])
      wx.setStorageSync('forbid_app_time', that.data.before_time)
      wx.setStorageSync('forbid_cancel_time', that.data.end_time)
      wx.setStorageSync('time_set',JSON.stringify(clock_arr))
      //设置预约设置状态  点击保存表示已更改
      wx.setStorageSync('is_set_yuyue', true)
      setTimeout(function(){
        $Toast.hide();
        $Toast({
          content: '保存成功',
          type: 'success'
      });
      wx.navigateBack({
        delta:1
      })
      },1000)
      }
    }
    
  },
  //判断数组中有无重复的元素 有重复返回true
  isRepeat:function(arr){
    var hash = {};
    for(var i in arr) {
        if(hash[arr[i]]) //hash 哈希
            return true;
            hash[arr[i]] = true;
        }
    return false;
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