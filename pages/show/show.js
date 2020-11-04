// pages/show/show.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newVideo: [],//视频总信息
    tabbar: {},
    video: [],//视频信息
    isIphoneX: false,
    scrollH: 0,
    imgWidth: 0,
    loadingCount: 0,
    images: [],
    col1: [],
    col2: [],
    col1H: '',
    col2H: '',
    identity: '',//身份 需要完善
    category: ['全部', '附近', '美术', '音乐', '体育', '健身'],
    fresh: false,
    idx: 0,//导航栏初始值
    page_num: 1,//默认页码
    noMoreData: false,//默认更多数据
    lastPageLength: '',
    novideo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabbar();
    var isIphoneX = app.globalData.isIphoneX;
    wx.getSystemInfo({
      success: (res) => {
        console.log(res)
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.48;
        let scrollH = wh;
        this.setData({
          isIphoneX: isIphoneX,
          scrollH: scrollH,
          imgWidth: imgWidth,
          col1: [],
          col2: [],
          col1H: 0,
          col2H: 0,
        });
        this.loadImages();
      }
    })
  },
  //发布视频跳转
  add: function () {
    wx.navigateTo({
      url: '../add_show/add_show',
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //发布视频跳转
  add:function(){
    wx.navigateTo({
      url: '../add_show/add_show',
    })
  },
  //搜索视频
  search: function () {
    wx.navigateTo({
      url: '../sousuo/sousuo',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var identity = app.globalData.identity;
    console.log(identity)
    app.hidetabbar();
    that.setData({
      identity: identity
    })
  },

  loadImages: function () {
    var that = this;
    var page = that.data.page_num;
    var type = that.data.idx;//类别

    var province = wx.getStorageSync('address').province;
    var city = wx.getStorageSync('address').city;
    var latitude = wx.getStorageSync('address').location.lat;
    var longitude = wx.getStorageSync('address').location.lng;
    var address = province + city;

    wx.request({
      url: app.globalData.url + 'index/Show/showVideo',
      data: {
        page: page,
        type: type,
        address: address,
        lat: latitude,
        long: longitude
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        var video = that.data.video ? that.data.video : [];
        var lastPageLength = res.data.length;
        if (lastPageLength == 0 && page == 1) {
          setTimeout(function () {
            that.setData({
              fresh: false,
              novideo: true
            })
            //取消下拉动作
            wx.stopPullDownRefresh()
          }, 500)
        }
        if (page == 1) {
          that.setData({
            video: res.data,
            newVideo: res.data,
            lastPageLength: lastPageLength,
          })
        } else {
          that.setData({
            //连接视频总量
            newVideo: video.concat(res.data),
            video: res.data,
            lastPageLength: lastPageLength
          })
        }
        let baseId = "img-" + (+new Date());
        let images = that.data.video;
        for (let i = 0; i < images.length; i++) {
          images[i].id = baseId + "-" + i;
          images[i].height = 0;
          // console.log(images[i])
        }
        that.setData({
          loadingCount: images.length,
          images: images
        });
        console.log(that.data.images)

      }
    })
  },
  onImageLoad: function (e) {
    // console.log(e)
    // console.log(this.data.video)
    var that = this;
    let imageId = e.currentTarget.dataset.id;
    let lastPageLength = that.data.lastPageLength;//每次加载的数目
    let idx = e.currentTarget.dataset.idx;
    let oImgW = e.detail.width;         //图片原始宽度
    let oImgH = e.detail.height;        //图片原始高度
    let imgWidth = this.data.imgWidth;  //图片设置的宽度
    let scale = imgWidth / oImgW;       //比例计算
    let imgHeight = oImgH * scale;      //自适应高度
    let images = this.data.images;
    let imageObj = null;

    for (let i = 0; i < images.length; i++) {
      let img = images[i];
      // console.log(images.length)
      // console.log(img.id)
      // console.log(imageId)
      if (img.id === imageId) {
        imageObj = img;
        break;
      }
    }
    imageObj.height = imgHeight;
    // console.log(imageObj)

    let loadingCount = this.data.loadingCount - 1;
    let col1 = this.data.col1;
    let col2 = this.data.col2;
    let col1H = this.data.col1H;
    let col2H = this.data.col2H;

    if (col1H <= col2H) {
      col1H += imgHeight;
      col1.push(imageObj);
    } else {
      col2H += imgHeight;
      col2.push(imageObj);
    }

    let data = {
      loadingCount: loadingCount,
      col1: col1,
      col2: col2,
      col1H: col1H,
      col2H: col2H,
    };

    if (!loadingCount) {
      data.images = [];
    }
    if (idx == images.length - 1) {
      console.log(col1H)
      console.log(col2H)
      console.log(that.data.scrollH)
      console.log('加载完成')
      wx.stopPullDownRefresh()
      that.setData({
        fresh: false
      })
    }
    // 图片完全加载时显示 底部加载标志 防止先于图片加载出现
    if (idx == images.length - 1 && lastPageLength < 10) {
      console.log(that.data.newVideo)
      that.setData({
        noMoreData: true
      })
    }
    this.setData(data);
  },
  // 类别选择
  handleChange: function (e) {
    var index = e.currentTarget.dataset.idx;
    console.log(index)
    this.setData({
      idx: index,
    })
    wx.startPullDownRefresh()
    // this.setData({
    //   fresh: true,
    //   images: [],
    //   page_num: 1,
    //   noMoreData: false,
    //   col1: [],
    //   col2: [],
    //   video: [],
    // })
    // this.loadImages()
  },
  //视频刷新
  fresh: function () {
    wx.startPullDownRefresh()
  },

  //视频播放跳转
  play: function (e) {
    var that = this;
    var video = that.data.newVideo;
    var idx = e.currentTarget.dataset.idx;//视频Id
    var type = that.data.idx;//附近的视频
    var index;
    for (var i = 0; i < video.length; i++) {
      if (video[i].Id == idx) {
        index = i;
        break;
      }
    }
    var video = video[index];
    console.log(index)
    wx.navigateTo({
      url: '../show_des/show_des?video=' + video.video + '&title=' +encodeURIComponent(video.title) + '&name=' + encodeURIComponent(video.nickName) + '&img=' + video.avatarUrl + '&openid=' + video.openid + '&favor=' + video.favorPerson.length + '&videoid=' + video.Id + '&type=' + type + '&distance=' + video.distance + '&address=' + video.address + '&location=' + video.location + '&latitude=' + video.lat + '&longitude=' + video.long+'&cover='+encodeURIComponent(video.cover),
    })
  },
  //教师详情页面跳转
  teades: function (e) {
    var that = this;
    var teaOpenid = e.currentTarget.dataset.openid;//教师openid
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
    console.log('uuu')
    this.setData({
      fresh: true,
      images: [],
      page_num: 1,
      noMoreData: false,
      col1: [],
      col2: [],
      col1H: 0,//新加
      col2H: 0,
      video: [],
      novideo: false
    })
    this.loadImages()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('触底啦')
    console.log(this.data.noMoreData)
    var page = this.data.page_num;//获取当前页码
    if (!this.data.noMoreData) {
      page++;
      this.setData({
        page_num: page
      })
      console.log(page)
      this.loadImages()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})