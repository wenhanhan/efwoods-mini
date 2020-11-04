// pages/myset/addCourse/addCourse.js
var app = getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */ 
  data: {
    cour_id:'',//课程id
    index:'',//课程初始类别
    cour_list:[],//课程信息
    cour_name: '', //课程名字
    cour_methos: '', //教学方式
    // cour_tool: '', //教学工具
    cour_hour_arr:[30,45,60],
    duration_index:0,//课程时长数组序号
    cour_address: '', //教学地点
    cour_tag: '', //标签设置
    cour_money: '', //课程金额
    cour_contact: '', //联系方式
    cour_time: '', //有效期
    cour_tw: '', //图文详情
    cour_arr: [],
    url_string: '',
    cour_type: '',//所属类别
    type_id: '',//类别id
    cour_type: '',//类别数组
    courAddressName: '',//课程简写地址
    courAddressDes: '',//课程地址描述
    courLat: '',//课程经度
    courLong: '',//课程纬度
    start_time: '',//课程有效期开始时间
    end_time: '结束日期',//课程有效期结束时间
     isedit_location:false,//是否更改地址 默认无更改
    cour_img: [],
    cour_string:'',
    is_yuyue:false,//是否开启预约
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
      url: '../../pages/edit/edit?type=' + type + '&title=' + title + '&cate=' + cate
    })
  },
    //课程时长
    courHour:function(e){
      this.setData({
        duration_index:e.detail.value
      })
    },
  //课程地址选择
  location: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          cour_address: res.name,//只在前台显示
          courAddressName: res.name,
          courAddressDes: res.address,
          courLat: res.latitude,
          courLong: res.longitude,
          isedit_location:true
        })
      },
    })
  },



  //课程类别操作
  courType: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var type_id = this.data.cour_type_arr[e.detail.value].Id;
    console.log('真实的领域为' + type_id)
    this.setData({
      index: e.detail.value,
      // type_id: e.detail.value*1+1,//
      type_id: type_id,//新算法
      cour_type: this.data.cour_type_arr[e.detail.value]
    })
  },

  //课程有效期添加

  start_time(e) {
    console.log(e)
    this.setData({
      start_time: e.detail.value
    })
  },
  end_time(e) {
    console.log(e)
    this.setData({
      end_time: e.detail.value
    })
  },
    //预约开启关闭
    yuyueSet(event){
      const detail = event.detail;
      this.setData({
        is_yuyue : detail.value
      })
      console.log(this.data.is_yuyue)
  },

