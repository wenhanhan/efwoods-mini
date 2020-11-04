// pages/judge/judge.js
var common = require('../../utils/common.js');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: false,
    files: [],
    id:'',
    star_num: 0,
    content:'',//评价内容
    cour_id:'',//评价课程的id
    state:'',//评价来源页面
    integral:0//积分数
  },
  //评价内容
  input:function(e){
    console.log(e.detail.value)
    this.setData({
      content:e.detail.value
    })
  },
//星级打分
  onChange2(e) {
    const index = e.detail.index;
    // 星星的个数console.log(index)
    this.setData({
      star_num: index
    })
  },
  close: function () {
    this.setData({ active: false });
    wx.navigateBack({
      delta: 1
    })
  },
  //图片上传
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  //删除图片
  deleteImg:function(e){
    var that = this;
    var files = that.data.files;
    var index = e.currentTarget.dataset.imgidx;//获取当前长按图片下标
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定了');
          files.splice(index, 1);
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
        that.setData({
          files: files
        });
      }
    })
  },
//评价提交
  submit:function(){
     var that=this;
     var openid=wx.getStorageSync('openid');//个人身份
     var content=that.data.content;
     var star_num=that.data.star_num;
     var files=that.data.files;
     var state=that.data.state;
     var cour_id=that.data.cour_id;
    if(!content){
      wx.showToast({
        title: '请填写评价吧～',
        icon:'loading',
        duration:1000
      })
    }else if(!star_num){
      wx.showToast({
        title: '请打个分数吧～',
        icon: 'loading',
        duration: 1000
      })
    }else{
      console.log('开始提交') 
      wx.request({
        url: app.globalData.url+'index/Person/judge',
        data:{
          openid:openid,
          courId:cour_id,
          content:content,
          star:star_num,
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res){
          common.news(2, cour_id, '', 0)
          console.log(res.data)
          if(files.length==0){
           common.judge(3)
           .then(res=>{
             console.log(res.data)
              if(res.data.code==200){
              that.setData({
                integral:res.data.score,
                active:true
              })
            }else{
              that.setData({
                active:true,
                integral:res.data.score
              })
            }
           })
          
          }else{
            for (var i = 0; i < files.length; i++) {
              console.log(res.data)
              wx.uploadFile({
                url: app.globalData.url + 'index/Person/judgeImg',
                filePath: files[i],
                name: 'img',
                formData: {
                  id: res.data,//主键id
                  order: i
                },
                success(res) {
                  console.log(res.data)
                  if (i == files.length && state == 0){
                    common.judge(3)
                    .then(res => {
                      console.log(res.data)
                      if (res.data.code == 200) {
                        that.setData({
                          integral: res.data.score,
                          active: true
                        })
                      } else {
                        that.setData({
                          active: true,
                          integral: res.data.score
                        })
                      }
                    })
                  } else if (i == files.length && state == 1){
                    common.judge(3)
                      .then(res => {
                        console.log(res.data)
                        if (res.data.code == 200) {
                          that.setData({
                            integral: res.data.score,
                            active: true
                          })
                        } else {
                          that.setData({
                            active: true,
                            integral: res.data.score
                          })
                        }
                      })
                  }
                }
              })
            }
          }
               
        }
      })

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        cour_id:options.cour_id,
        state:options.state?1:0
      })
      console.log(this.data.cour_id)
      console.log(this.data.state)
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


})