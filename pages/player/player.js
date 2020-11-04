// pages/player/player.js
const bkAudio=wx.getBackgroundAudioManager()
const { $Toast } = require('../../dist/base/index');
var common = require('../../utils/common.js');
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible1: false,
    actions1: [
        {
          name: '分享给好友',
          icon: 'share',
          openType: 'share'
      },
        {
            name: '生成分享卡片'
        }
    ],
    pixelRatio: '',//像素比
    rpx: '',//单位换算
    canvas_width: '',
    canvas_height: '',
    maskHidden: false,
    wxcode: '',
    save_btn:false,

    zhuanlan_id:'',
    tea_img:'',
    top_img:'',
    tea_info:'',
    zhuanlan_title:'',
    author:'',
    duration:100,
    current:0,
    current_time:'00:00',
    // max_time:'12:00',
    play:true,
    zhuanlan:[],
    is_judge:'',
    index:0,//播放序号
    is_like:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      index:options.index,
      zhuanlan_id:options.id
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
    var zhuanlan_id=that.data.zhuanlan_id;
    var openid=wx.getStorageSync('openid');
    wx.request({
      url: app.globalData.url+'index/Zhuanlan/getZhuanLanAudio',
      data: {
        id:zhuanlan_id,
        openid:openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data)
        that.setData({
          top_img:res.data[0].bk_img,
          tea_img:res.data[0].tea_img,
          author:res.data[0].tea_name,
          is_judge:res.data[0].is_judge,
          is_like:res.data[0].is_like,
          zhuanlan:res.data[1],
          zhuanlan_title:res.data[0].title,
          tea_info:res.data[0].tea_info,
          play:true
        })
        that.player()
      }
    })

    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          pixelRatio: res.pixelRatio,
          rpx: res.windowWidth / 375,
          canvas_width: 2 * res.screenWidth,
          canvas_height: 2 * 667 * (res.windowWidth / 375),
        })
      },
    })
  //  this.player()
  },
  player:function() {
    var index=this.data.index
    console.log(index)
    bkAudio.title=this.data.zhuanlan[index].title
    bkAudio.src=this.data.zhuanlan[index].url
    bkAudio.coverImgUrl=this.data.tea_img
    //监听背景音乐播放进度
    bkAudio.onTimeUpdate(()=>{
      // console.log(bkAudio.currentTime)
      // console.log(bkAudio.duration)
      var min=parseInt(bkAudio.currentTime/60)
      if(min<10){
        min="0"+min;
      }
      var sec=parseInt(bkAudio.currentTime)%60;
      if(sec<10){
        sec="0"+sec;
      }
      var current_time=min+':'+sec;
      // console.log(bkAudio)
      this.setData({
        duration:bkAudio.duration,
        current:bkAudio.currentTime,
        current_time:current_time
      })
      // if(bkAudio.currentTime==bkAudio.duration){
      //   this.setData({
      //     play:false
      //   })
      // }
    })
    //监听播放完毕
    bkAudio.onEnded(()=>{
      this.setData({
        play:false
      })
    })
  },
  sliderChange:function(e){
    console.log(e)
    this.setData({
      current:parseInt(e.detail.value)
    })
    bkAudio.play()
    bkAudio.seek(e.detail.value)
  },
  play:function() {
    var state=this.data.play;
    var that=this;
    if(state){
      bkAudio.pause()
    }else{
      bkAudio.play()
      console.log(bkAudio.currentTime)
      if(this.data.current==0){
        bkAudio.stop()
        that.setData({
          current:0
        })
        bkAudio.seek(0)
        bkAudio.play()
      }
    }
    this.setData({
      play:state?false:true
    })
  },
  judge:function() {
    var is_judge=this.data.is_judge;
    if(is_judge==0){
      $Toast({
        content: '该专栏暂未开放评论'
    });
    }
  },
  //左右控制
  right:function () {
    var index=this.data.index;
    var zhuanlan=this.data.zhuanlan;
    if(index==zhuanlan.length-1){
      $Toast({
        content: '已是最后一个'
    });
    }else{
      this.setData({
        index:index*1+1,
        current_time:'00:00',
        play:true
      })
      this.player()
    }
  },
  left:function() {
    var index=this.data.index;
    var zhuanlan=this.data.zhuanlan;
    if(index==0){
      $Toast({
        content: '已是第一个'
    });
    }else{
      this.setData({
        index:index-1,
        current_time:'00:00',
        play:true
      })
      this.player()
    }
  },
  //点赞某视频
  like:function(e){
    var that=this;
    var is_like=that.data.is_like;
    var id=that.data.zhuanlan_id;
    var openid=wx.getStorageSync('openid');
    var userInfo=wx.getStorageSync('userInfo')
    if(userInfo){
      wx.request({
        url: app.globalData.url+'index/Zhuanlan/likeAudio',
        data:{
          id:id,
          openid:openid
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res){
          console.log(res.data)
          that.setData({
            is_like:is_like*-1+1
          })
        }
      })
    }else{
      app.login()
    }
  },

  //分享按钮
  handleOpen1 () {
    this.setData({
        visible1: true
    });
},
handleCancel1 () {
  this.setData({
      visible1: false
  });
},
handleClickItem1 ({ detail }) {
  this.setData({
    visible1: false
  })
  //生成分享卡片或分享好友
  const index = detail.index + 1;
  console.log(index)
  if(index==2){
    this.shengcheng()
  }
},