//跳转课程图文
  cour_tw:function(){
    var cour_id = this.data.cour_id;
    wx.navigateTo({
      url: "/pages/tw_update/tw_update?cour_id="+cour_id,
    })
  },

  //课程缩略图添加

  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          cour_img: that.data.cour_img.concat(res.tempFilePaths)
        });
        console.log(that.data.cour_img)
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.cour_img // 需要预览的图片http链接列表
    })
  },
  //长按删除
  deleteImg: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.idx;//第n个视频
    var files = that.data.cour_img;
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
          cour_img: files
        })
      }
    })
  },

  //保存课程
  saveCourse: function () {
    var that = this;
    var openid = wx.getStorageSync('openid'); //个人身份
    var cour_id=that.data.cour_id;//修改的课程id

    var is_yuyue=that.data.is_yuyue?1:0;//是否开启预约 
    //预约配置信息
    var is_edit_set_yuyue=wx.getStorageSync('is_edit_set_yuyue')?1:0;
    var is_yuyue_pay=wx.getStorageSync('is_edit_yuyue_pay');
    var is_yuyue_coupon=wx.getStorageSync('is_edit_yuyue_coupon');
    var max_stu=wx.getStorageSync('edit_max_stu');
    var forbid_app_time=wx.getStorageSync('edit_forbid_app_time');
    var forbid_cancel_time=wx.getStorageSync('edit_forbid_cancel_time');
    var time_set=wx.getStorageSync('edit_time_set');
    //课程信息
    var cour_name = that.data.cour_name;
    var cour_method = that.data.cour_method;
    // var cour_tool = that.data.cour_tool;
    var cour_hour = that.data.cour_hour_arr[that.data.duration_index];//课程时长
    var cour_address = that.data.cour_address;
    var courAddressName = that.data.courAddressName;
    var courAddressDes = that.data.courAddressDes;//课程详细地址
    var courLat = that.data.courLat;//课程经度
    var courLong = that.data.courLong;//课程纬度
    var cour_type = that.data.type_id;//课程类型
    var cour_tag = that.data.cour_tag;
    var cour_money = that.data.cour_money;
    var cour_contact = that.data.cour_contact;
    var start_time = that.data.start_time;//课程开始时间
    var end_time = that.data.end_time;//课程结束时间
    var cour_img = that.data.cour_img;//课程缩略图
    var cour_tw = that.data.cour_tw;
    var str = ['上海市', '北京市', '天津市', '重庆市'];
    if(that.data.isedit_location){
      for (var i = 0; i < str.length; i++) {
        if (courAddressDes.indexOf(str[i]) != -1) {
          courAddressDes = str[i] + courAddressDes;
        }
      }
    }
    console.log(courAddressDes)
   
    if (!cour_name) {
      wx.showToast({
        title: '课程名字不为空',
        duration: 1000,
        icon: 'loading'
      })
    } else {
      if (!cour_method) {
        wx.showToast({
          title: '教学方式不为空',
          duration: 1000,
          icon: 'loading'
        })
      } else if (!cour_hour) {
        wx.showToast({
          title: '教学时长不为空',
          duration: 1000,
          icon: 'loading'
        })
      } else if (!cour_address) {
        wx.showToast({
          title: '教学地点不为空',
          duration: 1000,
          icon: 'loading'
        })
      } else if (!cour_tag) {
        wx.showToast({
          title: '请填写教学标签',
          duration: 1000,
          icon: 'loading'
        })
      } else if (!cour_money) {
        wx.showToast({
          title: '请填写课程金额',
          duration: 1000,
          icon: 'loading'
        })
      } else if (!cour_type) {
        wx.showToast({
          title: '请选择教学类别',
          duration: 1000,
          icon: 'loading'
        })
      } else if (!cour_contact) {
        wx.showToast({
          title: '请填写联系方式',
          duration: 1000,
          icon: 'loading'
        })
      } else if (end_time == '结束日期') {
        wx.showToast({
          title: '请填写结束日期',
          duration: 1000,
          icon: 'loading'
        })
      }  else {
        console.log('开始提交')

        wx.request({
          url: app.globalData.url + 'index/course/updateCourse',
          method:'POST',
          data: {
            openid: openid,//上传人身份
            cour_id:cour_id,//修改的课程id
            coue_name: cour_name,//课程名字
            cour_method: cour_method,//教学方式
            cour_tool: '无',//教学器材
            cour_hour: cour_hour,//教学时长
            courAddressName: cour_address,//课程简写地址
            courAddressDes: courAddressDes,//课程详细地址
            courLat: courLat,//课程经度
            courLong: courLong,//课程纬度
            cour_tag: cour_tag,
            cour_money: cour_money,
            cour_type: cour_type,
            cour_contact: cour_contact,
            start_time: start_time,
            end_time: end_time,
            cour_tw: cour_tw,

            is_yuyue:is_yuyue,//预约是否开启 
            is_edit_set_yuyue:is_edit_set_yuyue,
            is_yuyue_pay:is_yuyue_pay,
            is_yuyue_coupon:is_yuyue_coupon,
            max_stu:max_stu,
            forbid_app_time:forbid_app_time,
            forbid_cancel_time:forbid_cancel_time,
            time_set:time_set
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log(res.data)
            if (res.data.code == 200) {
              if(cour_img.length==0){
                wx.showToast({
                  title: '修改成功',
                  icon: 'success',
                  duration: 2000,
                  success(res){
                    //清除缓存
                    wx.removeStorageSync('cour_name')
                    wx.removeStorageSync('cour_method')
                    // wx.removeStorageSync('cour_tool')
                    wx.removeStorageSync('cour_hour')
                    wx.removeStorageSync('cour_tag')
                    wx.removeStorageSync('cour_money')
                    wx.removeStorageSync('cour_contact')
                    wx.removeStorageSync('edit_cour_des')
                    wx.removeStorageSync('is_edit_set_courDes')
                    //清除预约设置缓存
                  wx.removeStorageSync('is_edit_yuyue_pay')
                  wx.removeStorageSync('is_edit_yuyue_coupon')
                  wx.removeStorageSync('edit_max_stu')
                  wx.removeStorageSync('edit_forbid_app_time')
                  wx.removeStorageSync('edit_forbid_cancel_time')
                  wx.removeStorageSync('edit_time_set')
                  wx.removeStorageSync('is_edit_set_yuyue')
                  }
                })
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 2000)
              }else{
                //开始更新缩略图
                console.log('更新缩略图')
                wx.uploadFile({
                  url: app.globalData.url + 'index/Course/suolue',
                  filePath: cour_img[0],
                  name: 'cour_img',
                  formData: {
                    cour_id: cour_id
                  },
                  success(res) {
                    console.log(res.data)
                    wx.showToast({
                      title: '修改成功',
                      icon: 'success',
                      duration: 2000,
                    })
                    //清除缓存
                    wx.removeStorageSync('cour_name')
                    wx.removeStorageSync('cour_method')
                    // wx.removeStorageSync('cour_tool')
                    // wx.removeStorageSync('cour_hour')
                    wx.removeStorageSync('cour_tag')
                    wx.removeStorageSync('cour_money')
                    wx.removeStorageSync('cour_contact')
                    wx.removeStorageSync('cour_tw')
                     //清除预约设置缓存
                  wx.removeStorageSync('is_edit_yuyue_pay')
                  wx.removeStorageSync('is_edit_yuyue_coupon')
                  wx.removeStorageSync('edit_max_stu')
                  wx.removeStorageSync('edit_forbid_app_time')
                  wx.removeStorageSync('edit_forbid_cancel_time')
                  wx.removeStorageSync('edit_time_set')
                  wx.removeStorageSync('is_edit_set_yuyue')
                    setTimeout(function () {
                      wx.navigateBack({
                        delta: 1
                      })
                    }, 2000)
                  }
                })

              }
              
             
            }
          }
        })
      }
    }
  },
