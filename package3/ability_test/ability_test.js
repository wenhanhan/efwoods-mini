// pages/ability_test/ability_test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    idx:0,
    imgUrls:[
      {
        url:'/package3/ability_test_res/ability_test_res',
        img:'https://cdn.icloudapi.cn/ability_test.png'
      }
    ],
    professional_test:[
      {
        type:'高尔夫',
        img:'https://cdn.icloudapi.cn/test_golf.png',
        url:''
      },
      {
        type:'足球',
        img:'https://cdn.icloudapi.cn/test_foot.png',
        url:''
      },
      {
        type:'篮球',
        img:'https://cdn.icloudapi.cn/test_basketball.png',
        url:''
      },
      {
        type:'排球',
        img:'https://cdn.icloudapi.cn/test_volleyball.png',
        url:''
      }
    ],
    hot_test:[
      {
        type:'素描',
        url:''
      },
      {
        type:'心理',
        url:''
      },
      {
        type:'注意力',
        url:''
      },
      {
        type:'体力',
        url:''
      }
    ],
    hot_test_list:[
      {
        img:'https://cdn.icloudapi.cn/test_example.png',
        title:'简单的测试来评估你的健身水平',
        type:'体能'
      },
      {
        img:'https://cdn.icloudapi.cn/test_example.png',
        title:'简单的测试来评估你的健身水平',
        type:'体能'
      },
      {
        img:'https://cdn.icloudapi.cn/test_example.png',
        title:'简单的测试来评估你的健身水平',
        type:'体能'
      },
      {
        img:'https://cdn.icloudapi.cn/test_example.png',
        title:'简单的测试来评估你的健身水平',
        type:'体能'
      },
      {
        img:'https://cdn.icloudapi.cn/test_example.png',
        title:'简单的测试来评估你的健身水平',
        type:'体能'
      },
      {
        img:'https://cdn.icloudapi.cn/test_example.png',
        title:'简单的测试来评估你的健身水平',
        type:'体能'
      }
    ]
  },
  handleType:function(e){
    var index=e.currentTarget.dataset.curindex;
    this.setData({
      idx:index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var leng=this.data.hot_test.length
    if(leng%4==0) return; 
    var add=4-leng%4
    var arr=this.data.hot_test;
    for(var i=0;i<add;i++){
      arr.push({
        type:'',
        url:''
      })
    }
    this.setData({
      hot_test:arr
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