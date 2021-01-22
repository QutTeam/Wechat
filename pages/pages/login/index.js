// pages/login/index.js
Page({
  handleGetUserInfo(e) {
    const {
      userInfo
    } = e.detail;
    wx.setStorageSync("userinfo", userInfo);
    wx - wx.navigateBack({
      delta: 1,
    })
  }
})