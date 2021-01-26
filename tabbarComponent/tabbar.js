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
            "iconPath": "icon/home.png",
            "selectedIconPath": "icon/home1.png",
            "text": "首页"
          },
          {
            "pagePath": "/pages/course/course",
            "iconPath": "icon/course.png",
            "selectedIconPath": "icon/course1.png",
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
            "iconPath": "icon/teacher.png",
            "selectedIconPath": "icon/teacher1.png",
            "text": "教练"
          },
          {
            "pagePath": "pages/myset/coach/coach",
            "iconPath": "icon/my.png",
            "selectedIconPath": "icon/my1.png",
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
