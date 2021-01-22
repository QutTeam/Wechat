Page({
  handleGetUserInfo(e) {
    const {
      userInfo
    } = e.detail;
    wx.setStorageSync("userinfo", userInfo);
  },
  data:{
  userinfo:{}
},
onShow(){
  const userinfo=wx.getStorageSync("userinfo");
  this.setData({userinfo})
}
})