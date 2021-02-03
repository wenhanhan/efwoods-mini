// package3/summer_camp_shaixuan/summer_camp_shaixuan.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    opt_idx:0,//默认选择项
    btn_idx:0,
    isIphoneX:false,
    option:[
      {
        topic:'营期',
        opt:['不限','2天','3天','4天','5天','6天','7天','8天','9天','10天','11天','12天'],
        selected:0
      },
      {
        topic:'主题',
        opt:['不限','体育','研学','艺术','心智','英语','亲子','体能'],
        selected:0
      },
      {
        topic:'招生对象',
        opt:['不限','3~5岁','6~12岁','13~15岁','16~18岁','19~22岁','成人以上',''],
        selected:0
      },
      {
        topic:'分类',
        opt:['不限','国际游学','国内冬令营','国内夏令营','研学旅行','假日活动','',''],
        selected:0
      },
      {
        topic:'价格区间',
        opt:['不限','0~1000','1000~3000','3000~6000','6000~10000','10000~15000','15000~20000','20000以上'],
        selected:0
      }
    ]
  },
  //筛选算法
  select:function(e){
    var opt_idx=e.currentTarget.dataset.optidx;
    var btn_idx=e.currentTarget.dataset.btnidx;
    var arr=this.data.option;
    arr[opt_idx].selected=btn_idx
    this.setData({
      option:arr
    })
  },
  //重置选项
  reset:function(){
    var arr=this.data.option;
    arr.forEach((item,index,array)=>{
      array[index].selected=0
    })
    this.setData({
      option:arr
    })
  },
  //提交
  sub:function(){
    var arr=this.data.option;
    var b=[]
    for(var i=0;i<arr.length;i++){
     b.push(arr[i].opt[arr[i].selected])
    }
    console.log(b)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var isIphoneX = app.globalData.isIphoneX;
    this.setData({
      isIphoneX: isIphoneX
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