var app=getApp();
const { $Toast } = require('../../dist/base/index');
Page({
  data: {
    html:'',//课程内容
    formats: {},
    readOnly: false,
    placeholder: '点击编辑...',
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false,
    cour_id:''//课程id
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad(options) {
    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({ isIOS})
    const that = this
    this.updatePosition(0)
    this.setData({
      cour_id:options.cour_id
    })
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)

    })
  },
  onShow(){
    var that=this;
    //初始化内容
    
  },
  getHtml:function(id){
    var that=this;
    wx.request({
      url: app.globalData.url+'index/Course/getCourseContent',
      data:{
        cour_id:id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data)
        //初始化内容
        that.editorCtx.setContents({
          html:res.data,
          success:()=>{
              console.log('渲染成功')
              wx.hideLoading({
                complete: (res) => {},
              })
          }
        })
      }
    })
  },
  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const { windowHeight, platform } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : (windowHeight-70)
    this.setData({ editorHeight, keyboardHeight })
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const { statusBarHeight, platform } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {
    const that = this;
    wx.showLoading({
      title: '加载中',
    })
    var is_edit_set_courDes=wx.getStorageSync('is_edit_set_courDes');//是否保存过课程详情
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
      var cour_id=that.data.cour_id;
      if(is_edit_set_courDes){
        //读取上次保存的图文信息
        that.editorCtx.setContents({
          html:wx.getStorageSync('edit_cour_des'),
          success:()=>{ 
            wx.hideLoading({
              complete: (res) => {},
            })
                    }
        })
      }else{
        //从服务器拉取信息
        that.getHtml(cour_id)
      }
    }).exec()
    // that.getHtml()
  },
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {
    console.log(e)
    const formats = e.detail
    this.setData({ formats })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        //提交服务器
        wx.showLoading({
          title: '正在上传',
        })
        console.log(res)
        wx.uploadFile({
          filePath: res.tempFilePaths[0],
          name: 'img',
          url: app.globalData.url + 'index/Course/uploadCourseImg',
          formData: {
            'file': 'test'
          },
          success(ret){
            console.log(ret)
            that.editorCtx.insertImage({
              src: that.trim(ret.data),
              data: {
                id: 'abcd',
                role: 'god'
              },
              width: '80%',
              success: function () {
                console.log('insert image success')
                wx.showToast({
                  title: '上传成功',
                  icon:'success',
                  duration:1000
                })
              }
            })
          }
        })
      }
    })
  },
   //去除字符串前后空格
   trim: function (str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
  },
  save:function(){
    //将富文本内容生成html
    console.log(this.editorCtx)
    //先将内容转为html
    this.editorCtx.getContents({
      success(res){
        console.log(res)
        var text=res.text.replace(/\s+/g,"");
        if(!text){
          $Toast({
            content: '请输入课程内容'
        });
        return
        }
        //放入缓存
        $Toast({
          content: '正在保存',
          type: 'loading',
          duration:0
      });
      wx.setStorageSync('edit_cour_des', res.html)
      wx.setStorageSync('is_edit_set_courDes', true)
      setTimeout(function(){
        $Toast.hide();
        $Toast({
          content: '保存成功',
          type: 'success'
      });
      wx.navigateBack({
        delta:1
      })
      },1000)
      }
    })
  }
})
