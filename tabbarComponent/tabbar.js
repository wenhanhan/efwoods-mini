// tabBarComponent/tabBar.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabbar: {
      type: Object,
      value: {
        "backgroundColor": "#ffffff",
        "color": "#A6A6A6",
        "selectedColor": "#FACC3C",
        "list": [
          {
            "pagePath": "/pages/index/index",
            "iconPath": "img/icon/home.png",
            "selectedIconPath": "img/icon/home1.png",
            "text": "首页"
          },
          {
            "pagePath": "/pages/course/course",
            "iconPath": "/img/icon/course.png",
            "selectedIconPath": "/img/icon/course1.png",
            "text": "课程"
          },
          {
            "pagePath": "/pages/show/show",
            "iconPath": "icon/icon_release.png",
            "isSpecial": true,
            "text": "教练秀"
          },
          {
            "pagePath": "/pages/teacher/teacher",
            "iconPath": "/img/icon/teacher.png",
            "selectedIconPath": "/img/icon/teacher1.png",
            "text": "教练"
          },
          {
            "pagePath": "pages/myset/coach/coach",
            "iconPath": "/img/icon/my.png",
            "selectedIconPath": "/img/icon/my1.png",
            "text": "我的"
          }
        ]
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