//去除字符串前后空格
trim:function(str){
  return str.replace(/(^\s*)|(\s*$)/g, ""); 
},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var cur_time = util.formatDate(new Date());//获取当前时间
    //提交成功以后，从缓存获取数据
    this.setData({
      cour_name: wx.getStorageSync('cour_name') ? wx.getStorageSync('cour_name'):that.data.cour_name,
      cour_method: wx.getStorageSync('cour_method')? wx.getStorageSync('cour_method'):that.data.cour_method,
      // cour_tool: wx.getStorageSync('cour_tool') ? wx.getStorageSync('cour_tool'):that.data.cour_tool,
      // cour_hour: wx.getStorageSync('cour_hour') ? wx.getStorageSync('cour_hour'):that.data.cour_hour,
      is_yuyue:that.data.is_yuyue,
      cour_type_arr: app.globalData.cour_type,
      index:that.data.index,
      cour_tw: wx.getStorageSync('edit_cour_des') ? wx.getStorageSync('edit_cour_des'):that.data.cour_tw,//课程图文
      cour_tag: wx.getStorageSync('cour_tag') ? wx.getStorageSync('cour_tag'):that.data.cour_tag,
      cour_money: wx.getStorageSync('cour_money') ? wx.getStorageSync('cour_money'):that.data.cour_money,
      cour_contact: wx.getStorageSync('cour_contact') ? wx.getStorageSync('cour_contact'):that.data.cour_contact,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var cour_id = options.cour_id ? options.cour_id : wx.getStorageSync('store_twCourId');
    var cour_hour_arr=that.data.cour_hour_arr;
    var duration_index;
    wx.setStorageSync('store_twCourId', cour_id)
      that.setData({
        cour_id: cour_id
      })
      wx.request({
        url: app.globalData.url + 'index/Course/seleIdCourse',
        data: {
          'cour_id': cour_id
        },
        header: {
          'content-type': 'application/json' // 默认值1
        },

        success(res) {
          console.log(res.data)
          // console.log(res.data[0].courName)
          // console.log(res.data[0].courDes)
          wx.setStorageSync('store_tw', res.data[0].courTwDes);//缓存要编辑的图文信息

          var cour_type_index;
          var apply_type = wx.getStorageSync('apply_type')
          //课程时长选择查询
          var cour_hour=res.data[0].courHour;
          console.log(cour_hour)
          if(cour_hour!=30&&cour_hour!=45&&cour_hour!=60){
            duration_index=0
          }else{
            for(var i=0;i<that.data.cour_hour_arr.length;i++){
              if(that.data.cour_hour_arr[i]==cour_hour){
                duration_index=i;
                console.log(i)
                break; 
              }
            }
          }
          console.log(apply_type)
          for (var i = 0; i < apply_type.length; i++) {
            if (apply_type[i].Id == res.data[0].courType) {
              cour_type_index = i;
              console.log(i)
            }
          }

          that.setData({
            cour_list: res.data,
            cour_name: res.data[0].courName,
            cour_method: res.data[0].Methods,
            is_yuyue:res.data[0].is_yuyue,
            // cour_tool: res.data[0].courTools,
            // cour_hour: res.data[0].courHour,
            duration_index:duration_index,
            cour_type_arr: apply_type,
            cour_address: res.data[0].courAddressName,
            courAddressName: res.data[0].courAddressName,
            courAddressDes: res.data[0].courAddressDes,
            cour_tw:res.data[0].courDes,//课程图文
            courLat: res.data[0].courLat,
            courLong: res.data[0].courLong,
            index: cour_type_index,
            type_id: res.data[0].courType,
            cour_tag: res.data[0].courTags,
            cour_money: res.data[0].price,
            cour_contact: res.data[0].courContact,
            start_time: res.data[0].startTime,
            end_time: res.data[0].endTime,
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