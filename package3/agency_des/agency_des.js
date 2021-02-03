// package3/agency_des/agency_des.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    qrcode:'https://cdn.icloudapi.cn/xingzhi_qrcode.png',
    tab_idx:0,
    tab:[{name:'关于兴致',id:'about'},{name:'留学简介',id:'intro'},{name:'兴致服务',id:'service'},{name:'客座教练',id:'professor'}],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    imgUrls:[
      {
        url:'',
        img:'../img/agency_banner.png'
      },
      {
        url:'',
        img:'../img/agency_banner.png'
      }
    ],
    agency:{
      intro:'兴致体育教育是北京兴致体育股份有限公司旗下专注体育教育的专业团队。兴致体育教育凭借优质的青训资源优势帮助中国青少年打通学生运动员申请美国名校之路，让中国的青少年能够凭借自身的运动竞技能力享受到世界顶尖的体育和学术教育。动竞技能力享受到世界顶尖的体育和学术教育动竞技能力享受到世界顶尖的体育和学术教育动竞技能力享受到世界顶尖的体育和学术教育动竞技能力享受到世界顶尖的体育和学术教育',
      liuxue:'https://cdn.icloudapi.cn/new_liuxue_intro.png'
    },
    about_height:'370rpx',
    liuxue_height:'auto',
    about_display:'-webkit-box',
    view_status:'查看更多',
    deg:'0deg',
    position:'absolute',
    tab_position:'relative',
    item_top_height:'',//点击项距离顶端高度
    //状态栏的高度
    top_bar_height:'',
    scroll_height:'',//滚动高度
  },
  view:function(){
    this.setData({
      about_height:this.data.about_height=='auto'?'370rpx':'auto',
      about_display:this.data.about_display=='-webkit-box'?'block':'-webkit-box',
      view_status:this.data.view_status=='查看更多'?'收起':'查看更多',
      deg:this.data.deg=='0deg'?'180deg':'0deg',
      position:this.data.position=='absolute'?'relative':'absolute'
    })
  },
  tab:function(e){
    let query = wx.createSelectorQuery();
    var id='#'+e.currentTarget.dataset.id;
    var h=this.data.scroll_height;
    this.setData({
      tab_idx:e.currentTarget.dataset.idx
    })
    query.select(id).boundingClientRect(
      (rect) => {
        let top = rect.top;//筛选导航距离上边界的大小
        console.log(top);
        console.log(h)
        //页面滑动定位
        wx.pageScrollTo({
          scrollTop: top+h-100,
          duration: 300
        })
      }
    ).exec();
  },
  onPageScroll: function(res) {
    // console.log(res);
    var swiper_height=this.data.swiper_height
    if(res.scrollTop>=swiper_height){
      //将导航栏定位
      this.setData({
        tab_position:'fixed',
        scroll_height:res.scrollTop
      })
    }else{
      this.setData({
        tab_position:'relative',
        scroll_height:res.scrollTop
      })
    }
},
contact:function(){
  wx.makePhoneCall({
    phoneNumber: '4001015528'
  })
},
scan:function(){
  var qrcode=this.data.qrcode
  wx.previewImage({
    current: qrcode, // 当前显示图片的http链接
    urls: [qrcode] // 需要预览的图片http链接列表
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    let query = wx.createSelectorQuery();
    query.select('#swiper').boundingClientRect(
      (rect) => {
        let top = rect.top;//轮播图距离上边界的大小
        this.setData({
          top_bar_height: top
        })
        console.log('顶部导航高度' + top)
      }
    ).exec();
    query.select('#tab_bar').boundingClientRect(
      (rect) => {
        let top = rect.top;//筛选导航距离上边界的大小
        this.setData({
          swiper_height: top-this.data.top_bar_height
        })
        console.log('轮播图高度' + this.data.swiper_height)
      }
    ).exec();
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