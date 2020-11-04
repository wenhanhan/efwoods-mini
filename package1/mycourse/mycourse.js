// pages/myset/mycourse/mycourse.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_cour: false,
    is_checking_cour:false,
    is_refuse_cour:false,
    cour_list:[],
    current: 'tab2',
    current_scroll: 'tab2',
    checking_list:[],//审核中的课程
    refuse_list:[]//已拒绝课程
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
    var that=this;
    var openid=wx.getStorageSync('openid');
    wx.removeStorageSync('is_edit_set_yuyue');//很重要的交互 退出清除预约信息
    wx.removeStorageSync('is_set_yuyue');//很重要的交互 退出清除预约信息
    //审核通过的课程
    wx.request({
      url: app.globalData.url +'index/Course/seleCourse',
      data:{
        'openid':openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data.length)
        var is_cour=res.data.length==0?true:false
        console.log(is_cour)
        that.setData({
          cour_list:res.data,
          is_cour:is_cour
        })
      }
    })
    //审核中的课程
    wx.request({
      url: app.globalData.url + 'index/Course/seleCheckingCourse',
      data: {
        'openid': openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        var is_checking_cour = res.data.length == 0 ? true : false
        console.log(is_checking_cour)
        that.setData({
          checking_list: res.data,
          is_checking_cour: is_checking_cour
        })
      }
    })
    //被拒绝的课程
    wx.request({
      url: app.globalData.url + 'index/Course/seleRefuseCourse',
      data: {
        'openid': openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        var is_refuse_cour = res.data.length == 0 ? true : false
        console.log(is_refuse_cour)
        that.setData({
          refuse_list: res.data,
          is_refuse_cour: is_refuse_cour
        })
      }
    })

  },

  //删除课程
  deleCourse: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.idx;//课程序号
    var id = e.currentTarget.dataset.id;//课程id
    var cour_list = that.data.cour_list;//已审核课程
    var checking_list=that.data.checking_list;//审核中课程
    var refuse_list=that.data.refuse_list;//已拒绝课程
    var type = e.currentTarget.dataset.type;//删除课程的分类
    wx.showModal({
      title: '删除确认',
      content: '删除后无法恢复哦',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: app.globalData.url + 'index/Course/deleteCourse',
            data: {
              id: id
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res.data)
              switch(type){
                case 'checking':
                console.log('checking')
                  checking_list.splice(index,1) 
                  var is_checking_cour=checking_list.length==0?true:false
                  that.setData({
                    checking_list:checking_list,
                    is_checking_cour:is_checking_cour
                  })
                  break;
                case 'checked':
                console.log('checked')
                 cour_list.splice(index, 1)
                  var is_cour = cour_list.length == 0 ? true : false
                  that.setData({
                    cour_list: cour_list,
                    is_cour: is_cour
                  })
                  break;
                case 'refuse':
                console.log('refuse')
                refuse_list.splice(index,1)
                  var is_refuse_cour=refuse_list.length==0?true:false
                  that.setData({
                    refuse_list:refuse_list,
                    is_refuse_cour:is_refuse_cour
                  })
                  break; 
              }
              
            }
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  add_btn:function(){
    //开启消息提醒
    wx.requestSubscribeMessage({
      tmplIds: ['TBOsPfOzDlatnitIJZmTClEZcVo_a5kueFfNqSiHPP4'],
      success(res){
        console.log(res)
        if(res['TBOsPfOzDlatnitIJZmTClEZcVo_a5kueFfNqSiHPP4']=='accept'){
          wx.navigateTo({
            url: '../addCourse/addCourse',
          })
        }else{ 
          wx.navigateTo({
            url: '../addCourse/addCourse',
          })
        }
      },
      fail(res){
        console.log('fail')
        wx.navigateTo({
          url: '../addCourse/addCourse',
        })
      }
    })
  },
  handleChange({ detail }) {
    console.log(detail)
    this.setData({
      current: detail.key
    });
  },

  handleChangeScroll({ detail }) {
    console.log(detail)
    this.setData({
      current_scroll: detail.key
    });
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