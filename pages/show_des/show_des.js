// pages/show_des/show_des.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    video: '',
    title: '',
    name: '',
    headimg: '',
    teaOpenid: '',
    favor: '',
    videoId: '',
    isFavor: false,
    renqi: '',
    videoNum: '',
    share_renqi: '',
    share_videoNum: '',
    judge: false,
    focus: false,
    keyboard_height:0,
    content: '',
    judge: [],
    openid: '',//用户openid 
    userInfo: {},//用户信息 分享页面点击啊按钮获取
    home_state: false,
    isIphoneX: false,
    imgurl: '',
    type: '',//视频类型
    distance: '',
    address: '',
    location: '',
    latitude: '',
    longitude: '',
    is_checking:false,
    cover:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var isIphoneX = app.globalData.isIphoneX;
    // console.log(options)
    this.setData({ 
      video: options.video,
      title: decodeURIComponent(options.title),
      name: decodeURIComponent(options.name),
      headimg: options.img,
      teaOpenid: options.openid,
      favor: options.favor,
      videoId: options.videoid,
      share_renqi: options.renqi,
      share_videoNum: options.videoNum,
      type: options.type,
      distance: options.distance,
      address: options.address,
      latitude: options.latitude * 1,
      longitude: options.longitude * 1,
      location: options.location,
      userInfo: wx.getStorageSync('userInfo'),
      cover:decodeURIComponent(options.cover),
      is_checking:app.globalData.is_checking,
      isIphoneX: isIphoneX
    })
    console.log(app.globalData.is_checking)
    console.log(this.data.userInfo)
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
    //视频播放次数加一
    var that = this;
    that.setData({
      userInfo:wx.getStorageSync('userInfo')
    })
    var pages = getCurrentPages();//当前页面栈
    console.log(pages)
    if (pages.length == 1) {
      //分享页面进入 绘制顶部栏加主页返回
      that.setData({
        home_state: true
      })
    }
    var videoId = that.data.videoId;
    var openid = wx.getStorageSync('openid')
    console.log(openid)
    //openid 异步获取 防止未加载
    if (!openid) {
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
    }
    wx.request({
      url: app.globalData.url + 'index/Show/playTime',
      data: {
        videoId: videoId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
      }
    })
    //判断是否收藏
    wx.request({
      url: app.globalData.url + 'index/Show/isFavor',
      data: {
        videoId: videoId,
        openid: openid ? openid : that.data.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200) {
          //已经收藏
          that.setData({
            isFavor: true
          })
        } else {
          //未收藏
          that.setData({
            isFavor: false
          })
        }
      }
    })
    //获取视频个数与人气
    wx.request({
      url: app.globalData.url + 'index/Show/getNumRenqi',
      data: {
        openid: that.data.teaOpenid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          videoNum: res.data[0],
          renqi: res.data[1],

        })
      }
    })
    //获取视频评论
    that.getVideoJudge(videoId, openid);
    //关注动画暂时去掉
    // var i = 0;
    // var j;
    // var timer = setInterval(function () {
    //   if (i == 56) {
    //     i = 0
    //   }
    //   i++;
    //   j = i;
    //   if (i < 16) {
    //     j = 16;
    //   }
    //   if (i > 32 && i < 56) {
    //     j = 35
    //   }
    //   // console.log(i)
    //   that.setData({
    //     imgurl: 'https://cdn.icloudapi.cn/' + j + '.png'
    //   })
    // }, 40)
  },
  getVideoJudge(id, openid) {
    var that = this;
    wx.request({
      url: app.globalData.url + 'index/Show/getVideoJudge',
      data: {
        videoId: id,
        openid: openid ? openid : that.data.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          judge: res.data
        })
      }
    })
  },
  //收藏视频 首先判断是否授权登录
  favor: function () {
    var that = this;
    var favor = that.data.favor;
    var openid = wx.getStorageSync('openid');
    var userInfo = wx.getStorageSync('userInfo');//用户信息
    //首先检测用户是否授权
    if(userInfo){
      wx.request({
        url: app.globalData.url + 'index/Show/videoFavor',
        data: {
          videoId: that.data.videoId,
          openid: openid
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          if (res.data.code == 200) {
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 1000
            })
            that.setData({
              isFavor: true,
              favor: favor * 1 + 1
            })
          } else if (res.data.code == 201) {
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 1000
            })
            that.setData({
              isFavor: false,
              favor: favor * 1 - 1
            })
          }
        }
      })
    }else{
      //返回授权
      app.login()
    }
    
  },

  //评论
  judge: function (e) {
    //首先判断是否授权
    var userInfo = wx.getStorageSync('userInfo');//用户信息
    if(userInfo){
      this.setData({
        isjudge: true,
        focus: true
      })
    }else{
      app.login()
    }
   
  },
  focus: function (e) {
    console.log(e)
    var height = e.detail.height;
    this.setData({
      keyboard_height: height
    })
  },
  cancel: function (e) {
    console.log(e)
    this.setData({
      focus: false,
      isjudge: false,
      keyboard_height: 0
    })
  },
  judgeTxt: function (e) {
      console.log(e.detail.value)
      this.setData({
        content: e.detail.value
      })
  },
  //提交
  send: function () { 
    var that = this;
    var content = that.data.content.trim();
    var openid = wx.getStorageSync('openid');
    var videoId = that.data.videoId;
    if(content){
      wx.request({
        method: 'POST',
        url: app.globalData.url + 'index/Show/videoJudge',
        data: {
          openid: openid,
          videoId: videoId,
          content: content
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data)
          if(res.data==87014){
            wx.showToast({
              title: '评论内容不合法',
              icon:'loading',
              duration:1000
            })
          }else{
            that.setData({
              content:'',
              focus:false,//评论完成输入框下拉回到初始态
              keyboard_height:0
            })
            wx.showToast({
              title: '评论成功',
              icon: 'success',
              duration: 1000
            })
            that.getVideoJudge(videoId, openid);//提交成功，重新获取视频评论
          }
        }
      })
    }else{
      console.log('评价内容为空')
    }
    
    console.log(content)
  },
  //点赞评论
  like: function (e) {
    console.log(666)
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');//用户信息
    var judgeId = e.currentTarget.dataset.judgeid;//评论id 唯一
    var videoId = that.data.videoId;
    var openid = wx.getStorageSync('openid');
    if(userInfo){
      wx.request({
        url: app.globalData.url + 'index/Show/likeVideoJudge',
        data: {
          openid: openid,
          judgeId: judgeId
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data)
          that.getVideoJudge(videoId, openid);//提交成功，重新获取视频评论
        }
      })
    }else{
      app.login()
    }
  },
  bindGetUserInfo: function (e) {
    var that = this;
    app.getUserInfo().then(function (res) {
      if (res.status == 200) {
        that.setData({
          userInfo: wx.getStorageSync('userInfo')
        }) 
        console.log(that.data.userInfo)
        //将信息上传后台
        //判断用户是否授权
        wx.getSetting({
          success(res) {
            if (res.authSetting['scope.userInfo']) {
              //将用户信息存入数据库
              console.log(that.data.openid)
              console.log(that.data.userInfo)
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

            }
          }
        })

      } else {
        console.log(res.data);
      }
    });
  },

  getUserInfo: function (res) {
    var that = this;
    if (res.detail.userInfo) {
      that.setData({
        userInfo: res.detail.userInfo,
        isjudge: true,
        focus: true
      })
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) {
            console.log(that.data.openid)
            console.log(that.data.userInfo)
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
          }
        }
      })

    } else {
      console.log('未同意');
    }
  },
  home: function (e) {
    console.log(e)
    wx.switchTab({
      url: '../index/index',
    })
  },
  //教师详情页面跳转
  teades: function (e) {
    var that = this;
    var teaOpenid = that.data.teaOpenid;//教师openid
    //根据教师openid 查找教师id
    wx.request({
      url: app.globalData.url + 'index/Show/getTeacherId',
      data: {
        openid: teaOpenid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        wx.navigateTo({
          url: '../tea_detail/tea_detail?tea_id=' + res.data,
        })
      }
    })
  },

  //地址导航
  chooseLocation: function () {
    const latitude = this.data.latitude;
    const longitude = this.data.longitude;
    var name = this.data.address;
    var address = this.data.location;
    wx.openLocation({
      latitude,
      longitude,
      name,
      address,
      scale: 18,
      success(res) {
        console.log('打开成功')
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
    var that = this;
    var video = that.data.video;
    var title = that.data.title;
    var name = that.data.name;
    var img = that.data.headimg;
    var openid = that.data.teaOpenid;
    var videoid = that.data.videoId;
    var renqi = that.data.renqi;
    var favor=that.data.favor;
    var videoNum = that.data.videoNum;
    return {
      title: '向你分享',
      path: '/pages/show_des/show_des?video=' + video + '&title=' + title + '&name=' + name + '&img=' + img + '&openid=' + openid + '&videoid=' + videoid + '&renqi=' + renqi + '&videoNum=' + videoNum+'&favor='+favor,
    }
  }
})