// pages/myset/personal/personal.js
var app = getApp();
const { $Toast } = require('../../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    identity:'',//身份
    sexArr: ['女','男'],//0是女  1是男
    tea_ageArr: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40],
    par_sex_index:'',
    par_name:'',
    par_sex:'',
    phone:'',
    child_name:'',
    child_age:'',
    child_sex:'',
    child_hobby:'',
    child_honor:'',
    child_honor1:'',
    //授课信息
    field_type_arr: '',//类别数组
    field:'',//授课类别
    field_index:'',
    agency:'',
    introduce:'',
    introduce1:'',//新增为了显示效果
    honor:'',
    honor1:'',
    experience:'',
    all_experience:'',//经历 显示完全
    tea_age:'',//教龄
    tea_age_index:'',
    tag:'',
    //教师位置信息
    province:'',//省
    city:'',//市
    district:'',//区
    latitude: '',//经度
    longitude: '',//纬度
    tea_img: [],
    apply_type:[],//授课类别
    percent: 0,//上传进度
    progress_state: true,
    tea_img:''
  },

  // 截取字符串,多余省略号显示
  substr: function (val) {
    if (val.length == 0 || val == undefined) {
      return '';
    } else if (val.length > 12) {
      return val.substring(0, 16) + "...";
    } else {
      return val;
    }
  },
  //点击输入事件
  input: function (e) {
    console.log(e)
    var type = e.currentTarget.dataset.type;
    var title = e.currentTarget.dataset.title;
    var cate = e.currentTarget.dataset.cate;
    console.log(type)
    wx.navigateTo({
      url: '../../edit/edit?type=' + type + '&title=' + title + '&cate=' + cate
    })
  },
  //个人信息 性别选择
  par_sex:function(e){
    var that=this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      par_sex_index: e.detail.value,
      par_sex: e.detail.value
    })
  },
  //子女性别选择
  child_sex: function (e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      child_sex: e.detail.value
    })
  },
  field: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log(e)
    console.log('真实的领域为' + this.data.field_type_arr[e.detail.value].Id)
    var field = this.data.field_type_arr[e.detail.value].Id;
    this.setData({
      field_index: e.detail.value,
      field: field
    })
  },
  //教龄操作
  tea_age: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      tea_age_index: e.detail.value,
      tea_age: e.detail.value * 1 + 1
    })
    console.log(this.data.tea_age)
  },



  previewImage: function (e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  },
  handleLoading() {
    $Toast({
      content: '正在上传',
      type: 'loading',
      duration:0
    });
  },
  hide(){
    $Toast.hide();
  },
  handleSuccess() {
    $Toast({
      content: '上传成功',
      type: 'success'
    });
  },
   //去除字符串前后空格
   trim: function (str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
  },
  //教师头像上传
  tea_img:function(){
    var that=this;
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths
        that.handleLoading()
        wx.uploadFile({
          url: app.globalData.url+'index/Agency/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'file': 'test'
          },
          success(res) {
            const data = res.data
            console.log(res.data)
            that.hide()
            that.handleSuccess()
            wx.setStorageSync('apply_tea_img',that.trim(res.data) )
            that.setData({ 
              tea_img:that.trim(res.data)
            })
          }
        })
      }
    })
  },

