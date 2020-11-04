// pages/test_subject/test_subject.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sub_state:false,
    score:[],
    idx:-1,
    sub_idx:-1,
    wh:'',
    content_height:'',
    option:[
      {
        title:'是',
        val:1
      },
      {

        title:'否',
        val:0
      },
    ],
    subject:[
      {
        title:'常常丢失物品（如玩具、书、水杯等）。',
        option:[
          '是','否'
        ]
      },
      {
        title:'喜欢做小动作、手脚动个不停。',
        option:[
          '是','否'
        ]
      },
      {
        title:'难以保持安静。',
        option:[
          '是','否'
        ]
      },
      {
        title:'经常难以执行家长、教师的指令。',
        option:[
          '是','否'
        ]
      },
      {
        title:'需要教师的特别关注。',
        option:[
          '是','否'
        ]
      },
      {
        title:'话多、经常打断别人讲话。',
        option:[
          '是','否'
        ]
      },
      {
        title:'动作慢。',
        option:[
          '是','否'
        ]
      },
      {
        title:'容易被周围无关事务吸引。',
        option:[
          '是','否'
        ]
      },
      {
        title:'容易发脾气。',
        option:[
          '是','否'
        ]
      },
      {
        title:'经常做不符合同龄人的幼稚行为。',
        option:[
          '是','否'
        ]
      },
      {
        title:'在做作业时难以保持专注。',
        option:[
          '是','否'
        ]
      },
      {
        title:'和别人说话时总是不看着对方眼睛、似听非听。',
        option:[
          '是','否'
        ]
      },
      {
        title:'仿佛沉浸在自己的世界里。',
        option:[
          '是','否'
        ]
      },
      {
        title:'一件事情没有做完就做另一件事情。',
        option:[
          '是','否'
        ]
      },
      {
        title:'您的年龄。',
        option:[
          '3~5','6~8','9~16'
        ]
      }
    ]
  },
select:function (e) {
  var idx=e.currentTarget.dataset.idx;
  var sub_idx=e.currentTarget.dataset.subidx;
  var arr=this.data.arr;
  for(var i=0;i<arr[sub_idx].length;i++){
    console.log(sub_idx)
    if(i==idx){
      arr[sub_idx][i]=1
    }else{
      arr[sub_idx][i]=-1
    }
  }
  console.log(arr)
  this.setData({
    idx:idx,
    sub_idx:sub_idx,
    arr:arr
  })
  var score=0;
  for(var i=0;i<arr.length;i++){
    for(var j=0;j<arr[i].length;j++){
      score=score+arr[i][j];
    }
  }
  console.log(score)
  if(score==-1){
    this.setData({
      sub_state:true
    })
  }
},
submit:function(){
var that=this;
var openid=wx.getStorageSync('openid')
var state=this.data.sub_state;
var arr=this.data.arr;
var score=0;
var year=0;
var result=0;
if(state){
  wx.showLoading({
    title:'正在评测'
  })
  //统计分数
  for(var i=0;i<arr.length-1;i++){
    if(arr[i][0]==1){
      score++;
    }
  }
  //判断岁数选择
  for(var j=0;j<3;j++){
    if(arr[14][j]==1){
      year=j
    }
  }
  console.log(score)
  console.log(year)
  //判断检测结果
  if(year==0){//年龄段3-5
    if(score>=0&&score<=6){
      result=1;//注意力正常
    }else if(score>=7&&score<=11){
      result=2;//轻度注意力不集中
    }else if(score>=12&&score<=14){
      result=3;//明显注意力不集中
    }
  }else if(year==1){
    if(score>=0&&score<=4){
      result=1;//注意力正常
    }else if(score>=5&&score<=9){
      result=2;//轻度注意力不集中
    }else if(score>=10&&score<=14){
      result=3;//明显注意力不集中
    }
  }else{
    if(score>=0&&score<=3){
      result=1;//注意力正常
    }else if(score>=4&&score<=7){
      result=2;//轻度注意力不集中
    }else if(score>=8&&score<=14){
      result=3;//明显注意力不集中
    }
  }
  console.log('判断结果为'+result)
  //将测试结果保存
  wx.request({
    url: app.globalData.url + 'index/Test/test',
    data:{
      openid:openid,
      score:score,
      result:result
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res){
      console.log(res.data)
      wx.hideLoading()
      wx.redirectTo({
        url: '../test_result/test_result?result='+result+'&score='+score,
      })
    }
  })
}else{
  wx.showToast({
    title: '请完成所有题目',
    icon:'loading',
    duration:1000
  })
}
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var arr=new Array(15)
    for(var i=0;i<14;i++){
    arr[i]=new Array();
    for(var j=0;j<2;j++){
      arr[i][j]=-1
    }
  }
  arr[14]=new Array()
  for(var j=0;j<3;j++){
    arr[14][j]=-1
  }
  this.setData({
    arr:arr
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
    wx.getSystemInfo({
      success: (res) => {
        console.log(res)
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        this.setData({
          wh:wh,
          content_height:((wh*2-196-244)/(wh*2))*100
        });
        console.log(this.data.content_height)
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

  }
})