// pages/tea_detail/tea_detail.js
var common = require('../../utils/common.js');
const { $Message } = require('../../dist/base/index');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    renqi:0,
    xueyuan:0,
    fensi:0,
    xingbie:0,
    bk_img:'https://cdn.icloudapi.cn/bk.png',
    pixelRatio: '',//像素比
    rpx: '',//单位换算
    canvas_width: '',
    canvas_height: '',
    cover_img:false,
    tea_id: '', //教练个人身份id
    tea_openid:'',//教练openid
    student_openid:'',
    tea_name: '', //教师姓名
    tea_img: '', //头像
    introduce: '', //个人简介
    experience:'',//经验
    honor: '', //荣誉成就
    level: '', //级别
    phone:'',//电话
    video1: '',
    video2: '',
    video3: '',
    tag1: '',
    tag2: '',
    tag3: '',
    tea_judge:[],
    tea_judge_img:[],
    judge_num:'',
    wxcode: '', //小程序码本地路径
    iscontroll: false, //初始不显示默认的视频控制按钮
    pre_url: '',
    hidden: true,
    share: false,
    modal: false,
    animationData: {},
    localHead: '', //头像图片的本地路径
    favor_state: 0, //初始 教师喜欢状态为0
    scene_state:'',//扫码进入打开的场景
    home_state:false,//群聊进入打开的场景
    maskHidden: false,
    imagePath: '',
    localHead: '', //头像图片的本地路径
    favor_state: 0, //初始 教师喜欢状态为0
    com_id: '',//主评论id
    isjudge: false,
    focus: false,
    keyboard_height: 0,
    reply: '',
    cour_id: '',//回复的课程id
    tab:0,//初始在个人简介处
    more_state:false,
    more_state_style:false,
    tea_info:'',
    tea_video:[]
  }, 

  call: function () {
    if(app.globalData.freeze==1){
      wx.showToast({
        title: '你已被冻结',
        icon: 'loading',
        duration: 2000
      })
    }else{
      var phone = this.data.phone;
      wx.makePhoneCall({
        phoneNumber: phone,
        success: function (res) {
          console.log('拨打成功')
        },
      })
    } 
  },
  //视频点击事件
  play: function(e) {
    console.log(e)
    //第几个视频文件
    this.setData({
      iscontroll: true
    })
    var video_idx = e.currentTarget.dataset.videoidx;
    var cur_video = 'tea_video' + video_idx;
    this.videoContext = wx.createVideoContext(cur_video);
    // console.log(this.videoContext)
    this.videoContext.requestFullScreen();
  },

  bindplay:function(){
    this.setData({
      cover_img:true
    })
    var video_idx = e.currentTarget.dataset.videoidx;
    var cur_video = 'tea_video' + video_idx;
    this.videoContext = wx.createVideoContext(cur_video);
    // console.log(this.videoContext)
    this.videoContext.requestFullScreen();
  },
  //退出全屏
  closefullscreen: function(e) {
    this.setData({
      iscontroll: false
    })
    var video_idx = e.currentTarget.dataset.videoidx;
    var cur_video = 'tea_video' + video_idx;
    this.videoContext = wx.createVideoContext(cur_video);
    this.videoContext.exitFullScreen();
  },
  //视频切换全屏事件
  fullscreenchange:function(e){
    console.log(e)
    var state = e.detail.fullScreen;//判断全屏的状态
    var video_idx = e.currentTarget.dataset.videoidx;
    var cur_video = 'tea_video' + video_idx;
    this.videoContext = wx.createVideoContext(cur_video);
    if(!state){
      this.videoContext.exitFullScreen();
      // this.videoContext.stop();
      console.log('退出啦')
    }
  },
  //分享弹层动画事件
  share: function(e) {
    if (app.globalData.freeze == 1) {
      wx.showToast({
        title: '你已被冻结',
        icon: 'loading',
        duration: 2000
      })
    }else{
      console.log(e)
      var that = this;
      var animation = wx.createAnimation({
        duration: 300, //动画持续事件
        timingFunction: 'linear' //匀速
      })

      var modal_animation = wx.createAnimation({
        duration: 300, //动画持续事件
        timingFunction: 'linear' //匀速
      })

      that.animation = animation;
      that.modal_animation = modal_animation;

      animation.translateY(200).step();
      that.setData({
        animationData: animation.export(),
        modal_animationData: modal_animation.export(),
        share: true,
        modal: true
      })
      setTimeout(function () {
        animation.translateY(0).step()
        modal_animation.opacity(0.5).step();
        that.setData({
          share: true,
          modal: true,
          modal_animationData: modal_animation.export(),
          animationData: animation.export()
        })
      }, 100)
    } 
  },
  //遮罩点击隐藏
  hideModal: function() {
    var that = this;
    var animation = wx.createAnimation({
      duration: 400, //动画持续事件
      timingFunction: 'linear' //匀速
    })
    that.animation = animation;
    animation.translateY(200).step()
    that.setData({
      animationData: animation.export(),
      modal: false
    })
  },

  //分享关闭按钮
  share_close: function() {
    var that = this;
    var animation = wx.createAnimation({
      duration: 400, //动画持续事件
      timingFunction: 'linear' //匀速
    })
    that.animation = animation;
    animation.translateY(200).step()
    that.setData({
      animationData: animation.export(),
      modal: false
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var id =decodeURIComponent(options.scene);//教师id
    console.log(id)
    console.log(options)
    that.setData({
      tea_id: options.tea_id ? options.tea_id:id, //教练个人身份id
      scene_state:id=='undefined'?false:true,
    })
  },

  // 新的绘制方法
  shengcheng: function (e) {
    var that = this;
    this.setData({
      maskHidden: false
    });
    wx.showLoading({
      title: '生成中…',
    })
    setTimeout(function () {
      that.createNewImg();
    }, 1000)
  },
  //点击旁边遮罩隐藏
  hide: function () {
    var that=this;
    that.hideModal()
    this.setData({
      maskHidden: false
    })
  },
  //获取网络图片信息


  createNewImg: function () {
    var that = this;
    var rpx = that.data.rpx;
    var bk_img=that.data.bk_img;
    var xingbie=that.data.xingbie;
    var sex = xingbie==1?'/img/man.png':'/img/women.png';
    var level=that.data.level;
    var level_img = '/img/level/level'+level+'.png';
    var type = '/img/type.png';
    var fensi = '/img/fensi.png';
    var left = '/img/left.png';
    var right = '/img/right.png';
    var renqi=that.data.renqi;
    var xueyuan=that.data.xueyuan;
    var fensi_num=that.data.fensi;
    var tea_type = that.data.tea_type;
    var tag1 = that.substr(that.data.tag1, 3);
    var tag2 = that.substr(that.data.tag2, 3);
    var introduce = that.substr(that.ClearBr(that.data.introduce), 85);
    var canvas_width = that.data.canvas_width;
    var canvas_height = that.data.canvas_height;
    console.log(tag1)
    console.log(tag2)
    var tag1_box_length = tag1 ? 50 : 0;
    var tag2_box_length = tag2 ? 50 : 0;
    // console.log(tag2_box_length)
    var tea_name = that.data.tea_name;
    // console.log(tea_name)
    // var headImg = 'https://icloudapi.cn/efire/public/uploads/suolue/'+that.data.tea_img;
    // console.log(headImg)
    var context = wx.createCanvasContext('mycanvas');
    context.save();
    context.drawImage(bk_img, 0, 0, canvas_width, canvas_height);

    //绘制分享码
    console.log(that.data.tea_img)
    common.getImgInfo(that.data.tea_img)
    .then(res=>{
      context.save()
      context.beginPath()
      context.arc(90 * rpx, 420 * rpx, 40 * rpx, 0, 2 * Math.PI) //圆形框
      context.fill()
      context.clip()
      context.drawImage(res.path, 50 * rpx, 380 * rpx, 80 * rpx, 80 * rpx)
      common.getImgInfo(that.data.wxcode)
      .then(res=>{
        context.beginPath()
        context.arc(290 * rpx, 90 * rpx, 50 * rpx, 0, 2 * Math.PI) //圆形框
        context.fill()
        context.clip()
        context.drawImage(res.path, 240 * rpx, 40 * rpx, 100 * rpx, 100 * rpx)
        context.draw(true);
      })
      context.draw(true);
      context.restore()
    })
    

    //绘制文字
    context.setFontSize(20 * rpx);
    context.setFillStyle('#ffffff');
    context.fillText(renqi, 40 * rpx, 60 * rpx)
    context.draw(true);

    context.setFontSize(13 * rpx);
    context.setFillStyle('#ffffff');
    context.fillText('人气', 40 * rpx, 80 * rpx)
    context.draw(true);

    context.setFontSize(13 * rpx);
    context.setFillStyle('#ffffff');
    context.fillText('·——', 40 * rpx, 95 * rpx)
    context.draw(true);

    context.setFontSize(20 * rpx);
    context.setFillStyle('#ffffff');
    context.fillText(xueyuan, 40 * rpx, 130 * rpx)
    context.draw(true);

    context.setFontSize(13 * rpx);
    context.setFillStyle('#ffffff');
    context.fillText('学员', 40 * rpx, 150 * rpx)
    context.draw(true);

    context.setFontSize(13 * rpx);
    context.setFillStyle('#ffffff');
    context.fillText('·——', 40 * rpx, 165 * rpx)
    context.draw(true);

    context.setFontSize(20 * rpx);
    context.setFillStyle('#ffffff');
    context.fillText(fensi_num, 40 * rpx, 200 * rpx)
    context.draw(true);

    context.setFontSize(13 * rpx);
    context.setFillStyle('#ffffff');
    context.fillText('粉丝', 40 * rpx, 220 * rpx)
    context.draw(true);
    context.save();
    // 绘制矩形
    that.roundRectColor(context, (375 - 285) * rpx * 0.5, 374 * rpx, 285 * rpx, 130 * rpx, 14)
    that.roundRectColor(context, (375 - 295) * rpx * 0.5, 368 * rpx, 295 * rpx, 130 * rpx, 14)
    that.roundRectColor(context, (375 - 305) * rpx * 0.5, 360 * rpx, 305 * rpx, 130 * rpx, 14)

    context.setFontSize(16);
    context.setFillStyle('#434343');
    context.fillText(that.substr(tea_name,8), 140 * rpx, 400 * rpx)
    context.draw(true);
    context.save();
    context.restore();
    // 性别
    context.font = 'normal normal 16px';
    var tea_name_length = context.measureText(tea_name).width;
    console.log(tea_name_length);
    context.drawImage(sex, 145 * rpx + tea_name_length * rpx * 1.6, 380 * rpx, 14 * rpx, 14 * rpx);
    context.drawImage(level_img, 175 * rpx + tea_name_length * rpx * 1.6, 382 * rpx, 20 * rpx, 20 * rpx);

    context.drawImage(type, 70 * rpx, 470 * rpx, 23 * rpx, 23 * rpx);
    context.drawImage(fensi, 180 * rpx, 470 * rpx, 85 * rpx, 27 * rpx);

    //绘制个性标签

    that.roundRectRedColor(context, 140 * rpx, 435 * rpx, tag1_box_length, 15 * rpx, 16 * rpx);
    if(tag2.length>0){
      that.roundRectBlueColor(context, 210 * rpx, 435 * rpx, tag2_box_length, 15 * rpx, 16 * rpx);
    }
    context.font = 'normal normal 10px';
    var tag1_length = context.measureText(tag1).width * rpx;
    var tag2_length = context.measureText(tag2).width * rpx;
    var tag1_x = 140 * rpx + (tag1_box_length - tag1_length) * 0.5;
    var tag2_x = 210 * rpx + (tag2_box_length - tag2_length) * 0.5;

    context.setFontSize(10 * rpx);
    context.setFillStyle('#ffffff');
    context.fillText(tag1, tag1_x, 446 * rpx)
    context.draw(true);

    context.setFontSize(10 * rpx);
    context.setFillStyle('#ffffff');
    context.fillText(tag2, tag2_x, 446 * rpx)
    context.draw(true);

    context.setFontSize(12 * rpx);
    context.setFillStyle('#525252');
    context.fillText(tea_type, 95 * rpx, 485 * rpx)
    context.draw(true);

    context.setFillStyle('#ffffff');

    var height = that.drawText(context, introduce, 60 * rpx, 260 * rpx, canvas_width, canvas_width - 150 * rpx);
    console.log(height)
    context.drawImage(left, 40 * rpx, 240 * rpx, 22 * rpx, 22 * rpx);
    context.drawImage(right, canvas_width - 60 * rpx, height, 22 * rpx, 22 * rpx);

    // 生成图片

    context.draw(true, setTimeout(function () {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        quality: 1,
        canvasId: 'mycanvas',
        // width: that.data.canvas_width ,
        // height: that.data.canvas_height,
        destWidth: 3 * that.data.canvas_width,
        destHeight: 3 * that.data.canvas_height,
        success: function (res) {
          wx.hideLoading()
          var tempFilePath = res.tempFilePath;
          console.log(tempFilePath)
          that.setData({
            imagePath: tempFilePath,
            canvasHidden: true,
            maskHidden: true
          });
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }, 3000))

  },
  //去除换行 
  ClearBr:function(key) {
    key = key.replace(/<\/?.+?>/g, "");
    key = key.replace(/[\r\n]/g, "");
    return key;
  } ,

  //绘制圆角矩形
  //绘制圆角矩形
  roundRectColor: function (context, x, y, w, h, r) {  //绘制圆角矩形（纯色填充）
    // context.save();
    context.setFillStyle("#fff");
    context.setStrokeStyle('#fff')
    context.setLineJoin('round');  //交点设置成圆角
    context.setLineWidth(r);
    context.strokeRect(x + r / 2, y + r / 2, w - r, h - r);
    context.restore();
    // context.setShadow(0, 5, 6, '#eeeeee');
    context.fillRect(x + r, y + r, w - r * 2, h - r * 2);
    context.stroke();
    context.closePath();
  },

  roundRectRedColor: function (context, x, y, w, h, r) {  //绘制圆角矩形（纯色填充）
    // context.save();
    context.setFillStyle("#FF5E61");
    context.setStrokeStyle('#FF5E61')
    context.setLineJoin('round');  //交点设置成圆角
    context.setLineWidth(r);
    context.strokeRect(x + r / 2, y + r / 2, w - r, h - r);
    context.restore();
    // context.setShadow(0, 5, 6, '#eeeeee');
    context.fillRect(x + r, y + r, w - r * 2, h - r * 2);
    context.stroke();
    context.closePath();
  },

  roundRectBlueColor: function (context, x, y, w, h, r) {  //绘制圆角矩形（纯色填充）
    // context.save();
    context.setFillStyle("#78B6F7");
    context.setStrokeStyle('#78B6F7')
    context.setLineJoin('round');  //交点设置成圆角
    context.setLineWidth(r);
    context.strokeRect(x + r / 2, y + r / 2, w - r, h - r);
    context.restore();
    // context.setShadow(0, 5, 6, '#eeeeee');
    context.fillRect(x + r, y + r, w - r * 2, h - r * 2);
    context.stroke();
    context.closePath();
  },

  
  //保存分享图
  save: function() {
    var that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.data.pre_url,
      success(res) {
        wx.showModal({
          title: '保存成功',
          content: '图片已保存，分享到圈吧～',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success(res) {
            if (res.confirm) {
              var animation = wx.createAnimation({
                duration: 400, //动画持续事件
                timingFunction: 'linear' //匀速
              })
              that.animation = animation;
              animation.translateY(200).step()
              that.setData({
                hidden: true,
                animationData: animation.export(),
                modal: false
              })
            }
          }
        })
      }
    })
  },
  //文本换行 参数：1、canvas对象，2、文本 3、距离左侧的距离 4、距离顶部的距离 5、6、文本的宽度
  drawText: function(ctx, str, leftWidth, initHeight, titleHeight, canvasWidth) {
    var lineWidth = 0;
    var initHeight;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth) {
        ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
        initHeight += 22; //22为字体的高度
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += 30;
      }
      if (i == str.length - 1) { //绘制剩余部分
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
      }
    }
    // 标题border-bottom 线距顶部距离
    titleHeight = titleHeight + 10;
    return initHeight
  },
  teaType: function (id, arr) {
    var i = 0;
    while (i < arr.length) {
      if (arr[i].Id == id) {
        return arr[i].type;
        break;
      }
      else {
        i++;
      }
    }
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
  //点击保存到相册
  baocun: function () {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              that.hideModal()
              /* 该隐藏的隐藏 */
              that.setData({
                maskHidden: false
              })
            }
          }, fail: function (res) {
            console.log(11111)
          }
        })
      }
    })
  },


  //收藏教师
  favor: function(e) {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');//用户信息
    var tea_id = e.currentTarget.dataset.tea_id;
    var openid = wx.getStorageSync('openid');
    var state = that.data.favor_state
    //首先判断是否授权登录
    if(userInfo){
      //判断用户是否被冻结
      if (app.globalData.freeze == 1) {
        wx.showToast({
          title: '你已被冻结',
          icon: 'loading',
          duration: 2000
        })
      } else {
        that.setData({
          favor_state: -1 * state + 1 //收藏状态
        })
        wx.request({
          url: app.globalData.url + 'index/Person/favorTeacher',
          data: {
            favor_state: that.data.favor_state,
            openid: openid,
            tea_id: tea_id,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res.data)
            common.news(1, '', tea_id, that.data.favor_state)
            if (that.data.favor_state == 1) {
              wx.showToast({
                title: '已加入喜欢',
                icon: 'success',
                duration: 1000
              })
            } else {
              wx.showToast({
                title: '已取消喜欢',
                icon: 'success',
                duration: 1000
              })
            }
          }
        })
      }
    }else{
      //返回授权1
      app.login()
    }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //判断教师收藏与否
    var that = this;
    var pages = getCurrentPages();//当前页面栈
    var tea_id = that.data.tea_id;
    var openid = wx.getStorageSync('openid');
    var idx=that.data.tab;
    console.log(pages)
    if (pages.length == 1) {
      //分享页面进入 绘制顶部栏加主页返回
      that.setData({
        home_state: true
      })
    }
    //获取机器屏幕宽度
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          pixelRatio: res.pixelRatio,
          rpx: res.windowWidth / 375,
          canvas_width: res.screenWidth,
          canvas_height: 550 * (res.windowWidth / 375),
        })
      },
    })
    //网络背景图本地显示
     wx.getImageInfo({
      src: that.data.bk_img,
      success(res) {
        that.setData({
          bk_img:res.path
        })
      }
    })
    
    wx.removeStorageSync('new_city');//清除切换城市选择的新的城市
    wx.request({
      url: app.globalData.url +'index/Person/favorState',
      data:{
        openid:openid,
        tea_id:tea_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data)
        if(res.data==200){
          that.setData({
            favor_state: 1
          })
        }else{
          that.setData({
            favor_state: 0
          })
        }
      }
    })

    //请求教师信息
    wx.request({
      url: app.globalData.url + 'index/Teacher/selectTeacher',
      data: {
        tea_id: tea_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          tea_video: res.data.video,//教师视频
          tea_name: res.data.tea_info.name, //教师姓名
          tea_img: res.data.tea_info.teaImg, //头像
          introduce: res.data.tea_info.introduce, //个人简介
          honor: res.data.tea_info.honor, //荣誉成就
          experience:res.data.tea_info.experience,//工作经验
          level: res.data.tea_info.level, //级别
          tag1: res.data.tea_info.tag1,
          phone:res.data.tea_info.phone,
          tag2: res.data.tea_info.tag2?res.data.tea_info.tag2:'',
          tag3: res.data.tea_info.tag3,
          xingbie:res.data.tea_info.sex,
          tea_openid:res.data.tea_info.openid,
          student_openid:wx.getStorageSync('openid'),
          tea_type: that.teaType(res.data.tea_info.field, app.globalData.cour_type),
          renqi:res.data.renqi,
          fensi:res.data.fensi,
          xueyuan:res.data.xueyuan
        })
        that.tab(idx)
        //生成分享二维码
        wx.request({
          url: app.globalData.url + 'index/Qrcode/getWXACode',
          data: {
            scene: that.data.tea_id,
            width: 280,
            page: 'pages/tea_detail/tea_detail'
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res.data)
            that.setData({
              wxcode: 'https://icloudapi.cn/efire/' + res.data
              //  wxcode:'http://localhost/wx/img/1552113759.jpg'
            })
          }
        })
        

      }
    })
    //获取教师的全部相关课程评价
    that.get_judge(tea_id)
    // wx.request({
    //   url: app.globalData.url +'index/Teacher/getAllJudge',
    //   data:{
    //     tea_id:tea_id
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success(res){
    //     console.log(res.data)
    //     wx.setStorageSync('judge', res.data[0])
    //     wx.setStorageSync('judge_img', res.data[1])
    //     that.setData({
    //       judge_num: res.data[0].length,
    //       tea_judge: res.data[0],
    //       tea_judge_img: res.data[1]
    //     })
    //   }
    // })
  //获取该教师主要授课信息
  wx.request({
    url: app.globalData.url + 'index/Teacher/getAllCourse',
    data:{
      tea_id:tea_id,
      latitude:wx.getStorageSync('address').location.lat,
      longitude:wx.getStorageSync('address').location.lng
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res){
      that.setData({
        main_tea:res.data
      })
    }
  })
  }, 
  //图片预览
  previewImage: function (e) {
    var current = e.target.dataset.src;
    var index = e.target.dataset.index;
    console.log(this.data.tea_judge_img[index])
    var arr = new Array();
    for(let i in this.data.tea_judge_img[index]){
      if(this.data.tea_judge_img[index][i]){
        arr.push('https://icloudapi.cn/efire/public/uploads/judge/'+this.data.tea_judge_img[index][i])
      }
    }
    this.setData({
      tea_judge_img: arr
    })
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.tea_judge_img
    })
  },
  home:function(e){
    console.log(e)
    wx.switchTab({
      url: '../index/index',
    })
  },

  //删除视频
  deleteVideo:function(e){
    console.log(e)
    var that=this;
    var openid = wx.getStorageSync('openid');
    var tea_openid=that.data.tea_openid;
    var tea_video = that.data.tea_video;
    var video_idx = e.currentTarget.dataset.videoidx;
    var video_name=e.currentTarget.dataset.name;
    if(openid==tea_openid){
      wx.showModal({
        title: '提示',
        content: '是否要删除此视频',
        success(res) {
          if (res.confirm) {
            tea_video.splice(video_idx, 1)
            wx.request({
              url: app.globalData.url +'index/Teainfo/deleVideo',
              data:{
                openid:openid,
                video_name:video_name
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success(res){
                console.log(res.data)
              }
            })
          } else if (res.cancel) {
            console.log(2)
          }
          that.setData({
            tea_video: tea_video
          })
          console.log(that.data.tea_video)
        }
      })
    }
  },
  //获取某教师的所有评价
  get_judge(tea_id) {
    var that = this;
    wx.request({
      url: app.globalData.url + 'index/Teacher/getAllJudge',
      data: {
        tea_id: tea_id,
        page: 1
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          judge_num: res.data[2],
          tea_judge: res.data[0],
          tea_judge_img: res.data[1]
        })
      }
    })
  },
  // 回复评论
  reply: function (e) {
    var userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      app.login()
    } else {
      console.log('回复评论')
      this.setData({
        isjudge: true,
        focus: true,
        userInfo: userInfo,
        cour_id: e.currentTarget.dataset.courid,//课程id
        com_id: e.currentTarget.dataset.comid
      })
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
  replyTxt: function (e) {
    console.log(e.detail.value)
    this.setData({
      reply: e.detail.value
    })
  },
  //提交回复评论
  send: function () {
    var that = this;
    var reply = that.data.reply.trim();//回复内容
    var comId = that.data.com_id;//主评论id
    var openid = wx.getStorageSync('openid')
    var courId = that.data.cour_id;//课程id
    var tea_id = that.data.tea_id;
    wx.request({
      url: app.globalData.url + 'index/Person/reply',
      method: 'POST',
      data: {
        openid: openid,
        courId: courId,
        content: reply,
        com_id: comId,
        type: 1
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg,
            icon: res.data.icon,
            duration: 1000
          })
          that.get_judge(tea_id)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: res.data.icon,
            duration: 1000
          })
        }
      }
    })
  },