//点击提交事件
upload:function(){
  var that=this;
  var openid=wx.getStorageSync('openid');
  var identity=that.data.identity;//上传者身份
  var tea_img=that.data.tea_img;
  var sex=that.data.sexArr[that.data.par_sex_index];
  console.log(sex)
  console.log(tea_img)
  //条件检验
  if (!that.data.par_name){
    wx.showToast({
      title: '请填写姓名信息',
      icon:'loading',
      duration:1000
    })
  }else if(!sex){
    wx.showToast({
      title: '请填写性别信息',
      icon: 'loading',
      duration: 1000
    })
  }else if(!that.data.phone){
    wx.showToast({
      title: '请填写电话信息',
      icon: 'loading',
      duration: 1000
    })
  }else if(!that.data.child_name&&identity==0){
    wx.showToast({
      title: '请填写子女姓名',
      icon: 'loading',
      duration: 1000
    })
  }else if(!that.data.child_age&&identity==0){
    wx.showToast({
      title: '请填写子女年龄',
      icon: 'loading',
      duration: 1000
    })
  }else if(!that.data.child_sex&&identity==0){
    wx.showToast({
      title: '请填写子女性别',
      icon: 'loading',
      duration: 1000
    })
  }else if(!that.data.child_hobby&&identity==0){
    wx.showToast({
      title: '请填写子女爱好',
      icon: 'loading',
      duration: 1000
    })
  }else if(!that.data.child_honor&&identity==0){
    wx.showToast({
      title: '请填写获奖信息',
      icon: 'loading',
      duration: 1000
    })
  } else  if (!that.data.field && identity == 1){
    wx.showToast({
      title: '请填写授课领域',
      icon: 'loading',
      duration: 1000
    })
  } else if (!that.data.agency && identity == 1){
    wx.showToast({
      title: '请填写所属机构',
      icon: 'loading',
      duration: 1000
    })
  } else if (!that.data.introduce && identity == 1){
    wx.showToast({
      title: '请填写个人简介',
      icon: 'loading',
      duration: 1000
    })
  }else if(!that.data.honor&& identity == 1){
    wx.showToast({
      title: '请填写荣耀资质',
      icon: 'loading',
      duration: 1000
    })
  } else if (!that.data.experience && identity == 1){
    wx.showToast({
      title: '请填写工作经历',
      icon: 'loading',
      duration: 1000
    })
  } else if (!that.data.tea_age && identity == 1){
    wx.showToast({
      title: '请填写教龄',
      icon: 'loading',
      duration: 1000
    })
  } else if (!that.data.tag && identity == 1){
    wx.showToast({
      title: '请填写个人标签',
      icon: 'loading',
      duration: 1000
    })
  }
  else if (!tea_img&& identity == 1){
    wx.showToast({
      title: '请上传缩略图',
      icon: 'loading',
      duration: 1000
    })
  }else{
    //开始提交
    wx.showLoading({
      title: '正在保存',
    })
    console.log(that.data.child_sex)
    wx.request({
      url: app.globalData.url + 'index/index/editPerInfo',
      method:'POST',
      data: {
        openid: openid,
        name: that.data.par_name,
        sex: that.data.par_sex_index,
        phone: that.data.phone,
        childName: that.data.child_name,
        childAge: that.data.child_age,
        childSex: that.data.child_sex,
        childHobby: that.data.child_hobby,
        childHonor: that.data.child_honor1,
        //授课信息（根据身份显示）
        field: that.data.field,
        agency: that.data.agency,
        introduce: that.data.introduce1,
        honor: that.data.honor1,
        experience: that.data.all_experience,
        tea_age: that.data.tea_age,
        tag: that.data.tag,
        address:that.data.province+that.data.city+that.data.district,
        latitude: that.data.latitude,
        longitude: that.data.longitude,
        tea_img:tea_img
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000,
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
      }
    })
  }
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //将授课信息返回
    var that=this;
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: app.globalData.url +'index/Teainfo/teaInfo',
      data:{
        openid:openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
       console.log(res.data)
        var field_index;
        wx.setStorageSync('apply_field', res.data[1].field)
        var apply_type=wx.getStorageSync('apply_type')
        for(var i=0;i<apply_type.length;i++){
          if(apply_type[i].Id==res.data[1].field){
            field_index=i;
            console.log(i)
          }
        }

        that.setData({
          par_name:res.data[0].name,
          par_sex_index:res.data[0].sex,
          phone:res.data[0].phone,
  
          field: res.data[1].field,
          field_type_arr: apply_type,
          field_index: field_index,
          tea_img:res.data[1].teaImg,//缩略图
          agency:that.substr(res.data[1].agency),
          introduce: that.substr(res.data[1].introduce),
          introduce1:res.data[1].introduce,
          honor: that.substr(res.data[1].honor),
          honor1:res.data[1].honor,
          experience: that.substr(res.data[1].experience),
          all_experience:res.data[1].experience,
          tea_age_index:res.data[1].teaAge-1,
          tea_age: that.substr(res.data[1].teaAge),
          tag:res.data[1].tag
        })
      }
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
    var that=this; 
    
    var field_index;
    var apply_type = wx.getStorageSync('apply_type')
    console.log(apply_type)
    var field = wx.getStorageSync('apply_field')
    for (var i = 0; i < apply_type.length; i++) {
      if (apply_type[i].Id == field) {
        field_index = i;
        console.log('fuck')
        console.log(i)
      }
    }
    this.setData({
      identity: app.globalData.identity,//判断身份
      par_name: wx.getStorageSync('par_name') ? wx.getStorageSync('par_name'):that.data.par_name,
      par_sex_index:that.data.par_sex_index,
      phone: wx.getStorageSync('phone') ? wx.getStorageSync('phone'):that.data.phone,
      tea_age_index: that.data.tea_age_index,
      child_name:wx.getStorageSync('child_name'),
      child_age: wx.getStorageSync('child_age'),

      field_type_arr: wx.getStorageSync('apply_type'),
      field_index:field_index,

      agency: wx.getStorageSync('agency') ? wx.getStorageSync('agency'):that.data.agency,
      introduce: this.substr(wx.getStorageSync('introduce')?wx.getStorageSync('introduce'):that.data.introduce),
      introduce1: wx.getStorageSync('introduce') ? wx.getStorageSync('introduce') : that.data.introduce1,
      honor: this.substr(wx.getStorageSync('honor') ? wx.getStorageSync('honor'):that.data.honor),
      honor1: wx.getStorageSync('honor') ? wx.getStorageSync('honor') : that.data.honor1,
      experience: this.substr(wx.getStorageSync('experience') ? wx.getStorageSync('experience'):that.data.experience),

      all_experience: wx.getStorageSync('experience') ? wx.getStorageSync('experience'):that.data.all_experience,//上传数据库完整信息

      child_hobby: this.substr(wx.getStorageSync('child_hobby')),
      child_honor: this.substr(wx.getStorageSync('child_honor')),
      child_honor1:wx.getStorageSync('child_honor'),
      tag: this.substr(wx.getStorageSync('tag') ? wx.getStorageSync('tag'):that.data.tag),
      province:wx.getStorageSync('address').province,
      city:wx.getStorageSync('address').city,
      district:wx.getStorageSync('address').district,
      latitude: wx.getStorageSync('address').location.lat,
      longitude: wx.getStorageSync('address').location.lng
    })
    console.log(this.data.identity)
    console.log(that.data.honor1)
  },
  //获取手机号
  getPhoneNumber: function (e){
    if (e.detail.errMsg == "getPhoneNumber:fail user deny") return;
    //用户允许授权
    console.log("lv", e.detail.iv);
    console.log(e.detail.encryptedData);
    wx.showLoading({
      title: '请稍后～',
    })
    var self = this;
    //1. 调用登录接口获取临时登录code
    wx.login({
      success: res => {
        if(res.code){
          //2. 访问登录凭证校验接口获取session_key、openid
          wx.request({
            url: app.globalData.url + 'index/index/getUserOpenid',
            data:{
              code:res.code
            },
             header: {
              'content-type': 'application/json' // 默认值
            },
            success(res){
              console.log(res)
              //3.解密
              if (res.statusCode == 200) {
                wx.request({
                  url: app.globalData.url +'index/Phone/getPhoneNumber',
                  data:{
                    'encryptedData': e.detail.encryptedData,
                    'iv': e.detail.iv,
                    'session_key': res.data.session_key
                  },
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success(res1){
                    wx.hideLoading()
                    console.log(res1)
                    console.log(res1.data.phoneNumber)
                    if (res1.statusCode == 200 && res1.data.phoneNumber) {
                      self.setData({
                        phone: res1.data.phoneNumber
                      })
                    }
                  },
                    fail: function (err) {
                    console.log(err);
                  }
                })
              }
            }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})