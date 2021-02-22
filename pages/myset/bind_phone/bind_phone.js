// pages/myset/bind_phone/bind_phone.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:'',//先获取code，避免手机号获取异常
    phone:null,
    bindState:0
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
    var openid = wx.getStorageSync('openid');
    //查询绑定状态
    wx.request({
      url: app.globalData.url+'index/Index/bindState',
      data: {
        openid: openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data)
        that.setData({
          bindState:res.data
        })
      }
    })
    wx.login({
      success: (res) => {
        if(res.code){
          that.setData({
            code:res.code
          })
        }
      },
    })

  },
  //绑定手机号
  bindPhone:function(e){
    var that=this;
    var code=that.data.code;
    var openid = wx.getStorageSync('openid');
    var state=this.data.bindState;
    //获取手机号码
    if (e.detail.errMsg == "getPhoneNumber:fail user deny") return;
      //用户允许授权
      wx.showLoading({
        title: '正在绑定',
      })
      if(state==1){
        wx.showToast({
          title: '您已绑定',
          icon:'none'
        })
        return;
      }
       //2. 访问登录凭证校验接口获取session_key、openid
       wx.request({
        url: app.globalData.url + 'index/index/getUserOpenid',
        data: {
          code: code
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res)
          //3.解密
          if (res.statusCode == 200) {
            wx.request({
              url: app.globalData.url + 'index/Phone/getPhoneNumber',
              data: {
                'encryptedData': e.detail.encryptedData,
                'iv': e.detail.iv,
                'session_key': res.data.session_key
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success(res1) {
                wx.hideLoading()
                console.log(res1)
                console.log(res1.data.phoneNumber)//有时候获取不到
                if (res1.statusCode == 200 && res1.data.phoneNumber) {
                  that.setData({
                    phone: res1.data.phoneNumber
                  })
                  //开始绑定手机号
                  wx.request({
                    url: app.globalData.url+'index/Index/bindPhone',
                    data: {
                      openid: openid,
                      phone:res1.data.phoneNumber
                    },
                    header: {
                      'content-type': 'application/json' // 默认值
                    },
                    success(res2){
                      console.log(res2.data)
                      wx.showToast({
                        title: res2.data.msg,
                        icon:res2.data.code==200?'success':'loading',
                        success(res){
                          setTimeout(function(){
                            wx.switchTab({
                              url: '../../myset/coach/coach',
                            })
                          },2000)
                        }
                      })
                    }
                  })
                }
              },
              fail: function (err) {
                console.log(err);
              }
            })
          }
        }
      }) 
  },
  //解除绑定
  unbind:function(){
    var that=this;
    var openid = wx.getStorageSync('openid');
    var state=this.data.bindState;
    if(state==0){
      wx.showToast({
        title: '您还未绑定',
        icon:'none'
      })
      return;
    }
    wx.showModal({
      title: '解除绑定',
      content: '确定要解除绑定？',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: app.globalData.url + 'index/Index/unBindPhone',
            data: {
              openid: openid
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res){
              console.log(res.data)
              wx.showToast({
                title: res.data.msg,
                icon:res.data.code==200?'success':'loading',
                success(res){
                  setTimeout(function(){
                    wx.switchTab({
                      url: '../../myset/coach/coach',
                    })
                  },2000)
                }
              })
            }
        })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
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

  }
})