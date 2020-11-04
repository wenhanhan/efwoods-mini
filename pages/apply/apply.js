// pages/apply/apply.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
const { $Toast } = require('../../dist/base/index');
var qqmapsdk;
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sexArr: ['女', '男'],//0是女  1是男
    tea_ageArr: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40],
    apply_name:'', 
    apply_sex:'',
    sex_index: '',
    field_index:'',
    apply_age:'',
    apply_field:'',
    // 教练
    apply_tea_age:'',
    tea_age_index:'',

    apply_honer:'',
    all_honer:'',
    apply_intro:'',
    all_intro:'',
    img_video:'',
    apply_contact:'',
    apply_agency:'',
    tea_img:'',
    field_type_arr: '',//类别数组
    field: '',//授课类别
    tag:'',
    field_index: '',
    agree: '已阅读并同意',
    isAgree: false,
    invite_openid:'',
    random:''
  },



//点击输入事件
input:function(e){
  console.log(e)
  var type = e.currentTarget.dataset.type;
  var title = e.currentTarget.dataset.title;
  var cate=e.currentTarget.dataset.cate;
  console.log(type)
  wx.navigateTo({
    url: '../edit/edit?type='+type+'&title='+title+'&cate='+cate
  })
},
  //教龄操作
  tea_age: function (e) {
    this.setData({
      tea_age_index: e.detail.value,
      apply_tea_age: e.detail.value * 1 + 1
    })
    console.log(this.data.apply_tea_age)
  },

