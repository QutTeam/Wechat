if (o.detail.userInfo) {
  try {
      wx.getStorageSync("user_openid") || (console.log("执行login1"), wx.login({
          success: function(e) {
              e.code && console.log("执行login2", e);
          }
      }), wx.login({
          success: function(o) {
              o.code ? e.User.requestOpenId(o.code, {
                  success: function(o) {
                      wx.getUserInfo({
                          success: function(n) {
                              var s = n.userInfo, t = s.nickName, c = s.avatarUrl, r = s.gender;
                              e.User.logIn(t, o.openid, {
                                  success: function(e) {
                                      try {
                                          wx.setStorageSync("user_openid", e.get("userData").openid), wx.setStorageSync("user_id", e.id), 
                                          wx.setStorageSync("my_nick", e.get("nickname")), wx.setStorageSync("my_username", e.get("username")), 
                                          wx.setStorageSync("my_sex", e.get("sex")), wx.setStorageSync("my_avatar", e.get("userPic"));
                                      } catch (e) {}
                                      console.log("登录成功");
                                  },
                                  error: function(n, s) {
                                      "101" == s.code && ((n = new e.User()).set("username", t), n.set("password", o.openid), 
                                      n.set("nickname", t), n.set("userPic", c), n.set("userData", o), n.set("sex", r), 
                                      n.set("feednum", 0), n.signUp(null, {
                                          success: function(e) {
                                              console.log("注册成功");
                                              try {
                                                  wx.setStorageSync("user_openid", n.get("userData").openid), wx.setStorageSync("user_id", n.id), 
                                                  wx.setStorageSync("my_nick", n.get("nickname")), wx.setStorageSync("my_username", n.get("username")), 
                                                  wx.setStorageSync("my_sex", n.get("sex")), wx.setStorageSync("my_avatar", n.get("userPic"));
                                              } catch (e) {}
                                          },
                                          error: function(e, o) {
                                              console.log("openid=" + e), console.log(o);
                                          }
                                      }));
                                  }
                              });
                          }
                      });
                  },
                  error: function(e) {
                      console.log("Error: " + e.code + " " + e.message);
                  }
              }) : console.log("获取用户登录态失败1！" + o.errMsg);
          },
          complete: function(e) {
              console.log("获取用户登录态失败2！" + e);
          }
      }));
  } catch (o) {
      console.log("登陆失败");
  }
  wx.switchTab({
      url: "/pages/index/index"
  });
} else console.log(333, "拒绝了授权"), wx.showToast({
  title: "授权失败",
  image: "/images/close.png",
  duration: 2e3
});

// onGotUserInfo: function(o) {
//   wx.switchTab({
//     url: '/pages/index/index',
//   })
// const {
//     userInfo
//   } = e.detail;
//   wx.setStorageSync("userinfo", userInfo);
// },
// data:{
// userinfo:{}
// },

