import { LETTERS, HOT_CITY_LIST } from '../../locale/citydata'
import { AutoPredictor } from '../../utils/autoPredictor'
import cityutils from '../../utils/cityutils'

const {
  isNotEmpty,
  safeGet,
  getCityListSortedByInitialLetter,
  getLocationUrl,
  getCountyListUrl,
  getIndexUrl
} = cityutils;
const appInstance = getApp();

Page({
  data: {
    sideBarLetterList: [],
    winHeight: 0,
    cityList: [],
    hotCityList: HOT_CITY_LIST,
    showChosenLetterToast: false,
    scrollTop: 0,//置顶高度
    scrollTopId: '',//置顶id
    city: "定位中",
    cur_city:'定位中',//定位中的城市
    select_city:'',//当前选择的城市
    currentCityCode: '',
    inputName: '',
    completeList: [],
    county: '',
    showCountyPicker: false,
  },
  onLoad: function () {
    // 生命周期函数--监听页面加载
    const cityListSortedByInitialLetter = getCityListSortedByInitialLetter();
    const sysInfo = wx.getSystemInfoSync();
    const winHeight = sysInfo.windowHeight;
    const sideBarLetterList = LETTERS.map(letter => ({ name: letter }));
    this.setData({
      winHeight,
      sideBarLetterList,
      cityList: cityListSortedByInitialLetter
    });
    // 定位
    this.getLocation();
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示
    this.setData({
      select_city:wx.getStorageSync('select_city')
    })

  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },

  touchSideBarLetter: function (e) {
    const chosenLetter = safeGet(['currentTarget', 'dataset', 'letter'], e)
    this.setData({
      toastShowLetter: chosenLetter,
      showChosenLetterToast: true,
      scrollTopId: chosenLetter,
    })
    // close toast of chosenLetter
    setTimeout(() => { this.setData({ showChosenLetterToast: false }) }, 500)
  },
  //选择城市
  chooseCity: function (e) {
    const { city, code } = safeGet(['currentTarget', 'dataset'], e)
    this.setData({
      showCountyPicker: true,
      city,
      currentCityCode: code,
      scrollTop: 0,
      completeList: [],
      county: ''
    })
    this.getCountyList() 

    appInstance.globalData.defaultCity = this.data.city
    appInstance.globalData.defaultCounty = ''
    console.log(appInstance.globalData.defaultCity)
    wx.setStorageSync('select_city', this.data.city)
    appInstance.globalData.select_city=this.data.city
    console.log('返回')
    wx.setStorageSync('new_city', true)
    //向上一页面传值
    let pages = getCurrentPages();//获取page
    let prevPage = pages[pages.length-2];//上一个页面（父页面）
    prevPage.setData({
      page:1,
      noMoreData:false
    })
    wx.navigateBack({
      delta:1
    })
  },

  chooseCounty: function (e) {
    const county = safeGet(['currentTarget', 'dataset', 'city'], e)
    this.setData({ county })
    appInstance.globalData.defaultCounty = county
    // 返回首页
    wx.switchTab({ url: getIndexUrl() })
  },

  //点击热门城市回到顶部
  hotCity: function () {
    this.setData({ scrollTop: 0 })
  },
  bindScroll: function (e) {
    // console.log(e.detail)
  },
  getCountyList: function () {
    console.log("正在获取区县");
    const code = this.data.currentCityCode

    wx.request({
      url: getCountyListUrl(code),
      success: res => {
        const resultArray = safeGet(['data', 'result'], res)
        const countyList = isNotEmpty(resultArray) ? resultArray[0] : []
        console.log(countyList)
        this.setData({ countyList })
      },
      fail: () => { console.error("请求区县失败，请重试") }
    })
  },
  getLocation: function () {
    console.log("正在定位城市");
    this.setData({ county: '' })
    var that=this;
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        const { latitude, longitude } = res
        wx.request({
          url: getLocationUrl(latitude, longitude),
          success: res => {
            const { city, adcode, district } = safeGet(['data', 'result', 'ad_info'], res)
            this.setData({
              city,
              currentCityCode: adcode,
              county: district,
              cur_city:city
            })
            if(wx.getStorageSync('select_city')){
              that.setData({
                select_city:wx.getStorageSync('select_city')
              })
            }else{
              that.setData({
                select_city: city,
              })
            }
            console.log(city)
            appInstance.globalData.defaultCity = city
            // this.getCountyList();
          }
        })
      },
      fail: () => { console.error("定位失败，请重试") }
    })
  },
  reGetLocation: function () {
    const { city, county } = this.data
    appInstance.globalData.defaultCity = city
    appInstance.globalData.select_city = city
    wx.setStorageSync('select_city',city)
    wx.setStorageSync('new_city', true)
    appInstance.globalData.defaultCounty = county
    console.log(appInstance.globalData.defaultCity);
    //返回首页
    console.log('返回')
     //向上一页面传值
     let pages = getCurrentPages();//获取page
     let prevPage = pages[pages.length-2];//上一个页面（父页面）
     prevPage.setData({
       page:1,
       noMoreData:false
     })
    wx.navigateBack({
      delta: 1
    })
  },
  // 失焦时清空输入框
  bindBlur: function (e) {
    this.setData({
      inputName: '',
      completeList: []
    })
  },
  // 输入框输入时
  bindKeyInput: function (e) {
    let inputName = e.detail.value.trim()
    this.setData({ inputName })
    if (!inputName) {
      this.setData({ completeList: [] })
    }
    this.useAutoPredictor(inputName)
  },
  // 输入框自动联想搜索
  useAutoPredictor: function (content) {
    let autoPredictor = new AutoPredictor(content)
    let completeList = autoPredictor.associativeSearch()
    this.setData({ completeList })
  },
})
