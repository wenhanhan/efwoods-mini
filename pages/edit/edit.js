// pages/edit/edit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'',//文本框类型
    cate:'',//输入框内容类别
    title:'',//页面标题
    placeholder:'',//输入框提示文字
    send:true,//完成按钮隐藏
    height:'',//完成按钮高度
    input:'',//输入内容
   
  },


input:function(e){
  console.log(e.detail.value)
  this.setData({
    input: e.detail.value
  })
  if(this.data.type==4&&this.data.input.length==10){
    wx.showToast({
      title: '最多输入十个字符',
      icon:'loading',
      duration:1000
    })
  }
  if (this.data.type == 3 && this.data.input.length == 10) {
    wx.showToast({
      title: '最多输入十个字符',
      icon: 'loading',
      duration: 1000
    })
  }
  
},
  save_btn:function(e){
    var input=this.data.input;
    var cate=this.data.cate;//文本框内容类别
    if(!input){
      wx.showToast({
        title: '不能输入空字符',
        icon:'loading',
        duration:1000
      })
    }else{
      wx.setStorageSync(cate, input)
      //返回上一级页面
      wx.navigateBack({
        
      })
    }
  },
  save_sex:function(e){
    var input = this.data.input;
    var cate = this.data.cate;//文本框内容类别
    if (!input) {
      wx.showToast({
        title: '不能输入空字符',
        icon: 'loading',
        duration: 1000
      })
    } else {
      wx.setStorageSync(cate, input)
      //返回上一级页面
      wx.navigateBack({

      })
    }
  },
//保存手机
  save_phone:function(e){
    var input = this.data.input;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(14[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    var cate = this.data.cate;//文本框内容类别
    if (!input) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'loading',
        duration: 1000
      })
    } else if(input.length<11){
      wx.showToast({
        title: '手机号长度有误',
        icon: 'loading',
        duration: 1000
      })
    } else if (!myreg.test(input)){
      wx.showToast({
        title: '手机号格式有误',
        icon: 'loading',
        duration: 1000
      })
    }else{
      wx.setStorageSync(cate, input)
      //返回上一级页面
      wx.navigateBack({

      })
    }
  },
  //保存课程时长
  save_cour_hour:function(e){
    var input = this.data.input;
    var myreg = /^\+?[1-9][0-9]*$/;　　//正整数
    var cate = this.data.cate;//文本框内容类别
    if (!input) {
      wx.showToast({
        title: '时长不能为空',
        icon: 'loading',
        duration: 1000
      })
    } else if (!myreg.test(input)) {
      wx.showToast({
        title: '时长需为整数',
        icon: 'loading',
        duration: 1000
      })
    } else {
      wx.setStorageSync(cate, input)
      //返回上一级页面
      wx.navigateBack({

      })
    }
  },
  //保存课程金额
  save_cour_money:function(e){
    var input = this.data.input;
    var cate = this.data.cate;//文本框内容类别
    if (!input) {
      wx.showToast({
        title: '金额不能为空',
        icon: 'loading',
        duration: 1000
      })
    } else if (input<0) {
      wx.showToast({
        title: '金额非负',
        icon: 'loading',
        duration: 1000
      })
    } else {
      wx.setStorageSync(cate, input)
      //返回上一级页面
      wx.navigateBack({

      })
    }
  },
  //快捷标签
  tag: function (e) {
    var input = this.data.input;
    if ((input + e.detail.name).length > 10) {
      wx.showToast({
        title: '最多十个字符哦',
        icon: 'loading',
        duration: 1000
      })
    } else {
      this.setData({
        input: input + e.detail.name
      })
    }
  },



  //快捷标签
  tea_tag: function (e) {
    var input = this.data.input;
    if ((input + e.detail.name).length > 10) {
      wx.showToast({
        title: '最多十个字符哦',
        icon: 'loading',
        duration: 1000
      })
    } else {
      if(input==''){
        var str=e.detail.name.substr(1)
      }else{
        if(input.indexOf(e.detail.name.substr(1))>=0){
          wx.showToast({
            title: '标签雷同',
            icon: 'loading',
            duration: 1000
          })
          str='';
        }else{
          var str = e.detail.name
        }  
      }
      this.setData({
        input: input + str
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type:options.type*1,
      title:options.title,
      placeholder:options.title,
      cate:options.cate
    })
    wx.setNavigationBarTitle({
      title: this.data.title,
    })
    console.log(this.data.type)
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
    this.setData({
      input:wx.getStorageSync(this.data.cate)
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