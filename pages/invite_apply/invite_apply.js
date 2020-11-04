// pages/apply/apply.js
var app=getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    random: '',//随机码
    openid: '',//申请教师的openid
    userInfo: {},
    invite_openid: '',//分享教师的openid

    sexArr: ['女', '男'],//0是女  1是男
    apply_name:'',
    apply_sex:'',
    sex_index: '',
    field_index:'',
    apply_age:'',
    apply_field:'',
    apply_tea_age:'',
    apply_honer:'',
    all_honer:'',
    apply_intro:'',
    all_intro:'',
    img_video:'',
    apply_contact:'',
    apply_agency:'',
    apply_img:[],
    field_type_arr: '',//类别数组
    field: '',//授课类别
    field_index: '',
    agree: '已阅读并同意',
    isAgree: false
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
  //个人缩略图添加
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          apply_img: that.data.apply_img.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.apply_img // 需要预览的图片http链接列表
    })
  },
  //长按删除
  deleteImg: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.idx;//第n个视频
    var files = that.data.apply_img;
    wx.showModal({
      title: '提示',
      content: '是否要删除照片',
      success(res) {
        if (res.confirm) {
          files.splice(index, 1)
        } else if (res.cancel) {
          console.log(2)
        }
        that.setData({
          apply_img: files
        })
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.apply_img // 需要预览的图片http链接列表
    })
  },
//提交申请
  apply:function(e){
    var that=this;
    var openid = that.data.openid;
    console.log(openid)
    var invite_openid = that.data.invite_openid;//分享教师openid
    var random = that.randomWord(false, 5);//随机码
    console.log(random)
    var province = wx.getStorageSync('address').province;
    var city = wx.getStorageSync('address').city;
    var district = wx.getStorageSync('address').district;
    var address = province + city + district;
    var apply_img=that.data.apply_img;
    var name=that.data.apply_name;
    var sex=that.data.apply_sex;
    var age=that.data.apply_age;
    var field=that.data.apply_field;
    var tea_age=that.data.apply_tea_age;
    var agency=that.data.apply_agency;
    var honor=that.data.all_honer;
    var intro=that.data.all_intro;
    var contact=that.data.apply_contact;
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
    }else if(!age){
      wx.showToast({
        title: '请填写年龄信息',
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
    }else if(!contact){
      wx.showToast({
        title: '请填写联系方式',
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
        wx.request({
          url: app.globalData.url +'index/Apply/inviteApply',
          data:{
            openid: openid,
            invite_openid: invite_openid,//分享教师openid
            random: random,//随机数
            name:name,
            age:age,
            field:field,
            agency:agency,
            honor:honor,
            teaAge:tea_age,
            intro:intro,
            phone:contact,
            address:address
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res){
            if(res.data.code==200){
              if(apply_img.length==0){
                wx.showToast({
                  title: '提交成功',
                  icon: 'success',
                  duration: 1000
                })
              }else{
                console.log(res.data.id)
                for(var i=0;i<apply_img.length;i++){
                  wx.uploadFile({
                    url: app.globalData.url + 'index/Apply/applyImg',
                    filePath: apply_img[i],
                    name: 'img',
                    formData: {
                      id: res.data.id,//主键id
                      order: i
                    },
                    success(res){
                      console.log(res.data)
                      wx.showToast({
                        title: '提交成功',
                        icon: 'success',
                        duration: 1000
                      })
                    }
                  })
                }
              }
              //开始生成模板消息
              wx.request({
                url: app.globalData.url + 'index/News/teaApply',
                data: {
                  touser: openid,
                  template_id: 'v5IqPlJ5EcWXO94F9upsHPqh0afmR-vJ5tNevpPrZEA',
                  form_id: e.detail.formId,
                  keyword1: name,
                  keyword2: agency,
                  keyword3: address,
                  keyword4: contact,
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success(res) {
                  console.log(res.data)
                }
              })
            }else if(res.data.code==404){
              wx.showToast({
                title: '请勿重复提交',
                icon: 'loading',
                duration: 1000
              })
            }else{
              wx.showToast({
                title: '请耐心等待',
                icon: 'success',
                duration: 1000
              })
            }
          }
        })
        
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取分享教师的openid
    qqmapsdk = new QQMapWX({
      key: 'K3PBZ-PSUCD-T3A4R-P5JPH-6MCR2-KYF6K' //key秘钥 
    });
    that.setData({
      invite_openid: options.share_openid
    })
    console.log(that.data.invite_openid)
    // 新增代码 异步回调获取openid

    app.getOpenid().then(function (res) {
      if (res.status == 200) {
        that.setData({
          openid: wx.getStorageSync('openid')
        })
        console.log(that.data.openid)
      } else {
        console.log(res.data);
      }
    });

    //获取用户信息
    app.getUserInfo().then(function (res) {
      if (res.status == 200) {
        that.setData({
          userInfo: wx.getStorageSync('userInfo')
        })
        console.log(that.data.userInfo)
      } else {
        console.log(res.data);
      }
    });
    //信息再次获取
    that.setData({
      openid: wx.getStorageSync('openid'),
      userInfo: wx.getStorageSync('userInfo')
    })
    console.log(that.data.openid)
    console.log(that.data.userInfo)
    //将基本信息插入数据库
    //判断用户是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          //将用户信息存入数据库
          wx.request({
            url: app.globalData.url + 'index/index/insertUserInfo',
            data: {
              openid: that.data.openid,
              nickName: that.data.userInfo.nickName,
              sex: that.data.userInfo.gender,
              avatarUrl: that.data.userInfo.avatarUrl,
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res.data)
            }
          })

        } else {
          wx.redirectTo({
            url: '../auth/auth',
          })
        }
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
    that.getUserLocation();
    this.setData({
      apply_name: wx.getStorageSync('apply_name'),
      // apply_sex: wx.getStorageSync('apply_sex'),
      apply_age: wx.getStorageSync('apply_age'),
      field_type_arr: wx.getStorageSync('apply_type'),
      apply_tea_age: wx.getStorageSync('apply_tea_age'),
      apply_honer: this.substr(wx.getStorageSync('apply_honer')),
      all_honer: wx.getStorageSync('apply_honer'),
      apply_intro: this.substr(wx.getStorageSync('apply_intro')),
      all_intro: wx.getStorageSync('apply_intro'),
      apply_contact: wx.getStorageSync('apply_contact'),
      apply_agency: wx.getStorageSync('apply_agency')
    })
  },


  //重新获取用户位置
  //获取用户位置
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
//返回首页
  home: function (e) {
    console.log(e)
    wx.switchTab({
      url: '../index/index',
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