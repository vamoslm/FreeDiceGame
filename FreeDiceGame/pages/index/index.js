// index.js
Page({
  goTolocal: function () {
    console.log("跳转至本地双人")
    wx.navigateTo({
      url: '/pages/local/local',
    })
    console.log("跳转本地双人成功")
  },
  goTorule: function () {
    console.log("跳转至游戏规则")
    wx.navigateTo({
      url: '/pages/rules/rules',
    })
    console.log("跳转游戏规则成功")
  },
  goToonline: function () {
    console.log("跳转至匹配对战")
    wx.navigateTo({
      url: '/pages/online/online',
    })
    console.log("跳转匹配对战成功")
  },
  goTorabot: function () {
    console.log("跳转至人机对战")
    wx.navigateTo({
      url: '/pages/rabot/rabot',
    })
    console.log("跳转人机对战成功")
  }
})