switch_tab:function(e){
  var idx=e.currentTarget.dataset.idx*1;
  this.setData({
    tab:idx,
    more_state_style:false,
  })
  this.tab(idx)
},
tab:function(idx){
  var that=this;
  console.log(idx)
  switch (idx){
    case 0:
      this.setData({
        tea_info:this.data.introduce
      })
      break;
      case 1:
      this.setData({
        tea_info:this.data.honor
      })
      break;
      default:
      this.setData({
        tea_info:this.data.experience
      })  
  }
that.more_state()
},
more_state:function(){
  var that=this;
  const query = wx.createSelectorQuery();
  query.select('.tea_content').fields({
    size:true,
    context: true,
  },function(res){
    console.log(res)
    if(res.height>=270){
      that.setData({
        more_state:true
      })
    }else{
      that.setData({
        more_state:false
      })
    }
  }
  ).exec()
},
zhankai:function(){
  this.setData({
    more_state_style:true,
    more_state:false
  })
},
  //视频播放事件
  play: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.idx;//视频序号
    var video = that.data.tea_video[index];
    wx.navigateTo({
      url: '../../pages/show_des/show_des?video=' + video.video + '&title=' + encodeURIComponent(video.title) + '&name=' + encodeURIComponent(video.nickName) + '&img=' + video.avatarUrl + '&openid=' + video.openid + '&favor=' + video.favor + '&videoid=' + video.Id+'&cover='+encodeURIComponent(video.cover),
    })
  },
  //查看该教师的更多视频
  more_works:function(){
    var tea_openid=this.data.tea_openid;
    wx.navigateTo({
      url: '../../pages/all_shows/all_shows?openid='+tea_openid,
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var id = this.data.tea_id;
    common.judge(1)
    return {
      title: '向你推荐了小程序',
      path: '/pages/tea_detail/tea_detail?tea_id=' + id,
    }
  }
})