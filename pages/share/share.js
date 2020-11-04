// pages/share/share.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    share_openid: '',
    scene: '',
    invite:false,  
    agency_code: '',//机构入驻状态码
    teacher_code:'',//教师入驻状态码  
  },
  //分享页面 需获取用户unionId后存储 //待完善 判断unicode缓存跳转
  onGotUserInfo: function (e) {  
    var that = this;
    var share_openid=that.data.share_openid;
    var type=e.currentTarget.dataset.type;//入驻类型
    var sessionKey = wx.getStorageSync('session_key');
    var teacher_code=that.data.teacher_code;//教师的状态
    var agency_code=that.data.agency_code;//机构的状态
    console.log(e)
    wx.setStorageSync('userInfo', e.detail.userInfo)
    if (e.detail.userInfo){
      //获取unionId
      wx.request({
        url: app.globalData.url +'index/Open/getUnionId',
        data:{
          appid: 'wx475a3683acbb603d',
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          sessionKey: sessionKey
        },
        header: { 
          'content-type': 'application/json' // 默认值
        },
        success(res){
          //获取unionId后存储用户信息
          if (res.data.code == 0) {
            var info = JSON.parse(res.data.info)
            wx.setStorageSync('unionId', info.unionId)
            //1、存储用户信息2、回退页面
            wx.request({
              url: app.globalData.url + 'index/index/insertUserInfo',
              data: {
                openid: wx.getStorageSync('openid'),
                nickName: e.detail.userInfo.nickName,
                sex: e.detail.userInfo.gender,
                avatarUrl: e.detail.userInfo.avatarUrl,
                unionId: info.unionId,
                share_openid:type=='student'?share_openid:''//新增邀请人
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success(res) {
                console.log(res.data)
                //同意授权以后跳转
                if (type == 'tea') {
                  if(teacher_code==200){
                    wx.showToast({
                      title: '您已是私教',
                      icon:'none',
                      duration:1000
                    })
                    return
                  }else if(teacher_code==401){
                    //第一次提交
                    wx.navigateTo({
                      url: '../apply/apply?share_openid=' + share_openid,
                    })
                  }else if(teacher_code==402){
                    //未支付
                    wx.navigateTo({
                      url: '../agency_pay/agency_pay?type=2',
                    })
                  }else if(teacher_code==201){
                    //审核未通过
                    wx.navigateTo({
                      url: '../fail_checked/fail_checked?type=2',
                    })
                  }else if(teacher_code==202){
                    //正在审核
                    wx.navigateTo({
                      url: '../checking/checking',
                    })
                  }
                  
                } else if(type=='agency') { 
                  //检查机构的申请状态
                  if(agency_code==200){
                    //机构已经入住
                    wx.navigateTo({ 
                      url: '../settled/settled',
                    })
                    return
                  }else if(agency_code==401){
                    //第一次提交
                    wx.navigateTo({
                      url: '../agency_apply/agency_apply?share_openid=' + share_openid,
                    })
                  }else if(agency_code==402){
                    //未支付审核费用
                    wx.navigateTo({
                      url: '../agency_pay/agency_pay?type=1',
                    })
                  }else if(agency_code==201){
                    //审核未通过
                    wx.navigateTo({
                      url: '../fail_checked/fail_checked?type=1',
                    })
                  }else if(agency_code==202){
                    //正在审核
                    wx.navigateTo({
                      url: '../checking/checking',
                    })
                  }
                  
                }else{
                  //返回主页 
                  console.log('返回主页')
                  wx.navigateTo({
                    url: '../location/location',
                  })
                }
              }
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
    //判断进入的场景
    var that=this;
    var share_openid = options.share_openid;
    var scene = options.scene;
    console.log(scene)
    console.log(share_openid)
    if (share_openid || scene) {
      that.setData({
        invite: true,
        share_openid: share_openid ? share_openid : scene
      })
    }
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
    //查询申请的进度
     //判断用户是否进行教师申请
     var openid=wx.getStorageSync('openid');
     var that=this;
     wx.request({
      url: app.globalData.url + 'index/Apply/applyState',
      data: {
        'openid': openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data.msg)
        console.log(res.data)
        that.setData({
          teacher_code: res.data.code
        })
      }
    }) 
     //判断用户是否进行机构入驻
     wx.request({
      url: app.globalData.url + 'index/Agency/applyState',
      data: {
        'openid': openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data.msg)
        console.log(res.data.code)
        that.setData({ 
          agency_code: res.data.code
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})