// 截取字符串,多余省略号显示
substr:function (val) {
    if (val.length == 0 || val == undefined) {
      return '';
    } else if (val.length > 12) {
      return val.substring(0, 16) + "...";
    } else {
      return val;
    }
  },
  //个人信息 性别选择
  apply_sex: function (e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    // wx.setStorageSync('apply_sex', e.detail.value)
    this.setData({
      sex_index: e.detail.value,
      apply_sex: e.detail.value
    })
  },
  //课程类别操作
  field: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log(e)
    console.log('真实的领域为' + this.data.field_type_arr[e.detail.value].Id)
    var field = this.data.field_type_arr[e.detail.value].Id;
    this.setData({
      field_index: e.detail.value,
      apply_field: field
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
  previewImage: function (e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  },
 
//提交申请 
  apply:function(e){
    var that=this;
    var formId = e.detail.formId;//模板id
    var invite_openid = that.data.invite_openid;//分享教师openid
    var random = that.randomWord(false, 5);//随机码
    var openid = wx.getStorageSync('openid');
    var province = wx.getStorageSync('address').province;
    var city = wx.getStorageSync('address').city;
    var district = wx.getStorageSync('address').district;
    // 新增
    var latitude=wx.getStorageSync('address').location.lat;
    var longitude=wx.getStorageSync('address').location.lng;
    var address = province + city + district;
    var name=that.data.apply_name;
    var sex=that.data.apply_sex;
    var tag=that.data.tag;
    var field=that.data.apply_field; 
    var tea_age=that.data.apply_tea_age;
    var agency=that.data.apply_agency;
    var honor=that.data.all_honer;
    var intro=that.data.all_intro;
    var contact=that.data.apply_contact;
    var tea_img=that.data.tea_img;
    var isAgree = that.data.isAgree;
    if(!name){
      wx.showToast({
        title: '请填写姓名信息',
        icon: 'loading',
        duration: 1000
      })
    }else if(!sex){
      wx.showToast({
        title: '请填写性别信息',
        icon: 'loading',
        duration: 1000
      })
    }else if(!contact){
      wx.showToast({
        title: '请填写联系方式',
        icon: 'loading',
        duration: 1000
      })
    }else if(!field){
      wx.showToast({
        title: '请填写教学领域',
        icon: 'loading',
        duration: 1000
      })
    }else if(!tea_age){
      wx.showToast({
        title: '请填写教龄',
        icon: 'loading',
        duration: 1000
      })
    }else if(!agency){
      wx.showToast({
        title: '请填写所属机构',
        icon: 'loading',
        duration: 1000
      })
    }else if(!honor){
      wx.showToast({
        title: '请完善荣誉成就',
        icon: 'loading',
        duration: 1000
      })
    }else if(!intro){
      wx.showToast({
        title: '请完善个人简介',
        icon: 'loading',
        duration: 1000
      })
    }else if(!tag){
      wx.showToast({
        title: '请填写个人标签',
        icon: 'loading',
        duration: 1000
      })
    } else if(!tea_img){
      wx.showToast({
        title: '请上传个人头像',
        icon: 'loading',
        duration: 1000
      })
    } else if (!isAgree) {
      wx.showToast({
        title: '请同意用户协议',
        icon: 'loading',
        duration: 1000
      })
    } else {
        console.log('开始提交')
        wx.requestSubscribeMessage({
          tmplIds: ['SPw6-8OmXgvnMOiHYl-uNZ_lfVAde5HzppL9Sb1s-ig'],
          complete(res1){
            console.log(res1) 
            wx.request({
              url: app.globalData.url+'index/Apply/apply',
              method: 'POST',
              data:{
                formId:formId,//申请表单id
                invite_openid: invite_openid,//分享人的openid
                random: random,//随机数
                openid:openid,
                name:name,
                tag:tag,
                field:field,
                agency:agency,
                honor:honor,
                teaAge:tea_age,
                intro:intro,
                phone:contact,
                address:address,
                lat: latitude,
                long: longitude,
                pic1:tea_img,
                sex:sex
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success(res){
                console.log(res.data)
                if(res.data.code==200){
                    wx.showToast({
                      title: '提交成功',
                      icon: 'success',
                      duration: 1000
                    })
                    setTimeout(function () {
                      wx.redirectTo({
                        url: '../agency_pay/agency_pay?type=2',
                      })
                    }, 1000)
               } else if(res.data.code==203){
                  //二次提交信息更新
                    wx.showToast({
                      title: '提交成功',
                      icon: 'success',
                      duration: 1000
                    })
                    setTimeout(function () {
                      wx.redirectTo({
                        url: '../checking/checking',
                      })
                    }, 1000)
                }else if(res.data.code==204){
                  console.log(res.data)
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
    var that=this;
    var invite_openid=options.share_openid;
    that.setData({
      invite_openid:invite_openid?invite_openid:''
    })
    qqmapsdk = new QQMapWX({
      key: 'K3PBZ-PSUCD-T3A4R-P5JPH-6MCR2-KYF6K' //key秘钥 
    });
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
    var address=wx.getStorageSync('address');
    var that=this;
    //通过邀请页面进来 需要重新获取定位
    if(!address){
      that.getUserLocation()
    }
    this.setData({
      apply_name: wx.getStorageSync('apply_name'),
      // apply_sex: wx.getStorageSync('apply_sex'),
      apply_age: wx.getStorageSync('apply_age'),
      field_type_arr: wx.getStorageSync('apply_type'),
      // apply_tea_age: wx.getStorageSync('apply_tea_age'),
      apply_honer: this.substr(wx.getStorageSync('apply_honer')),
      all_honer: wx.getStorageSync('apply_honer'),
      apply_intro: this.substr(wx.getStorageSync('apply_intro')),
      all_intro: wx.getStorageSync('apply_intro'),
      apply_contact: wx.getStorageSync('apply_contact'),
      apply_agency: wx.getStorageSync('apply_agency'),
      tag:wx.getStorageSync('tag'),
      tea_img:wx.getStorageSync('apply_tea_img')
    })
  },

  //同意条款
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
    console.log(this.data.isAgree)
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

//位置函数
  getUserLocation: function () {
    var that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权获取当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (res) {
                    if (res.authSetting['scope.userLocation'] === true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      that.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          that.getLocation();
        } else {
          that.getLocation();
        }
      }
    })

  },

  //获取当前经纬度
  getLocation: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy;
        that.getLocal(latitude, longitude)
      },
      fail: function (res) {
        console.log('fail' + JSON.stringify(res))
      }
    })
  },
  //获取当前位置
  getLocal: function (latitude, longitude) {
    var that = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        wx.setStorageSync('address', res.result.ad_info)
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        that.setData({
          province: province,
          city: that.substr(city),
          latitude: latitude,
          longitude: longitude
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        // console.log(res);
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