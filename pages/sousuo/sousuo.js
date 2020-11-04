// pages/search/search.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newVideo: [],//视频总信息
    video: [],//视频信息
    scrollH: 0,
    imgWidth: 0,
    loadingCount: 0,
    images: [],
    col1: [],
    col2: [],
    col1H: '',
    col2H: '',
    text: '',
    isnull: false,
    hot: true,//初始显示热门搜索
    page_num: 1,//默认页码
    noMoreData: false,//默认更多数据
    lastPageLength: '',
    novideo: false,
    sum: 0,//搜索总数
    backTopValue: 0
  },

  //输入事件
  input: function (e) {
    this.setData({
      text: e.detail.value
    })
  },
  //搜索事件 
  search: function (e) {
    var that = this;
    var text = that.data.text.trim();
    if (!text) {
      wx.showToast({
        title: '请输入关键字',
        icon: 'loading',
        duration: 1000
      })
      return
    }
    that.setData({
      hot: false,
      isnull: true,
      images: [],
      noMoreData: false,
      col1: [],
      col2: [],
      col1H: 0,//视频按顺序排布
      col2H: 0,
      video: [],
    })
    wx.request({
      url: app.globalData.url + 'index/Show/searchShowVideo',
      data: {
        page: 1,
        keywords: text
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        // var video = that.data.video ? that.data.video : [];
        var lastPageLength = res.data.length;
        if (res.data.length == 0) {
          that.setData({
            novideo: true,
            sum: 0,
            video: [],
            novideo: true
          })
        } else {
          that.setData({
            newVideo: res.data,
            video: res.data,
            sum: res.data[0].sum,
            novideo: false,
            lastPageLength: lastPageLength,
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
  loadImages: function (e) {
    var that = this;
    that.setData({
      hot: false,
      isnull: true,
    })
    var text = that.data.text;
    var page = that.data.page_num;
    wx.request({
      url: app.globalData.url + 'index/Show/searchShowVideo',
      data: {
        page: page,
        keywords: text
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        var video = that.data.video ? that.data.video : [];
        var lastPageLength = res.data.length;
        that.setData({
          //连接视频总量
          newVideo: video.concat(res.data),
          video: res.data,
          lastPageLength: lastPageLength
        })
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

    // 图片完全加载时显示 底部加载标志 防止先于图片加载出现
    if (idx == images.length - 1 && lastPageLength < 10) {
      console.log(col1)
      console.log(col2)
      console.log(that.data.newVideo)
      that.setData({
        noMoreData: true
      })
    }
    this.setData(data);
  },
  //热门搜索点击
  hot_search: function (e) {
    var hot_text = e.currentTarget.dataset.text;
    this.setData({
      text: hot_text
    })
    this.search();
  },


  goback: function () {
    //查询信息清空
    this.setData({
      col1: [],
      col2: [],
      col1H: 0,
      col2H: 0,
      video: [],
      images: [],
      newVideo: [],
      hot: true,
      noMoreData: false,//默认更多数据
      lastPageLength: '',
      novideo: false,
      page_num: 1,
      sum: 0,
      text: ''
    })
  },

  /**
    * 生命周期函数--监听页面显示
    */
  onShow: function () {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('load')
    app.editTabbar();
    wx.getSystemInfo({
      success: (res) => {
        console.log(res)
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.48;
        let scrollH = wh;
        this.setData({
          scrollH: scrollH,
          imgWidth: imgWidth,
          col1: [],
          col2: [],
          col1H: 0,
          col2H: 0,
        });
        // this.loadImages();
      }
    })
  },
  //视频播放跳转
  play: function (e) {
    var that = this;
    var video = that.data.newVideo;
    console.log(video)
    var idx = e.currentTarget.dataset.idx;//视频Id
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
      url: '../show_des/show_des?video=' + video.video + '&title=' + video.title + '&name=' + video.nickName + '&img=' + video.avatarUrl + '&openid=' + video.openid + '&favor=' + video.favorPerson.length + '&videoid=' + video.Id,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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