// pages/daily_exercise_ranking/daily_exercise_ranking.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [['小学','初中','高中'], ['一年级', '二年级','三年级','四年级','五年级','六年级']],
    multiIndex: [0, 0],
    cate_index:0,
    period_index:0,
    scroll_height: 0,
    category:['平板支撑','仰卧起坐','体前屈'],
    period:['当天','本周','本月'],
    type:[
      {
        grade:'小学',
        class:['一年级','二年级','三年级','四年级','五年级','六年级']
      },
      {
        grade:'初中',
        class:['初一','初二','初三']
      },
      {
        grade:'高中',
        class:['高一','高二','高三']
      }
    ],
    ranking_list:[
      {
        ranking:1,
        avatar:'/img/head.jpeg',
        name:'文寒',
        time:'10分钟'
      },
      {
        ranking:2,
        avatar:'/img/head.jpeg',
        name:'文寒',
        time:'10分钟'
      },
      {
        ranking:3,
        avatar:'/img/head.jpeg',
        name:'文寒',
        time:'10分钟'
      },
      {
        ranking:4,
        avatar:'/img/head.jpeg',
        name:'文寒',
        time:'10分钟'
      },
      {
        ranking:5,
        avatar:'/img/head.jpeg',
        name:'文寒',
        time:'10分钟'
      },
      {
        ranking:6,
        avatar:'/img/head.jpeg',
        name:'文寒',
        time:'10分钟'
      },
      {
        ranking:7,
        avatar:'/img/head.jpeg',
        name:'文寒',
        time:'10分钟'
      },
      
    ]
  },
  // 年级大类
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
        multiIndex: e.detail.value
    })
},
bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var multiArray = this.data.multiArray,
        multiIndex = this.data.multiIndex
    // console.log(e.detail)
    multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
        case 0:
            switch (multiIndex[0]) {
                case 0:
                    multiArray[1] = ['一年级', '二年级','三年级','四年级','五年级','六年级'];
                    break;
                case 1:
                    multiArray[1] = ['初一', '初二', '初三'];
                    break;
                case 2:
                    multiArray[1] = ['高一', '高二', '高三'];
                    break;

            }
    }
    console.log(multiIndex);
    this.setData({
        multiArray,
        multiIndex
    }
    );
},
  //切换锻炼类目
  bindCategory: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      cate_index: e.detail.value
    })
  },
  //切换排名周期
  bindPeriod: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      period_index: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
    this.setData({
      scroll_height: windowHeight * 750 / windowWidth - 290 - 30
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