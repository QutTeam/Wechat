module.exports.showTip = function(o, s, t, e) {
  e || (e = 1e3), wx.showToast({
      title: o,
      icon: s,
      duration: e,
      success: t
  });
}, module.exports.showModal = function(o, s, t) {
  s || (s = "提示"), wx.showModal({
      title: s,
      content: o,
      showCancel: !1,
      success: t
  });
};