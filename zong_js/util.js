
function t(t) {
  return Date.parse(t.replace(/-/gi, "/"));
}

var e = function(t) {
  return (t = t.toString())[1] ? t : "0" + t;
};

module.exports = {
  formatTime: function(t) {
      var n = t.getFullYear(), r = t.getMonth() + 1, a = t.getDate(), o = t.getHours(), u = t.getMinutes(), i = t.getSeconds();
      return [ n, r, a ].map(e).join("/") + " " + [ o, u, i ].map(e).join(":");
  },
  getDateDiff: function(e) {
      var n, r, a, o, u, i = t(e) / 1e3, s = parseInt(new Date().getTime() / 1e3), g = new Date(1e3 * i), c = g.getFullYear(), p = g.getMonth() + 1, f = g.getDate(), l = g.getHours(), D = g.getMinutes(), d = g.getSeconds();
      return p < 10 && (p = "0" + p), f < 10 && (f = "0" + f), l < 10 && (l = "0" + l), 
      D < 10 && (D = "0" + D), d < 10 && (d = "0" + d), u = s - i, o = parseInt(u / 86400), 
      a = parseInt(u / 3600), r = parseInt(u / 60), n = parseInt(u), o > 0 && o < 3 ? o + "天前" : o <= 0 && a > 0 ? a + "小时前" : a <= 0 && r > 0 ? r + "分钟前" : n < 60 ? n <= 0 ? "刚刚" : n + "秒前" : o >= 3 && o < 30 ? p + "-" + f + " " + l + ":" + D : o >= 30 ? c + "-" + p + "-" + f + " " + l + ":" + D : void 0;
  },
  buttonClicked: function(t) {
      t.setData({
          buttonClicked: !0
      }), setTimeout(function() {
          t.setData({
              buttonClicked: !1
          });
      }, 500);
  }
};