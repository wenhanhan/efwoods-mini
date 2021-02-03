// pages/ability_test_res/ability_test_res.js
import * as echarts from '../ec-canvas/echarts';
const app = getApp();
function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
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
      indicator: [{
        name: '技巧',
        max: 500,
        color:'#fe8711'
      },
      {
        name: '基础',
        max: 500,
        color:'#fe8711'
      },
      {
        name: '体能',
        max: 500,
        color:'#fe8711'
      },
      {
        name: '稳定性',
        max: 500,
        color:'#fe8711'
      },
      {
        name: '心理',
        max: 500,
        color:'#fe8711'
      }
      ],
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
        value: [430, 340, 500, 300, 490],
        name: '预算',
        label:{
          show:true,
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
  };

  chart.setOption(option);
  return chart;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: initChart
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
        img:'./img/teacher.png'
      },
      {
        name:'孙教练',
        intro:'从业五年',
        tag:'技巧',
        img:'./img/teacher.png'
      },
      {
        name:'孙教练',
        intro:'从业五年',
        tag:'技巧',
        img:'./img/teacher.png'
      }
    ],
    color:[
      '#CDADFF','#34A4FA','#FD8D32','#00DC8D'
    ]
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