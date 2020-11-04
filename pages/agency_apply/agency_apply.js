// pages/agency/agency.js
const app = getApp()
const { $Toast } = require('../../dist/base/index');
// const { $Success } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    agency_name:'',
    agency_address:'',
    agency_location:'',//机构详细地址
    agency_con_user:'',//机构联系人
    agency_phone:'',//机构联系电话
    agency_intro:'',//机构简介
    agency_type:'',//机构类别
    agency_license:'https://cdn.icloudapi.cn/license.jpg',//机构营业执照
    agency_logo:'https://cdn.icloudapi.cn/agency_logo.jpg',//机构logo
    agency_lat:'',//机构经度
    agency_long:'',//机构纬度
    agree: '已阅读并同意',
    isAgree: false,
    license:'',
    logo:'',
    field_type_arr: '',//类别数组
    field: '',//授课类别
    field_index: '',
    invite_openid: '',
    random: '',
    agency_img:[],//机构场馆图片
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
  //同意条款
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
    console.log(this.data.isAgree)
  },
  //机构名字
  agency_name:function(e){
    this.setData({
      agency_name:e.detail.value
    })
  },
  //机构电话
  agency_phone:function(e){
    this.setData({
      agency_phone:e.detail.value
    })
  },
  //机构联系人
  agency_con_user:function(e){
    this.setData({
      agency_con_user:e.detail.value
    })
  },
  //机构简介
  agency_intro:function(e){
    this.setData({
      agency_intro:e.detail.value
    })
  },
  agency_type:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log(e)
    console.log('真实的领域为' + this.data.field_type_arr[e.detail.value].Id)
    var field = this.data.field_type_arr[e.detail.value].Id;
    this.setData({
      field_index: e.detail.value,
      field: field
    })
  },
  //机构地址选择
  location: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          agency_address: res.name,//只在前台显示
          agency_location: res.address,
          agency_lat: res.latitude,
          agency_long: res.longitude
        })
      },
    })
  },
  //营业执照上传
  license_upload:function(){
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
            that.setData({ 
              agency_license:that.trim(res.data),
              license:that.trim(res.data)
            })
          }
        })
      }
    })
  },
  //去除字符串前后空格
  trim: function (str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
  },
  //营业执照预览
  lic_preview:function(e){
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  },

  //企业logo上传
  logo_upload:function(){
    var that = this;
    wx.chooseImage({
      success(res) {
       that.handleLoading()
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.globalData.url + 'index/Agency/upload', //仅为示例，非真实的接口地址
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
            that.setData({
              agency_logo: that.trim(res.data),
              logo: that.trim(res.data)
            })
          }
        })
      }
    })
  },
  upload:function(){
    var that=this;
    var img=that.data.agency_img;
    wx.chooseImage({
      success(res) {
       that.handleLoading()
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.globalData.url + 'index/Agency/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'file': 'test'
          },
          success(res) {
            console.log(res.data)
            that.hide()
            that.handleSuccess()
            img.push(that.trim(res.data))
            that.setData({
              agency_img:img
            })
          }
        })
      }
    })
  },
  //logo预览
  logo_preview: function (e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  },
  //机构场馆图片yulan
  preview:function(e){
    var img=this.data.agency_img;
    var src=e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: img // 需要预览的图片http链接列表
    })
  },
  //删除机构图片
  delete:function(e){
    var img=this.data.agency_img;
    var index=e.currentTarget.dataset.index;
    img.splice(index,1)
    this.setData({
      agency_img:img
    })
  },
  //提交申请信息
  submit:function(e){
    var that=this;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(14[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    var formId = e.detail.formId;//表单id
    var invite_openid = that.data.invite_openid;//分享教师openid
    var random = that.randomWord(false, 5);//随机码
    var openid=wx.getStorageSync('openid');
    var agency_name=that.data.agency_name;
    var agency_con_user=that.data.agency_con_user;
    var agency_address=that.data.agency_address;
    var agency_location=that.data.agency_location;
    var agency_lat=that.data.agency_lat;
    var agency_long=that.data.agency_long;
    var agency_phone=that.data.agency_phone;
    var agency_intro=that.data.agency_intro;
    var field=that.data.field;
    var license=that.data.license;
    var logo=that.data.logo;
    var isAgree=that.data.isAgree;
    var agency_img=JSON.stringify(that.data.agency_img)
    //直辖市 省 字段处理
    var str = ['上海市', '北京市', '天津市', '重庆市'];
    for (var i = 0; i < str.length; i++) {
      if (agency_location.indexOf(str[i]) != -1) {
        agency_location = str[i] + agency_location;
      }
    }
    if(!agency_name){
      wx.showToast({
        title: '请检查机构名称',
        icon:'loading',
        duration:1000
      })
    }else if(!agency_address){
      wx.showToast({
        title: '请选择机构地址',
        icon: 'loading',
        duration: 1000
      })
    }else if(!agency_con_user){
      console.log(agency_con_user)
      wx.showToast({
        title: '请填写联系人',
        icon: 'loading',
        duration: 1000
      })
    } else if (!agency_phone) {
      wx.showToast({
        title: '请填写联系电话',
        icon: 'loading',
        duration: 1000
      })
    } else if (agency_phone.length < 11) {
      wx.showToast({
        title: '手机号长度有误',
        icon: 'loading',
        duration: 1000
      })
    } else if (!myreg.test(agency_phone)) {
      wx.showToast({
        title: '手机号格式有误',
        icon: 'loading',
        duration: 1000
      })
    }else if(!field){
      wx.showToast({
        title: '请选择机构类别',
        icon: 'loading',
        duration: 1000
      })
    }else if(!license){
      wx.showToast({
        title: '请上传营业执照',
        icon: 'loading',
        duration: 1000
      })
    }else if(!logo){
      wx.showToast({
        title: '请上传展示图',
        icon: 'loading',
        duration: 1000
      })
    } else if (!isAgree){
      wx.showToast({
        title: '请选择用户协议',
        icon: 'loading',
        duration: 1000
      })
    }else{
      console.log('开始提交')
      wx.requestSubscribeMessage({
        tmplIds: ['NnwCHaTeBAPxKabJB4p8dkTSxuNgPwLdHddBhPSRAq8'],
        complete(res1){
          wx.request({
            url: app.globalData.url+'index/Agency/uploadAgency',
            method: 'POST',
            data:{
              formId: formId,//申请表单id
              invite_openid: invite_openid,//分享人的openid
              random: random,//随机数
              agency_name:agency_name,
              agency_address:agency_address,
              agency_location:agency_location,
              agency_lat:agency_lat,
              agency_long:agency_long,
              agency_con_user:agency_con_user,
              field:field,
              agency_phone:agency_phone,
              agency_intro:agency_intro,
              agency_license:license,
              agency_logo:logo,
              openid:openid,
              agency_img:agency_img
            },
            header: {
              'content-type': 'application/json' // 默认值1
            },
            success(res){
              console.log(res.data)
              if(res.data.code==200){
                wx.showToast({
                  title: res.data.msg,
                  icon:'success',
                  duration:1000
                })
                setTimeout(function(){
                  wx.redirectTo({
                    url: '../agency_pay/agency_pay?type=1',
                  })
                },1000)
              }else if(res.data.code==203){
                wx.showToast({
                  title: res.data.msg,
                  icon: 'success',
                  duration:1000
                })
                setTimeout(function () {
                  wx.redirectTo({
                    url: '../checking/checking',
                  })
                }, 1000)
              }else if(res.data.code==204){
                wx.showToast({
                  title: res.data.msg,
                  icon: 'loading',
                  duration: 1000
                })
              }else{
                wx.showToast({
                  title: res.data.msg,
                  icon: 'loading',
                  duration: 1000
                })
              }
            }
          })
        }
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var invite_openid = options.share_openid;
    that.setData({
      invite_openid: invite_openid ? invite_openid : ''
    })
    console.log(that.data.invite_openid)
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
    console.log(this.data.field)
    this.setData({
      field_type_arr: wx.getStorageSync('apply_type')
    })
  },
  //生成五位随机码
  randomWord: function (randomFlag, min, max) {
    let str = "",
      range = min,
      arr = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
        'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
        'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',];

    if (randomFlag) {
      range = Math.round(Math.random() * (max - min)) + min;// 任意长度
    }
    for (let i = 0; i < range; i++) {
      var pos = Math.round(Math.random() * (arr.length - 1));
      str += arr[pos];
    }
    return str;
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