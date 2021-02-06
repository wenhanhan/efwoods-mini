// pages/ability_test_res/ability_test_res.js
import * as echarts from '../ec-canvas/echarts';
var barec = null
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: function (canvas, width, height,dpr) {
       barec = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
       });
       canvas.setChart(barec);
       return barec;
      }
     },
    //推荐课程
    courses:[
      {
        title:'网球课程一对一',
        img:'../img/recom.png',
        tag:['网球','体能培训']
      },
      {
        title:'网球课程一对一',
        img:'../img/recom.png',
        tag:['网球','体能培训']
      },
      {
        title:'网球课程一对一',
        img:'../img/recom.png',
        tag:['网球','体能培训']
      },
      {
        title:'网球课程一对一',
        img:'../img/recom.png',
        tag:['网球','体能培训']
      }
    ],
    //推荐私教
    teacher:[
      {
        name:'孙教练',
        intro:'从业五年',
        tag:'技巧',
        img:'/img/head.jpeg'
      },
      {
        name:'孙教练',
        intro:'从业五年',
        tag:'技巧',
        img:'/img/head.jpeg'
      },
      {
        name:'孙教练',
        intro:'从业五年',
        tag:'技巧',
        img:'/img/head.jpeg'
      },
      {
        name:'孙教练',
        intro:'从业五年',
        tag:'技巧',
        img:'/img/head.jpeg'
      }
    ],
    color:[
      '#CDADFF','#34A4FA','#FD8D32','#00DC8D'
    ],
    sub_id:null,//答题的id
    words:[],//评语
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      sub_id:options.sub_id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    setTimeout(this.getData, 500);
  },
  getData(){
    var that=this;
    var sub_id=that.data.sub_id;
    wx.showLoading({
      title: '测评生成中...',
     })
      wx.request({
        url: app.globalData.url + 'index/AbilityTest/setEcharts',
        data: {
          sub_id:sub_id
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res){
          that.setData({
            words:res.data[2]
          })
          barec.setOption({
            backgroundColor: "#ffffff",
            color: ["#fe8711", "#FF9F7F"],
            xAxis: {
              show: false
            },
            yAxis: {
              show: false
            },
            radar: {
              // shape: 'circle',
              indicator: res.data[1],
              splitLine:{
                show:true,
                lineStyle:{
                  color:'#C0C0C0',
                  shadowColor:'#FD8D32'
                }
              },
              splitArea:{
                show:true,
                areaStyle:{
                  color:['#FEDBBE','#FEDBBE']
                }
              }
            },
            series: [{
              name: '测试',
              type: 'radar',
              data: [{
                value: res.data[0],
                name: '预算',
                label:{
                  show:false,
                  position:'top',
                  color:'#fe8711',
                  fontSize:13
                },
                areaStyle:{
                  color:'#FD8D32'
                }
              }
              ]
            }]
          })
          wx.hideLoading(); 
        } 
    })
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