shengcheng:function(){
  var that=this;
  var id = this.data.zhuanlan_id;
  that.setData({
    maskHidden:true,
    imagePath:''
  })
   //生成推广码
   wx.showLoading({
    title: '生成中…',
  })
  wx.request({
    // url: 'http://localhost/wx/getCode.php', 
    url: app.globalData.url + 'index/Qrcode/getWXACode',
    data: {
      scene: id,
      width: 280,
      page: 'pages/zhuanlan/zhuanlan'
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {
      console.log(res.data)
      that.setData({
        wxcode: 'https://icloudapi.cn/efire/' + res.data
      })
      //生成海报
      that.shengcheng1()
    }
  })
},
//生成推广海报
shengcheng1: function () {
  var that = this;
  setTimeout(function () {
    that.createNewImg();
  }, 1000)
},
createNewImg: function () {
  var that = this;
  console.log(that.data.wxcode)
  var rpx = that.data.rpx;
  var canvas_width = that.data.canvas_width;
  var canvas_height = that.data.canvas_height;
  // var bk = '/img/spread_bk.png';
  var bk =that.data.top_img;
  var headImg=that.data.tea_img;
  var tea_name=that.data.author;
  var tea_info=that.substr(that.data.tea_info,16);
  var title=that.substr(that.data.zhuanlan_title,16);
  var Qrcode=that.data.wxcode;
  var tip='长按识别小程序码查看专栏';
  var context = wx.createCanvasContext('mycanvas');
  //画白色矩形
  context.setFillStyle('white')
  context.fillRect(0, 0, canvas_width, canvas_height)
  context.save()//保存原始画布
  // context.draw()
  

  //绘制姓名
  context.font="normal bold 40px sans-serif"
  // context.setFontSize(32 * rpx);
  context.setTextAlign('center')
  context.setFillStyle('#515151');
  context.fillText(tea_name, canvas_width/2, 520*rpx)
  //绘制简介
  context.font="normal 300 28px sans-serif"
  context.setTextAlign('center');
  context.setFillStyle('#7E7E7E')
  context.fillText(tea_info,canvas_width/2, 580*rpx)
  //绘制分割线
  context.beginPath()
  context.setLineWidth(5)
  context.moveTo(canvas_width/2-40*rpx,640*rpx)
  context.lineTo(canvas_width/2+40*rpx,640*rpx)
  context.setStrokeStyle('#FF5400')
  context.stroke()
  //绘制标题
  context.font="normal bold 44px sans-serif"
  context.setTextAlign('center')
  context.setFillStyle('#515151')
  context.fillText(title,canvas_width/2,750*rpx)
  //绘制提示
  context.font="normal 300 26px sans-serif"
  context.setTextAlign('center');
  context.setFillStyle('#7E7E7E')
  context.fillText(tip,canvas_width/2, canvas_height-30*rpx)



  context.save();
  // context.draw(true);

  //不规则背景块
  context.beginPath()
  context.arc(0, 50*rpx, 10*rpx, 0, 2 * Math.PI)
  context.setFillStyle('red')
  context.fill()

  context.beginPath()
  context.arc(canvas_width, 50*rpx, 10*rpx, 0, 2 * Math.PI)
  context.setFillStyle('blue')
  context.fill()

  context.beginPath()
  context.arc(canvas_width/2, 200*rpx, 10*rpx, 0, 2 * Math.PI)
  context.setFillStyle('lightgreen')
  context.fill()


  context.setFillStyle('black')
  context.setFontSize(12*rpx)

  context.beginPath()
  context.moveTo(0, 50*rpx)
  context.lineTo(canvas_width/2, 200*rpx)
  context.lineTo(canvas_width, 50*rpx)
  context.setStrokeStyle('#AAAAAA')
  context.stroke()

  //不规则区域
  context.beginPath()
  context.moveTo(0, 0)
  context.lineTo(0,300*rpx)
  context.quadraticCurveTo(canvas_width/2, 440*rpx, canvas_width, 300*rpx)
  context.lineTo(canvas_width,0)
  context.setStrokeStyle('black')
  context.fill()
  context.clip()
  // context.stroke()
  //填充不规则区域
  common.getImgInfo(bk)
    .then(res=>{
      context.drawImage(res.path, 0, 0, canvas_width,440*rpx);
      context.draw(true)
      // context.restore()
      //绘制教师头像
      common.getImgInfo(headImg)
      .then(res=>{
        // context.save()
        context.beginPath()
        context.arc(canvas_width/2, 370*rpx, 85 * rpx, 0, 2 * Math.PI) //圆形框
        context.setStrokeStyle('white')
        context.setLineWidth("12");
        context.stroke()
        context.fill()
        context.clip()
        context.drawImage(res.path, canvas_width/2-85*rpx, 285*rpx, 170 * rpx, 170 * rpx)
        // context.restore()
        //绘制分享码
        common.getImgInfo(Qrcode)
        .then(res=>{
          // context.restore()
          context.beginPath()
          context.arc(canvas_width/2,canvas_height-150*rpx,85 * rpx, 0, 2 * Math.PI)
          context.fill()
          context.clip()
          context.drawImage(res.path,canvas_width/2-85*rpx,canvas_height-235*rpx,170 * rpx, 170 * rpx)
          context.draw(true)
          // context.restore()
        })
        context.draw(true)
        context.restore()
      })
      context.draw(true);
      context.restore()
    })
    
    // context.restore()
    context.draw()

   // 生成图片
   context.draw(true, setTimeout(function () {
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      quality: 1,
      canvasId: 'mycanvas',
      // width: that.data.canvas_width ,
      // height: that.data.canvas_height,
      destWidth: that.data.canvas_width,
      destHeight: that.data.canvas_height,
      success: function (res) {
        wx.hideLoading()
        var tempFilePath = res.tempFilePath;
        console.log(tempFilePath)
        that.setData({
          imagePath: tempFilePath,
          canvasHidden: true,
          save_btn:true
          // maskHidden: true
        });
      },
      fail: function (res) {
        console.log(res);
        wx.hideLoading()
        wx.showLoading({
          title: '网络繁忙，请稍后再试…',
        })
      }
    });
  }, 2000))
},
//点击保存到相册
baocun: function () {
  var that = this
  wx.saveImageToPhotosAlbum({
    filePath: that.data.imagePath,
    success(res) {
      that.setData({
        maskHidden:false,
        save_btn:false
      })
      wx.showToast({
        title: '已保存',
        icon: 'success',
        duration: 1000
      })
    }
  })
},
// 截取字符串,多余省略号显示
substr: function (val, num) {
  if (val.length == 0 || val == undefined) {
    return '';
  } else if (val.length > num) {
    return val.substring(0, num) + "...";
  } else {
    return val;
  }
},
hide:function(){
  this.setData({
    maskHidden:false,
    save_btn:false
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
    var id = this.data.zhuanlan_id;
    return {
      title: '向你推荐课程专栏',
      path: '/pages/zhuanlan/zhuanlan?id=' + id,
    }
  }
})