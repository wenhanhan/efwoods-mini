// pages/add_show/add_show.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    video: [],//视频
    title: '',//视频标题
    percent: 0,
    progress_state: true,
    btn_state: false,
    idx: 0,//视频分类选择默认值
    show_address: '添加位置',//只在前台显示
    type: 2,//默认选择美术
    show_location: '',//详细位置
    show_lat: '',
    show_long: '',
    address: false,
    //视频分类
    category: [
      {
        name: '美术',
        type: 2
      },
      {
        name: '音乐',
        type: 3
      },
      {
        name: '体育',
        type: 4
      },
      {
        name: '健身',
        type: 5
      },
      {
        name: '其他',
        type: 0
      }
    ]
  },

  //选取视频
  chooseVideo: function (e) {
    var that = this;
    var cover = that.data.cover;
    wx.chooseVideo({
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          video: that.data.video.concat(res.tempFilePath),
        });
        console.log(res.tempFilePath)
      }
    })
  },
  //预览视频
  previewVideo: function (e) {
    var videoidx = e.currentTarget.dataset.videoidx;
    var videoId = 'video' + videoidx;
    this.videoContext = wx.createVideoContext(videoId);
    this.videoContext.requestFullScreen();
    this.videoContext.play();
  },
  //关闭全屏
  closefullscreen: function (e) {
    var videoidx = e.currentTarget.dataset.videoidx;
    var videoId = 'video' + videoidx;
    this.videoContext = wx.createVideoContext(videoId);
    this.videoContext.exitFullScreen();//退出全屏
  },
  //删除视频
  deleteVideo: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.videoidx;//第n个视频
    var files = that.data.video;
    wx.showModal({
      title: '提示',
      content: '是否要删除此视频',
      success(res) {
        if (res.confirm) {
          files.splice(index, 1)
        } else if (res.cancel) {
          console.log(2)
        }
        that.setData({
          video: files
        })
      }
    })
  },
  //地址选择
  select_address: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          show_address: res.name,//只在前台显示
          show_location: res.address,
          show_lat: res.latitude,
          show_long: res.longitude,
          address: true
        })
        console.log(that.data.address)
      },
    })
  },
  //视频类别选择
  select_cate: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var type = e.currentTarget.dataset.type
    console.log(type)
    this.setData({
      idx: idx,
      type: type
    })
  },




  input: function (e) {
    console.log(e.detail.value)
    this.setData({
      title: e.detail.value
    })
  },

  //上传事件
  upload: function () {
    var that = this;
    var openid = wx.getStorageSync('openid');
    var video = that.data.video;
    var title = that.data.title;
    var type = that.data.type;//视频分类
    var show_address = that.data.show_address;
    var show_location = that.data.show_location;
    var show_lat = that.data.show_lat;
    var show_long = that.data.show_long;
    //直辖市 省 字段处理
    var str = ['上海市', '北京市', '天津市', '重庆市'];
    for (var i = 0; i < str.length; i++) {
      if (show_location.indexOf(str[i]) != -1) {
        show_location = str[i] + show_location;
      }
    }
    //条件检验1
    if (video.length == 0) {
      wx.showToast({
        title: '请添加视频',
        icon: 'loading',
        duration: 1000
      })
    } else {
      console.log('开始提交')
      that.setData({
        btn_state: true,
        progress_state: false
      })
      const uploadTask =wx.uploadFile({
        url: app.globalData.url + 'index/Qiniu/showVideo',
        filePath: video[0],
        name: 'video',
        formData: {
          'openid': openid,
          'title': title,
          'type': type,
          'show_address': show_address,
          'show_location': show_location,
          'show_lat': show_lat,
          'show_long': show_long
        },
        success(res) {
          console.log(res.data)
          setTimeout(function () {
            wx.hideLoading()
            wx.showToast({
              title: '发布成功',
              icon: 'success',
              duration: 1000,
              success(res) {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          }, 1000)  
        }
      })
      uploadTask.onProgressUpdate((res) => {
        console.log('上传进度', res.progress)
        that.setData({
          percent: res.progress
        })
        if (that.data.percent == 100) {
          wx.showLoading({
            title: '正在处理～',
          })
        }
        console.log('已经上传的数据长度', res.totalBytesSent)
        console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
      })

    }

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