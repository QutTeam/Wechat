function t(t, e, i) {
  return e in t ? Object.defineProperty(t, e, {
      value: i,
      enumerable: !0,
      configurable: !0,
      writable: !0
  }) : t[e] = i, t;
}

(function(e) {
  var i, n = require("underscore.js"), r = {};
  r.VERSION = "js0.0.1", r._ = n;
  var s = function() {};
  "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = r), 
  exports.Bmob = r) : e.Bmob = r;
  var a = function(t, e, i) {
      var n;
      return n = e && e.hasOwnProperty("constructor") ? e.constructor : function() {
          t.apply(this, arguments);
      }, r._.extend(n, t), s.prototype = t.prototype, n.prototype = new s(), e && r._.extend(n.prototype, e), 
      i && r._.extend(n, i), n.prototype.constructor = n, n.__super__ = t.prototype, n;
  };
  r.serverURL = "https://api.bmob.cn", r.fileURL = "http://file.bmob.cn", r.socketURL = "https://api.bmob.cn", 
  "undefined" != typeof process && process.versions && process.versions.node && (r._isNode = !0), 
  r.initialize = function(t, e, i) {
      r._initialize(t, e, i);
  }, r._initialize = function(t, e, i) {
      r.applicationId = t, r.applicationKey = e, r.masterKey = i, r._useMasterKey = !0, 
      r.serverURL = "https://" + t + ".bmobcloud.com";
  }, r._isNode && (r.initialize = r._initialize), r._getBmobPath = function(t) {
      if (!r.applicationId) throw "You need to call Bmob.initialize before using Bmob.";
      if (t || (t = ""), !r._.isString(t)) throw "Tried to get a localStorage path that wasn't a String.";
      return "/" === t[0] && (t = t.substring(1)), "Bmob/" + r.applicationId + "/" + t;
  }, r._getBmobPath = function(t) {
      if (!r.applicationId) throw "You need to call Bmob.initialize before using Bmob.";
      if (t || (t = ""), !r._.isString(t)) throw "Tried to get a localStorage path that wasn't a String.";
      return "/" === t[0] && (t = t.substring(1)), "Bmob/" + r.applicationId + "/" + t;
  }, r._installationId = null, r._getInstallationId = function() {
      if (r._installationId) return r._installationId;
      var t = r._getBmobPath("installationId");
      if (wx.getStorage({
          key: "key",
          success: function(t) {
              r._installationId = t.data, console.log(t.data);
          }
      }), !r._installationId || "" === r._installationId) {
          var e = function() {
              return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1);
          };
          r._installationId = e() + e() + "-" + e() + "-" + e() + "-" + e() + "-" + e() + e() + e(), 
          wx.setStorage({
              key: t,
              data: r._installationId
          });
      }
      return r._installationId;
  }, r._parseDate = function(t) {
      var e = new RegExp("^([0-9]{1,4})-([0-9]{1,2})-([0-9]{1,2})T([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})(.([0-9]+))?Z$").exec(t);
      if (!e) return null;
      var i = e[1] || 0, n = (e[2] || 1) - 1, r = e[3] || 0, s = e[4] || 0, a = e[5] || 0, o = e[6] || 0, c = e[8] || 0;
      return new Date(Date.UTC(i, n, r, s, a, o, c));
  }, r._ajax = function(t, e, i, n, s) {
      var s, a = {
          success: n,
          error: s
      }, o = new r.Promise(), c = JSON.parse(i);
      return wx.showNavigationBarLoading(), "wechatApp" == c.category ? wx.uploadFile({
          url: e,
          filePath: c.base64,
          name: "file",
          header: {
              "X-Bmob-SDK-Type": "wechatApp"
          },
          formData: c,
          success: function(t) {
              console.log(t);
              var e = JSON.parse(t.data);
              o.resolve(e, t.statusCode, t), wx.hideNavigationBarLoading();
          },
          fail: function(t) {
              console.log(t), o.reject(t), wx.hideNavigationBarLoading();
          }
      }) : wx.request({
          method: t,
          url: e,
          data: i,
          header: {
              "content-type": "text/plain"
          },
          success: function(t) {
              t.data && t.data.code ? o.reject(t) : 200 != t.statusCode ? o.reject(t) : o.resolve(t.data, t.statusCode, t), 
              wx.hideNavigationBarLoading();
          },
          fail: function(t) {
              o.reject(t), wx.hideNavigationBarLoading();
          }
      }), s ? r.Promise.error(s) : o._thenRunCallbacks(a);
  }, r._extend = function(t, e) {
      var i = a(this, t, e);
      return i.extend = this.extend, i;
  }, r._request = function(t, e, i, n, s) {
      if (!r.applicationId) throw "You must specify your applicationId using Bmob.initialize";
      if (!r.applicationKey && !r.masterKey) throw "You must specify a key using Bmob.initialize";
      var a = r.serverURL;
      "/" !== a.charAt(a.length - 1) && (a += "/"), t.indexOf("2/") < 0 ? a += "1/" + t : a += t, 
      e && (a += "/" + e), i && (a += "/" + i), "users" !== t && "classes" !== t || "PUT" !== n || !s._fetchWhenSave || (delete s._fetchWhenSave, 
      a += "?new=true"), s = r._.clone(s || {}), "POST" !== n && (s._Method = n, n = "POST"), 
      s._ApplicationId = r.applicationId, s._RestKey = r.applicationKey, r._useMasterKey && void 0 != r.masterKey && (s._MasterKey = r.masterKey), 
      s._ClientVersion = r.VERSION, s._InstallationId = r._getInstallationId();
      var o = r.User.current();
      o && o._sessionToken && (s._SessionToken = o._sessionToken);
      var c = JSON.stringify(s);
      return r._ajax(n, a, c).then(null, function(t) {
          var e;
          try {
              t.data.code && (e = new r.Error(t.data.code, t.data.error));
          } catch (t) {}
          return e = e || new r.Error(-1, t.data), r.Promise.error(e);
      });
  }, r._getValue = function(t, e) {
      return t && t[e] ? r._.isFunction(t[e]) ? t[e]() : t[e] : null;
  }, r._encode = function(t, e, i) {
      var n = r._;
      if (t instanceof r.Object) {
          if (i) throw "Bmob.Objects not allowed here";
          if (!e || n.include(e, t) || !t._hasData) return t._toPointer();
          if (!t.dirty()) return e = e.concat(t), r._encode(t._toFullJSON(e), e, i);
          throw "Tried to save an object with a pointer to a new, unsaved object.";
      }
      if (t instanceof r.ACL) return t.toJSON();
      if (n.isDate(t)) return {
          __type: "Date",
          iso: t.toJSON()
      };
      if (t instanceof r.GeoPoint) return t.toJSON();
      if (n.isArray(t)) return n.map(t, function(t) {
          return r._encode(t, e, i);
      });
      if (n.isRegExp(t)) return t.source;
      if (t instanceof r.Relation) return t.toJSON();
      if (t instanceof r.Op) return t.toJSON();
      if (t instanceof r.File) {
          if (!t.url()) throw "Tried to save an object containing an unsaved file.";
          return {
              __type: "File",
              cdn: t.cdn(),
              filename: t.name(),
              url: t.url()
          };
      }
      if (n.isObject(t)) {
          var s = {};
          return r._objectEach(t, function(t, n) {
              s[n] = r._encode(t, e, i);
          }), s;
      }
      return t;
  }, r._decode = function(t, e) {
      var i = r._;
      if (!i.isObject(e)) return e;
      if (i.isArray(e)) return r._arrayEach(e, function(t, i) {
          e[i] = r._decode(i, t);
      }), e;
      if (e instanceof r.Object) return e;
      if (e instanceof r.File) return e;
      if (e instanceof r.Op) return e;
      if (e.__op) return r.Op._decode(e);
      if ("Pointer" === e.__type) {
          var n = e.className, s = r.Object._create(n);
          return e.createdAt ? (delete e.__type, delete e.className, s._finishFetch(e, !0)) : s._finishFetch({
              objectId: e.objectId
          }, !1), s;
      }
      if ("Object" === e.__type) {
          n = e.className;
          delete e.__type, delete e.className;
          var a = r.Object._create(n);
          return a._finishFetch(e, !0), a;
      }
      if ("Date" === e.__type) return e.iso;
      if ("GeoPoint" === e.__type) return new r.GeoPoint({
          latitude: e.latitude,
          longitude: e.longitude
      });
      if ("ACL" === t) return e instanceof r.ACL ? e : new r.ACL(e);
      if ("Relation" === e.__type) {
          var o = new r.Relation(null, t);
          return o.targetClassName = e.className, o;
      }
      if ("File" === e.__type) {
          if (void 0 != e.url && null != e.url) if (e.url.indexOf("http") >= 0) c = {
              _name: e.filename,
              _url: e.url,
              url: e.url,
              _group: e.group
          }; else c = {
              _name: e.filename,
              _url: r.fileURL + "/" + e.url,
              url: e.url,
              _group: e.group
          }; else var c = {
              _name: e.filename,
              _url: e.url,
              url: e.url,
              _group: e.group
          };
          return c;
      }
      return r._objectEach(e, function(t, i) {
          e[i] = r._decode(i, t);
      }), e;
  }, r._arrayEach = r._.each, r._traverse = function(t, e, i) {
      if (t instanceof r.Object) {
          if (i = i || [], r._.indexOf(i, t) >= 0) return;
          return i.push(t), r._traverse(t.attributes, e, i), e(t);
      }
      return t instanceof r.Relation || t instanceof r.File ? e(t) : r._.isArray(t) ? (r._.each(t, function(n, s) {
          var a = r._traverse(n, e, i);
          a && (t[s] = a);
      }), e(t)) : r._.isObject(t) ? (r._each(t, function(n, s) {
          var a = r._traverse(n, e, i);
          a && (t[s] = a);
      }), e(t)) : e(t);
  }, r._objectEach = r._each = function(t, e) {
      var i = r._;
      i.isObject(t) ? i.each(i.keys(t), function(i) {
          e(t[i], i);
      }) : i.each(t, e);
  }, r._isNullOrUndefined = function(t) {
      return r._.isNull(t) || r._.isUndefined(t);
  }, r.Error = function(t, e) {
      this.code = t, this.message = e;
  }, n.extend(r.Error, (i = {
      OTHER_CAUSE: -1,
      OBJECT_NOT_FOUND: 101,
      INVALID_QUERY: 102,
      INVALID_CLASS_NAME: 103,
      RELATIONDOCNOTEXISTS: 104,
      INVALID_KEY_NAME: 105,
      INVALID_POINTER: 106,
      INVALID_JSON: 107,
      USERNAME_PASSWORD_REQUIRED: 108,
      INCORRECT_TYPE: 111,
      REQUEST_MUST_ARRAY: 112,
      REQUEST_MUST_OBJECT: 113,
      OBJECT_TOO_LARGE: 114,
      GEO_ERROR: 117,
      EMAIL_VERIFY_MUST_OPEN: 120,
      CACHE_MISS: 120,
      INVALID_DEVICE_TOKEN: 131,
      INVALID_INSTALLID: 132,
      INVALID_DEVICE_TYPE: 133,
      DEVICE_TOKEN_EXIST: 134,
      INSTALLID_EXIST: 135,
      DEVICE_TOKEN_NOT_FOR_ANDROID: 136,
      INVALID_INSTALL_OPERATE: 137,
      READ_ONLY: 138,
      INVALID_ROLE_NAME: 139,
      MISS_PUSH_DATA: 141,
      INVALID_PUSH_TIME: 142,
      INVALID_PUSH_EXPIRE: 143,
      PUSH_TIME_MUST_BEFORE_NOW: 144,
      FILE_SIZE_ERROR: 145,
      FILE_NAME_ERROR: 146
  }, t(i, "FILE_NAME_ERROR", 147), t(i, "FILE_LEN_ERROR", 148), t(i, "FILE_UPLOAD_ERROR", 150), 
  t(i, "FILE_DELETE_ERROR", 151), t(i, "IMAGE_ERROR", 160), t(i, "IMAGE_MODE_ERROR", 161), 
  t(i, "IMAGE_WIDTH_ERROR", 162), t(i, "IMAGE_HEIGHT_ERROR", 163), t(i, "IMAGE_LONGEDGE_ERROR", 164), 
  t(i, "IMAGE_SHORTEDGE_ERROR", 165), t(i, "USER_MISSING", 201), t(i, "USER_NAME_TOKEN", 202), 
  t(i, "EMAIL_EXIST", 203), t(i, "NO_EMAIL", 204), t(i, "NOT_FOUND_EMAIL", 205), t(i, "SESSIONTOKEN_ERROR", 206), 
  t(i, "VALID_ERROR", 301), i)), r.Events = {
      on: function(t, e, i) {
          var n, r, s, a, o;
          if (!e) return this;
          for (t = t.split(l), n = this._callbacks || (this._callbacks = {}), r = t.shift(); r; ) (s = (o = n[r]) ? o.tail : {}).next = a = {}, 
          s.context = i, s.callback = e, n[r] = {
              tail: a,
              next: o ? o.next : s
          }, r = t.shift();
          return this;
      },
      off: function(t, e, i) {
          var r, s, a, o, c, u;
          if (s = this._callbacks) {
              if (!(t || e || i)) return delete this._callbacks, this;
              for (r = (t = t ? t.split(l) : n.keys(s)).shift(); r; ) if (a = s[r], delete s[r], 
              a && (e || i)) {
                  for (o = a.tail, a = a.next; a !== o; ) c = a.callback, u = a.context, (e && c !== e || i && u !== i) && this.on(r, c, u), 
                  a = a.next;
                  r = t.shift();
              }
              return this;
          }
      },
      trigger: function(t) {
          var e, i, n, r, s, a, o;
          if (!(n = this._callbacks)) return this;
          for (a = n.all, t = t.split(l), o = slice.call(arguments, 1), e = t.shift(); e; ) {
              if (i = n[e]) for (r = i.tail; (i = i.next) !== r; ) i.callback.apply(i.context || this, o);
              if (i = a) for (r = i.tail, s = [ e ].concat(o); (i = i.next) !== r; ) i.callback.apply(i.context || this, s);
              e = t.shift();
          }
          return this;
      }
  }, r.Events.bind = r.Events.on, r.Events.unbind = r.Events.off, r.GeoPoint = function(t, e) {
      n.isArray(t) ? (r.GeoPoint._validate(t[0], t[1]), this.latitude = t[0], this.longitude = t[1]) : n.isObject(t) ? (r.GeoPoint._validate(t.latitude, t.longitude), 
      this.latitude = t.latitude, this.longitude = t.longitude) : n.isNumber(t) && n.isNumber(e) ? (r.GeoPoint._validate(t, e), 
      this.latitude = t, this.longitude = e) : (this.latitude = 0, this.longitude = 0);
      var i = this;
      this.__defineGetter__ && this.__defineSetter__ && (this._latitude = this.latitude, 
      this._longitude = this.longitude, this.__defineGetter__("latitude", function() {
          return i._latitude;
      }), this.__defineGetter__("longitude", function() {
          return i._longitude;
      }), this.__defineSetter__("latitude", function(t) {
          r.GeoPoint._validate(t, i.longitude), i._latitude = t;
      }), this.__defineSetter__("longitude", function(t) {
          r.GeoPoint._validate(i.latitude, t), i._longitude = t;
      }));
  }, r.GeoPoint._validate = function(t, e) {
      if (t < -90) throw "Bmob.GeoPoint latitude " + t + " < -90.0.";
      if (t > 90) throw "Bmob.GeoPoint latitude " + t + " > 90.0.";
      if (e < -180) throw "Bmob.GeoPoint longitude " + e + " < -180.0.";
      if (e > 180) throw "Bmob.GeoPoint longitude " + e + " > 180.0.";
  }, r.GeoPoint.current = function(t) {
      var e = new r.Promise();
      return navigator.geolocation.getCurrentPosition(function(t) {
          e.resolve(new r.GeoPoint({
              latitude: t.coords.latitude,
              longitude: t.coords.longitude
          }));
      }, function(t) {
          e.reject(t);
      }), e._thenRunCallbacks(t);
  }, r.GeoPoint.prototype = {
      toJSON: function() {
          return r.GeoPoint._validate(this.latitude, this.longitude), {
              __type: "GeoPoint",
              latitude: this.latitude,
              longitude: this.longitude
          };
      },
      radiansTo: function(t) {
          var e = Math.PI / 180, i = this.latitude * e, n = this.longitude * e, r = t.latitude * e, s = i - r, a = n - t.longitude * e, o = Math.sin(s / 2), c = Math.sin(a / 2), u = o * o + Math.cos(i) * Math.cos(r) * c * c;
          return u = Math.min(1, u), 2 * Math.asin(Math.sqrt(u));
      },
      kilometersTo: function(t) {
          return 6371 * this.radiansTo(t);
      },
      milesTo: function(t) {
          return 3958.8 * this.radiansTo(t);
      }
  };
  r.ACL = function(t) {
      var e = this;
      if (e.permissionsById = {}, n.isObject(t)) if (t instanceof r.User) e.setReadAccess(t, !0), 
      e.setWriteAccess(t, !0); else {
          if (n.isFunction(t)) throw "Bmob.ACL() called with a function.  Did you forget ()?";
          r._objectEach(t, function(t, i) {
              if (!n.isString(i)) throw "Tried to create an ACL with an invalid userId.";
              e.permissionsById[i] = {}, r._objectEach(t, function(t, r) {
                  if ("read" !== r && "write" !== r) throw "Tried to create an ACL with an invalid permission type.";
                  if (!n.isBoolean(t)) throw "Tried to create an ACL with an invalid permission value.";
                  e.permissionsById[i][r] = t;
              });
          });
      }
  }, r.ACL.prototype.toJSON = function() {
      return n.clone(this.permissionsById);
  }, r.ACL.prototype._setAccess = function(t, e, i) {
      if (e instanceof r.User ? e = e.id : e instanceof r.Role && (e = "role:" + e.getName()), 
      !n.isString(e)) throw "userId must be a string.";
      if (!n.isBoolean(i)) throw "allowed must be either true or false.";
      var s = this.permissionsById[e];
      if (!s) {
          if (!i) return;
          s = {}, this.permissionsById[e] = s;
      }
      i ? this.permissionsById[e][t] = !0 : (delete s[t], n.isEmpty(s) && delete s[e]);
  }, r.ACL.prototype._getAccess = function(t, e) {
      e instanceof r.User ? e = e.id : e instanceof r.Role && (e = "role:" + e.getName());
      var i = this.permissionsById[e];
      return !!i && !!i[t];
  }, r.ACL.prototype.setReadAccess = function(t, e) {
      this._setAccess("read", t, e);
  }, r.ACL.prototype.getReadAccess = function(t) {
      return this._getAccess("read", t);
  }, r.ACL.prototype.setWriteAccess = function(t, e) {
      this._setAccess("write", t, e);
  }, r.ACL.prototype.getWriteAccess = function(t) {
      return this._getAccess("write", t);
  }, r.ACL.prototype.setPublicReadAccess = function(t) {
      this.setReadAccess("*", t);
  }, r.ACL.prototype.getPublicReadAccess = function() {
      return this.getReadAccess("*");
  }, r.ACL.prototype.setPublicWriteAccess = function(t) {
      this.setWriteAccess("*", t);
  }, r.ACL.prototype.getPublicWriteAccess = function() {
      return this.getWriteAccess("*");
  }, r.ACL.prototype.getRoleReadAccess = function(t) {
      if (t instanceof r.Role && (t = t.getName()), n.isString(t)) return this.getReadAccess("role:" + t);
      throw "role must be a Bmob.Role or a String";
  }, r.ACL.prototype.getRoleWriteAccess = function(t) {
      if (t instanceof r.Role && (t = t.getName()), n.isString(t)) return this.getWriteAccess("role:" + t);
      throw "role must be a Bmob.Role or a String";
  }, r.ACL.prototype.setRoleReadAccess = function(t, e) {
      t instanceof r.Role && (t = t.getName());
      {
          if (!n.isString(t)) throw "role must be a Bmob.Role or a String";
          this.setReadAccess("role:" + t, e);
      }
  }, r.ACL.prototype.setRoleWriteAccess = function(t, e) {
      t instanceof r.Role && (t = t.getName());
      {
          if (!n.isString(t)) throw "role must be a Bmob.Role or a String";
          this.setWriteAccess("role:" + t, e);
      }
  }, r.Op = function() {
      this._initialize.apply(this, arguments);
  }, r.Op.prototype = {
      _initialize: function() {}
  }, n.extend(r.Op, {
      _extend: r._extend,
      _opDecoderMap: {},
      _registerDecoder: function(t, e) {
          r.Op._opDecoderMap[t] = e;
      },
      _decode: function(t) {
          var e = r.Op._opDecoderMap[t.__op];
          return e ? e(t) : void 0;
      }
  }), r.Op._registerDecoder("Batch", function(t) {
      var e = null;
      return r._arrayEach(t.ops, function(t) {
          t = r.Op._decode(t), e = t._mergeWithPrevious(e);
      }), e;
  }), r.Op.Set = r.Op._extend({
      _initialize: function(t) {
          this._value = t;
      },
      value: function() {
          return this._value;
      },
      toJSON: function() {
          return r._encode(this.value());
      },
      _mergeWithPrevious: function(t) {
          return this;
      },
      _estimate: function(t) {
          return this.value();
      }
  }), r.Op._UNSET = {}, r.Op.Unset = r.Op._extend({
      toJSON: function() {
          return {
              __op: "Delete"
          };
      },
      _mergeWithPrevious: function(t) {
          return this;
      },
      _estimate: function(t) {
          return r.Op._UNSET;
      }
  }), r.Op._registerDecoder("Delete", function(t) {
      return new r.Op.Unset();
  }), r.Op.Increment = r.Op._extend({
      _initialize: function(t) {
          this._amount = t;
      },
      amount: function() {
          return this._amount;
      },
      toJSON: function() {
          return {
              __op: "Increment",
              amount: this._amount
          };
      },
      _mergeWithPrevious: function(t) {
          if (t) {
              if (t instanceof r.Op.Unset) return new r.Op.Set(this.amount());
              if (t instanceof r.Op.Set) return new r.Op.Set(t.value() + this.amount());
              if (t instanceof r.Op.Increment) return new r.Op.Increment(this.amount() + t.amount());
              throw "Op is invalid after previous op.";
          }
          return this;
      },
      _estimate: function(t) {
          return t ? t + this.amount() : this.amount();
      }
  }), r.Op._registerDecoder("Increment", function(t) {
      return new r.Op.Increment(t.amount);
  }), r.Op.Add = r.Op._extend({
      _initialize: function(t) {
          this._objects = t;
      },
      objects: function() {
          return this._objects;
      },
      toJSON: function() {
          return {
              __op: "Add",
              objects: r._encode(this.objects())
          };
      },
      _mergeWithPrevious: function(t) {
          if (t) {
              if (t instanceof r.Op.Unset) return new r.Op.Set(this.objects());
              if (t instanceof r.Op.Set) return new r.Op.Set(this._estimate(t.value()));
              if (t instanceof r.Op.Add) return new r.Op.Add(t.objects().concat(this.objects()));
              throw "Op is invalid after previous op.";
          }
          return this;
      },
      _estimate: function(t) {
          return t ? t.concat(this.objects()) : n.clone(this.objects());
      }
  }), r.Op._registerDecoder("Add", function(t) {
      return new r.Op.Add(r._decode(void 0, t.objects));
  }), r.Op.AddUnique = r.Op._extend({
      _initialize: function(t) {
          this._objects = n.uniq(t);
      },
      objects: function() {
          return this._objects;
      },
      toJSON: function() {
          return {
              __op: "AddUnique",
              objects: r._encode(this.objects())
          };
      },
      _mergeWithPrevious: function(t) {
          if (t) {
              if (t instanceof r.Op.Unset) return new r.Op.Set(this.objects());
              if (t instanceof r.Op.Set) return new r.Op.Set(this._estimate(t.value()));
              if (t instanceof r.Op.AddUnique) return new r.Op.AddUnique(this._estimate(t.objects()));
              throw "Op is invalid after previous op.";
          }
          return this;
      },
      _estimate: function(t) {
          if (t) {
              var e = n.clone(t);
              return r._arrayEach(this.objects(), function(t) {
                  if (t instanceof r.Object && t.id) {
                      var i = n.find(e, function(e) {
                          return e instanceof r.Object && e.id === t.id;
                      });
                      if (i) {
                          var s = n.indexOf(e, i);
                          e[s] = t;
                      } else e.push(t);
                  } else n.contains(e, t) || e.push(t);
              }), e;
          }
          return n.clone(this.objects());
      }
  }), r.Op._registerDecoder("AddUnique", function(t) {
      return new r.Op.AddUnique(r._decode(void 0, t.objects));
  }), r.Op.Remove = r.Op._extend({
      _initialize: function(t) {
          this._objects = n.uniq(t);
      },
      objects: function() {
          return this._objects;
      },
      toJSON: function() {
          return {
              __op: "Remove",
              objects: r._encode(this.objects())
          };
      },
      _mergeWithPrevious: function(t) {
          if (t) {
              if (t instanceof r.Op.Unset) return t;
              if (t instanceof r.Op.Set) return new r.Op.Set(this._estimate(t.value()));
              if (t instanceof r.Op.Remove) return new r.Op.Remove(n.union(t.objects(), this.objects()));
              throw "Op is invalid after previous op.";
          }
          return this;
      },
      _estimate: function(t) {
          if (t) {
              var e = n.difference(t, this.objects());
              return r._arrayEach(this.objects(), function(t) {
                  t instanceof r.Object && t.id && (e = n.reject(e, function(e) {
                      return e instanceof r.Object && e.id === t.id;
                  }));
              }), e;
          }
          return [];
      }
  }), r.Op._registerDecoder("Remove", function(t) {
      return new r.Op.Remove(r._decode(void 0, t.objects));
  }), r.Op.Relation = r.Op._extend({
      _initialize: function(t, e) {
          this._targetClassName = null;
          var i = this, s = function(t) {
              if (t instanceof r.Object) {
                  if (!t.id) throw "You can't add an unsaved Bmob.Object to a relation.";
                  if (i._targetClassName || (i._targetClassName = t.className), i._targetClassName !== t.className) throw "Tried to create a Bmob.Relation with 2 different types: " + i._targetClassName + " and " + t.className + ".";
                  return t.id;
              }
              return t;
          };
          this.relationsToAdd = n.uniq(n.map(t, s)), this.relationsToRemove = n.uniq(n.map(e, s));
      },
      added: function() {
          var t = this;
          return n.map(this.relationsToAdd, function(e) {
              var i = r.Object._create(t._targetClassName);
              return i.id = e, i;
          });
      },
      removed: function() {
          var t = this;
          return n.map(this.relationsToRemove, function(e) {
              var i = r.Object._create(t._targetClassName);
              return i.id = e, i;
          });
      },
      toJSON: function() {
          var t = null, e = null, i = this, r = function(t) {
              return {
                  __type: "Pointer",
                  className: i._targetClassName,
                  objectId: t
              };
          };
          return this.relationsToAdd.length > 0 && (t = {
              __op: "AddRelation",
              objects: n.map(this.relationsToAdd, r)
          }), this.relationsToRemove.length > 0 && (e = {
              __op: "RemoveRelation",
              objects: n.map(this.relationsToRemove, r)
          }), t && e ? {
              __op: "Batch",
              ops: [ t, e ]
          } : t || e || {};
      },
      _mergeWithPrevious: function(t) {
          if (t) {
              if (t instanceof r.Op.Unset) throw "You can't modify a relation after deleting it.";
              if (t instanceof r.Op.Relation) {
                  if (t._targetClassName && t._targetClassName !== this._targetClassName) throw "Related object must be of class " + t._targetClassName + ", but " + this._targetClassName + " was passed in.";
                  var e = n.union(n.difference(t.relationsToAdd, this.relationsToRemove), this.relationsToAdd), i = n.union(n.difference(t.relationsToRemove, this.relationsToAdd), this.relationsToRemove), s = new r.Op.Relation(e, i);
                  return s._targetClassName = this._targetClassName, s;
              }
              throw "Op is invalid after previous op.";
          }
          return this;
      },
      _estimate: function(t, e, i) {
          if (t) {
              if (t instanceof r.Relation) {
                  if (this._targetClassName) if (t.targetClassName) {
                      if (t.targetClassName !== this._targetClassName) throw "Related object must be a " + t.targetClassName + ", but a " + this._targetClassName + " was passed in.";
                  } else t.targetClassName = this._targetClassName;
                  return t;
              }
              throw "Op is invalid after previous op.";
          }
          new r.Relation(e, i).targetClassName = this._targetClassName;
      }
  }), r.Op._registerDecoder("AddRelation", function(t) {
      return new r.Op.Relation(r._decode(void 0, t.objects), []);
  }), r.Op._registerDecoder("RemoveRelation", function(t) {
      return new r.Op.Relation([], r._decode(void 0, t.objects));
  }), r.Relation = function(t, e) {
      this.parent = t, this.key = e, this.targetClassName = null;
  }, r.Relation.reverseQuery = function(t, e, i) {
      var n = new r.Query(t);
      return n.equalTo(e, i._toPointer()), n;
  }, r.Relation.prototype = {
      _ensureParentAndKey: function(t, e) {
          if (this.parent = this.parent || t, this.key = this.key || e, this.parent !== t) throw "Internal Error. Relation retrieved from two different Objects.";
          if (this.key !== e) throw "Internal Error. Relation retrieved from two different keys.";
      },
      add: function(t) {
          n.isArray(t) || (t = [ t ]);
          var e = new r.Op.Relation(t, []);
          this.parent.set(this.key, e), this.targetClassName = e._targetClassName;
      },
      remove: function(t) {
          n.isArray(t) || (t = [ t ]);
          var e = new r.Op.Relation([], t);
          this.parent.set(this.key, e), this.targetClassName = e._targetClassName;
      },
      toJSON: function() {
          return {
              __type: "Relation",
              className: this.targetClassName
          };
      },
      query: function() {
          var t, e;
          return this.targetClassName ? (t = r.Object._getSubclass(this.targetClassName), 
          e = new r.Query(t)) : (t = r.Object._getSubclass(this.parent.className), e = new r.Query(t), 
          e._extraOptions.redirectClassNameForKey = this.key), e._addCondition("$relatedTo", "object", this.parent._toPointer()), 
          e._addCondition("$relatedTo", "key", this.key), e;
      }
  }, r.Promise = function() {
      this._resolved = !1, this._rejected = !1, this._resolvedCallbacks = [], this._rejectedCallbacks = [];
  }, n.extend(r.Promise, {
      is: function(t) {
          return t && t.then && n.isFunction(t.then);
      },
      as: function() {
          var t = new r.Promise();
          return t.resolve.apply(t, arguments), t;
      },
      error: function() {
          var t = new r.Promise();
          return t.reject.apply(t, arguments), t;
      },
      when: function(t) {
          var e, i = (e = t && r._isNullOrUndefined(t.length) ? arguments : t).length, n = !1, s = [], a = [];
          if (s.length = e.length, a.length = e.length, 0 === i) return r.Promise.as.apply(this, s);
          var o = new r.Promise(), c = function() {
              0 === (i -= 1) && (n ? o.reject(a) : o.resolve.apply(o, s));
          };
          return r._arrayEach(e, function(t, e) {
              r.Promise.is(t) ? t.then(function(t) {
                  s[e] = t, c();
              }, function(t) {
                  a[e] = t, n = !0, c();
              }) : (s[e] = t, c());
          }), o;
      },
      _continueWhile: function(t, e) {
          return t() ? e().then(function() {
              return r.Promise._continueWhile(t, e);
          }) : r.Promise.as();
      }
  }), n.extend(r.Promise.prototype, {
      resolve: function(t) {
          if (this._resolved || this._rejected) throw "A promise was resolved even though it had already been " + (this._resolved ? "resolved" : "rejected") + ".";
          this._resolved = !0, this._result = arguments;
          var e = arguments;
          r._arrayEach(this._resolvedCallbacks, function(t) {
              t.apply(this, e);
          }), this._resolvedCallbacks = [], this._rejectedCallbacks = [];
      },
      reject: function(t) {
          if (this._resolved || this._rejected) throw "A promise was rejected even though it had already been " + (this._resolved ? "resolved" : "rejected") + ".";
          this._rejected = !0, this._error = t, r._arrayEach(this._rejectedCallbacks, function(e) {
              e(t);
          }), this._resolvedCallbacks = [], this._rejectedCallbacks = [];
      },
      then: function(t, e) {
          var i = new r.Promise(), n = function() {
              var e = arguments;
              t && (e = [ t.apply(this, e) ]), 1 === e.length && r.Promise.is(e[0]) ? e[0].then(function() {
                  i.resolve.apply(i, arguments);
              }, function(t) {
                  i.reject(t);
              }) : i.resolve.apply(i, e);
          }, s = function(t) {
              var n = [];
              e ? 1 === (n = [ e(t) ]).length && r.Promise.is(n[0]) ? n[0].then(function() {
                  i.resolve.apply(i, arguments);
              }, function(t) {
                  i.reject(t);
              }) : i.reject(n[0]) : i.reject(t);
          };
          return this._resolved ? n.apply(this, this._result) : this._rejected ? s(this._error) : (this._resolvedCallbacks.push(n), 
          this._rejectedCallbacks.push(s)), i;
      },
      _thenRunCallbacks: function(t, e) {
          var i;
          if (n.isFunction(t)) {
              var s = t;
              i = {
                  success: function(t) {
                      s(t, null);
                  },
                  error: function(t) {
                      s(null, t);
                  }
              };
          } else i = n.clone(t);
          return i = i || {}, this.then(function(t) {
              return i.success ? i.success.apply(this, arguments) : e && e.trigger("sync", e, t, i), 
              r.Promise.as.apply(r.Promise, arguments);
          }, function(t) {
              return i.error ? n.isUndefined(e) ? i.error(t) : i.error(e, t) : e && e.trigger("error", e, t, i), 
              r.Promise.error(t);
          });
      },
      _continueWith: function(t) {
          return this.then(function() {
              return t(arguments, null);
          }, function(e) {
              return t(null, e);
          });
      }
  });
  var o = {
      ai: "application/postscript",
      aif: "audio/x-aiff",
      aifc: "audio/x-aiff",
      aiff: "audio/x-aiff",
      asc: "text/plain",
      atom: "application/atom+xml",
      au: "audio/basic",
      avi: "video/x-msvideo",
      bcpio: "application/x-bcpio",
      bin: "application/octet-stream",
      bmp: "image/bmp",
      cdf: "application/x-netcdf",
      cgm: "image/cgm",
      class: "application/octet-stream",
      cpio: "application/x-cpio",
      cpt: "application/mac-compactpro",
      csh: "application/x-csh",
      css: "text/css",
      dcr: "application/x-director",
      dif: "video/x-dv",
      dir: "application/x-director",
      djv: "image/vnd.djvu",
      djvu: "image/vnd.djvu",
      dll: "application/octet-stream",
      dmg: "application/octet-stream",
      dms: "application/octet-stream",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      dotx: "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
      docm: "application/vnd.ms-word.document.macroEnabled.12",
      dotm: "application/vnd.ms-word.template.macroEnabled.12",
      dtd: "application/xml-dtd",
      dv: "video/x-dv",
      dvi: "application/x-dvi",
      dxr: "application/x-director",
      eps: "application/postscript",
      etx: "text/x-setext",
      exe: "application/octet-stream",
      ez: "application/andrew-inset",
      gif: "image/gif",
      gram: "application/srgs",
      grxml: "application/srgs+xml",
      gtar: "application/x-gtar",
      hdf: "application/x-hdf",
      hqx: "application/mac-binhex40",
      htm: "text/html",
      html: "text/html",
      ice: "x-conference/x-cooltalk",
      ico: "image/x-icon",
      ics: "text/calendar",
      ief: "image/ief",
      ifb: "text/calendar",
      iges: "model/iges",
      igs: "model/iges",
      jnlp: "application/x-java-jnlp-file",
      jp2: "image/jp2",
      jpe: "image/jpeg",
      jpeg: "image/jpeg",
      jpg: "image/jpeg",
      js: "application/x-javascript",
      kar: "audio/midi",
      latex: "application/x-latex",
      lha: "application/octet-stream",
      lzh: "application/octet-stream",
      m3u: "audio/x-mpegurl",
      m4a: "audio/mp4a-latm",
      m4b: "audio/mp4a-latm",
      m4p: "audio/mp4a-latm",
      m4u: "video/vnd.mpegurl",
      m4v: "video/x-m4v",
      mac: "image/x-macpaint",
      man: "application/x-troff-man",
      mathml: "application/mathml+xml",
      me: "application/x-troff-me",
      mesh: "model/mesh",
      mid: "audio/midi",
      midi: "audio/midi",
      mif: "application/vnd.mif",
      mov: "video/quicktime",
      movie: "video/x-sgi-movie",
      mp2: "audio/mpeg",
      mp3: "audio/mpeg",
      mp4: "video/mp4",
      mpe: "video/mpeg",
      mpeg: "video/mpeg",
      mpg: "video/mpeg",
      mpga: "audio/mpeg",
      ms: "application/x-troff-ms",
      msh: "model/mesh",
      mxu: "video/vnd.mpegurl",
      nc: "application/x-netcdf",
      oda: "application/oda",
      ogg: "application/ogg",
      pbm: "image/x-portable-bitmap",
      pct: "image/pict",
      pdb: "chemical/x-pdb",
      pdf: "application/pdf",
      pgm: "image/x-portable-graymap",
      pgn: "application/x-chess-pgn",
      pic: "image/pict",
      pict: "image/pict",
      png: "image/png",
      pnm: "image/x-portable-anymap",
      pnt: "image/x-macpaint",
      pntg: "image/x-macpaint",
      ppm: "image/x-portable-pixmap",
      ppt: "application/vnd.ms-powerpoint",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      potx: "application/vnd.openxmlformats-officedocument.presentationml.template",
      ppsx: "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
      ppam: "application/vnd.ms-powerpoint.addin.macroEnabled.12",
      pptm: "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
      potm: "application/vnd.ms-powerpoint.template.macroEnabled.12",
      ppsm: "application/vnd.ms-powerpoint.slideshow.macroEnabled.12",
      ps: "application/postscript",
      qt: "video/quicktime",
      qti: "image/x-quicktime",
      qtif: "image/x-quicktime",
      ra: "audio/x-pn-realaudio",
      ram: "audio/x-pn-realaudio",
      ras: "image/x-cmu-raster",
      rdf: "application/rdf+xml",
      rgb: "image/x-rgb",
      rm: "application/vnd.rn-realmedia",
      roff: "application/x-troff",
      rtf: "text/rtf",
      rtx: "text/richtext",
      sgm: "text/sgml",
      sgml: "text/sgml",
      sh: "application/x-sh",
      shar: "application/x-shar",
      silo: "model/mesh",
      sit: "application/x-stuffit",
      skd: "application/x-koan",
      skm: "application/x-koan",
      skp: "application/x-koan",
      skt: "application/x-koan",
      smi: "application/smil",
      smil: "application/smil",
      snd: "audio/basic",
      so: "application/octet-stream",
      spl: "application/x-futuresplash",
      src: "application/x-wais-source",
      sv4cpio: "application/x-sv4cpio",
      sv4crc: "application/x-sv4crc",
      svg: "image/svg+xml",
      swf: "application/x-shockwave-flash",
      t: "application/x-troff",
      tar: "application/x-tar",
      tcl: "application/x-tcl",
      tex: "application/x-tex",
      texi: "application/x-texinfo",
      texinfo: "application/x-texinfo",
      tif: "image/tiff",
      tiff: "image/tiff",
      tr: "application/x-troff",
      tsv: "text/tab-separated-values",
      txt: "text/plain",
      ustar: "application/x-ustar",
      vcd: "application/x-cdlink",
      vrml: "model/vrml",
      vxml: "application/voicexml+xml",
      wav: "audio/x-wav",
      wbmp: "image/vnd.wap.wbmp",
      wbmxl: "application/vnd.wap.wbxml",
      wml: "text/vnd.wap.wml",
      wmlc: "application/vnd.wap.wmlc",
      wmls: "text/vnd.wap.wmlscript",
      wmlsc: "application/vnd.wap.wmlscriptc",
      wrl: "model/vrml",
      xbm: "image/x-xbitmap",
      xht: "application/xhtml+xml",
      xhtml: "application/xhtml+xml",
      xls: "application/vnd.ms-excel",
      xml: "application/xml",
      xpm: "image/x-xpixmap",
      xsl: "application/xml",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      xltx: "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
      xlsm: "application/vnd.ms-excel.sheet.macroEnabled.12",
      xltm: "application/vnd.ms-excel.template.macroEnabled.12",
      xlam: "application/vnd.ms-excel.addin.macroEnabled.12",
      xlsb: "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
      xslt: "application/xslt+xml",
      xul: "application/vnd.mozilla.xul+xml",
      xwd: "image/x-xwindowdump",
      xyz: "chemical/x-xyz",
      zip: "application/zip"
  }, c = function(t, e) {
      var i = new r.Promise();
      if ("undefined" == typeof FileReader) return r.Promise.error(new r.Error(-1, "Attempted to use a FileReader on an unsupported browser."));
      var n = new FileReader();
      return n.onloadend = function() {
          i.resolve(n.result);
      }, n.readAsBinaryString(t), i;
  };
  r.File = function(t, e, i) {
      var n = /\.([^.]*)$/.exec(t);
      e = "mp4" == n ? e : e[0], this._name = t;
      var s = r.User.current();
      this._metaData = {
          owner: null != s ? s.id : "unknown"
      }, n && (n = n[1].toLowerCase()), console.log(n);
      var a = i || o[n] || "text/plain";
      this._guessedType = a, "undefined" != typeof File && e instanceof File ? this._source = c(e) : (this._source = r.Promise.as(e, a), 
      this._metaData.size = e.length);
  }, r.File.prototype = {
      name: function() {
          return this._name;
      },
      setName: function(t) {
          this._name = t;
      },
      url: function() {
          return this._url;
      },
      setUrl: function(t) {
          this._url = t;
      },
      cdn: function() {
          return this._cdn;
      },
      metaData: function(t, e) {
          return null != t && null != e ? (this._metaData[t] = e, this) : null != t ? this._metaData[t] : this._metaData;
      },
      destroy: function(t) {
          if (!this._url && !this._cdn) return r.Promise.error("The file url and cdn is not eixsts.")._thenRunCallbacks(t);
          var e = {
              cdn: this._cdn,
              _ContentType: "application/json",
              url: this._url,
              metaData: self._metaData
          };
          return r._request("2/files", null, null, "DELETE", e)._thenRunCallbacks(t);
      },
      save: function(t) {
          var e = this;
          if (!e._previousSave) {
              if (!e._source) throw "not source file";
              e._previousSave = e._source.then(function(t, i) {
                  var n = {
                      base64: t,
                      _ContentType: "text/plain",
                      mime_type: "text/plain",
                      metaData: e._metaData,
                      category: "wechatApp"
                  };
                  return e._metaData.size || (e._metaData.size = t.length), r._request("2/files", e._name, null, "POST", n);
              }).then(function(t) {
                  return e._name = t.filename, e._url = t.url, e._cdn = t.cdn, e;
              });
          }
          return e._previousSave._thenRunCallbacks(t);
      }
  }, r.Files = r.Files || {}, r.Files.del = function(t, e) {
      var i = t.split(".com");
      if (!i) return r.Promise.error("The file url and cdn is not eixsts.")._thenRunCallbacks(e);
      var n = {
          _ContentType: "application/json"
      };
      return r._request("2/files/upyun", i[1], null, "DELETE", n).then(function(t) {
          return r._decode(null, t);
      })._thenRunCallbacks(e);
  }, r.Object = function(t, e) {
      if (n.isString(t)) return r.Object._create.apply(this, arguments);
      t = t || {}, e && e.parse && (t = this.parse(t));
      var i = r._getValue(this, "defaults");
      if (i && (t = n.extend({}, i, t)), e && e.collection && (this.collection = e.collection), 
      this._serverData = {}, this._opSetQueue = [ {} ], this.attributes = {}, this._hashedJSON = {}, 
      this._escapedAttributes = {}, this.cid = n.uniqueId("c"), this.changed = {}, this._silent = {}, 
      this._pending = {}, !this.set(t, {
          silent: !0
      })) throw new Error("Can't create an invalid Bmob.Object");
      this.changed = {}, this._silent = {}, this._pending = {}, this._hasData = !0, this._previousAttributes = n.clone(this.attributes), 
      this.initialize.apply(this, arguments);
  }, r.Object.saveAll = function(t, e) {
      return r.Object._deepSaveAsync(t)._thenRunCallbacks(e);
  }, n.extend(r.Object.prototype, r.Events, {
      _existed: !1,
      _fetchWhenSave: !1,
      initialize: function() {},
      fetchWhenSave: function(t) {
          if ("boolean" != typeof t) throw "Expect boolean value for fetchWhenSave";
          this._fetchWhenSave = t;
      },
      toJSON: function() {
          var t = this._toFullJSON();
          return r._arrayEach([ "__type", "className" ], function(e) {
              delete t[e];
          }), t;
      },
      _toFullJSON: function(t) {
          var e = n.clone(this.attributes);
          return r._objectEach(e, function(i, n) {
              e[n] = r._encode(i, t);
          }), r._objectEach(this._operations, function(t, i) {
              e[i] = t;
          }), n.has(this, "id") && (e.objectId = this.id), n.has(this, "createdAt") && (n.isDate(this.createdAt) ? e.createdAt = this.createdAt.toJSON() : e.createdAt = this.createdAt), 
          n.has(this, "updatedAt") && (n.isDate(this.updatedAt) ? e.updatedAt = this.updatedAt.toJSON() : e.updatedAt = this.updatedAt), 
          e.__type = "Object", e.className = this.className, e;
      },
      _refreshCache: function() {
          var t = this;
          t._refreshingCache || (t._refreshingCache = !0, r._objectEach(this.attributes, function(e, i) {
              e instanceof r.Object ? e._refreshCache() : n.isObject(e) && t._resetCacheForKey(i) && t.set(i, new r.Op.Set(e), {
                  silent: !0
              });
          }), delete t._refreshingCache);
      },
      dirty: function(t) {
          this._refreshCache();
          var e = n.last(this._opSetQueue);
          return t ? !!e[t] : !this.id || n.keys(e).length > 0;
      },
      _toPointer: function() {
          return {
              __type: "Pointer",
              className: this.className,
              objectId: this.id
          };
      },
      get: function(t) {
          return this.attributes[t];
      },
      relation: function(t) {
          var e = this.get(t);
          if (e) {
              if (!(e instanceof r.Relation)) throw "Called relation() on non-relation field " + t;
              return e._ensureParentAndKey(this, t), e;
          }
          return new r.Relation(this, t);
      },
      escape: function(t) {
          var e = this._escapedAttributes[t];
          if (e) return e;
          var i, s = this.attributes[t];
          return i = r._isNullOrUndefined(s) ? "" : n.escape(s.toString()), this._escapedAttributes[t] = i, 
          i;
      },
      has: function(t) {
          return !r._isNullOrUndefined(this.attributes[t]);
      },
      _mergeMagicFields: function(t) {
          var e = this, i = [ "id", "objectId", "createdAt", "updatedAt" ];
          r._arrayEach(i, function(i) {
              t[i] && ("objectId" === i ? e.id = t[i] : e[i] = t[i], delete t[i]);
          });
      },
      _startSave: function() {
          this._opSetQueue.push({});
      },
      _cancelSave: function() {
          var t = n.first(this._opSetQueue);
          this._opSetQueue = n.rest(this._opSetQueue);
          var e = n.first(this._opSetQueue);
          r._objectEach(t, function(i, n) {
              var r = t[n], s = e[n];
              r && s ? e[n] = s._mergeWithPrevious(r) : r && (e[n] = r);
          }), this._saving = this._saving - 1;
      },
      _finishSave: function(t) {
          var e = {};
          r._traverse(this.attributes, function(t) {
              t instanceof r.Object && t.id && t._hasData && (e[t.id] = t);
          });
          var i = n.first(this._opSetQueue);
          this._opSetQueue = n.rest(this._opSetQueue), this._applyOpSet(i, this._serverData), 
          this._mergeMagicFields(t);
          var s = this;
          r._objectEach(t, function(t, i) {
              s._serverData[i] = r._decode(i, t);
              var n = r._traverse(s._serverData[i], function(t) {
                  if (t instanceof r.Object && e[t.id]) return e[t.id];
              });
              n && (s._serverData[i] = n);
          }), this._rebuildAllEstimatedData(), this._saving = this._saving - 1;
      },
      _finishFetch: function(t, e) {
          this._opSetQueue = [ {} ], this._mergeMagicFields(t);
          var i = this;
          r._objectEach(t, function(t, e) {
              "Object" != t.__type ? i._serverData[e] = r._decode(e, t) : i._serverData[e] = t;
          }), this._rebuildAllEstimatedData(), this._refreshCache(), this._opSetQueue = [ {} ], 
          this._hasData = e;
      },
      _applyOpSet: function(t, e) {
          var i = this;
          r._objectEach(t, function(t, n) {
              e[n] = t._estimate(e[n], i, n), e[n] === r.Op._UNSET && delete e[n];
          });
      },
      _resetCacheForKey: function(t) {
          var e = this.attributes[t];
          if (n.isObject(e) && !(e instanceof r.Object) && !(e instanceof r.File)) {
              e = e.toJSON ? e.toJSON() : e;
              var i = JSON.stringify(e);
              if (this._hashedJSON[t] !== i) return this._hashedJSON[t] = i, !0;
          }
          return !1;
      },
      _rebuildEstimatedDataForKey: function(t) {
          var e = this;
          delete this.attributes[t], this._serverData[t] && (this.attributes[t] = this._serverData[t]), 
          r._arrayEach(this._opSetQueue, function(i) {
              var n = i[t];
              n && (e.attributes[t] = n._estimate(e.attributes[t], e, t), e.attributes[t] === r.Op._UNSET ? delete e.attributes[t] : e._resetCacheForKey(t));
          });
      },
      _rebuildAllEstimatedData: function() {
          var t = this, e = n.clone(this.attributes);
          this.attributes = n.clone(this._serverData), r._arrayEach(this._opSetQueue, function(e) {
              t._applyOpSet(e, t.attributes), r._objectEach(e, function(e, i) {
                  t._resetCacheForKey(i);
              });
          }), r._objectEach(e, function(e, i) {
              t.attributes[i] !== e && t.trigger("change:" + i, t, t.attributes[i], {});
          }), r._objectEach(this.attributes, function(i, r) {
              n.has(e, r) || t.trigger("change:" + r, t, i, {});
          });
      },
      set: function(t, e, i) {
          var s;
          if (n.isObject(t) || r._isNullOrUndefined(t) ? (s = t, r._objectEach(s, function(t, e) {
              s[e] = r._decode(e, t);
          }), i = e) : (s = {})[t] = r._decode(t, e), i = i || {}, !s) return this;
          s instanceof r.Object && (s = s.attributes), i.unset && r._objectEach(s, function(t, e) {
              s[e] = new r.Op.Unset();
          });
          var a = n.clone(s), o = this;
          if (r._objectEach(a, function(t, e) {
              t instanceof r.Op && (a[e] = t._estimate(o.attributes[e], o, e), a[e] === r.Op._UNSET && delete a[e]);
          }), !this._validate(s, i)) return !1;
          this._mergeMagicFields(s), i.changes = {};
          var c = this._escapedAttributes;
          this._previousAttributes;
          return r._arrayEach(n.keys(s), function(t) {
              var e = s[t];
              e instanceof r.Relation && (e.parent = o), e instanceof r.Op || (e = new r.Op.Set(e));
              var a = !0;
              e instanceof r.Op.Set && n.isEqual(o.attributes[t], e.value) && (a = !1), a && (delete c[t], 
              i.silent ? o._silent[t] = !0 : i.changes[t] = !0);
              var u = n.last(o._opSetQueue);
              u[t] = e._mergeWithPrevious(u[t]), o._rebuildEstimatedDataForKey(t), a ? (o.changed[t] = o.attributes[t], 
              i.silent || (o._pending[t] = !0)) : (delete o.changed[t], delete o._pending[t]);
          }), i.silent || this.change(i), this;
      },
      unset: function(t, e) {
          return e = e || {}, e.unset = !0, this.set(t, null, e);
      },
      increment: function(t, e) {
          return (n.isUndefined(e) || n.isNull(e)) && (e = 1), this.set(t, new r.Op.Increment(e));
      },
      add: function(t, e) {
          return this.set(t, new r.Op.Add([ e ]));
      },
      addUnique: function(t, e) {
          return this.set(t, new r.Op.AddUnique([ e ]));
      },
      remove: function(t, e) {
          return this.set(t, new r.Op.Remove([ e ]));
      },
      op: function(t) {
          return n.last(this._opSetQueue)[t];
      },
      clear: function(t) {
          (t = t || {}).unset = !0;
          var e = n.extend(this.attributes, this._operations);
          return this.set(e, t);
      },
      _getSaveJSON: function() {
          var t = n.clone(n.first(this._opSetQueue));
          return r._objectEach(t, function(e, i) {
              t[i] = e.toJSON();
          }), t;
      },
      _canBeSerialized: function() {
          return r.Object._canBeSerializedAsValue(this.attributes);
      },
      fetch: function(t) {
          var e = this;
          return r._request("classes", this.className, this.id, "GET").then(function(t, i, n) {
              return e._finishFetch(e.parse(t, i, n), !0), e;
          })._thenRunCallbacks(t, this);
      },
      save: function(t, e, i) {
          var s, a, o;
          if (n.isObject(t) || r._isNullOrUndefined(t) ? (s = t, o = e) : ((s = {})[t] = e, 
          o = i), !o && s && 0 === n.reject(s, function(t, e) {
              return n.include([ "success", "error", "wait" ], e);
          }).length) {
              var c = !0;
              if (n.has(s, "success") && !n.isFunction(s.success) && (c = !1), n.has(s, "error") && !n.isFunction(s.error) && (c = !1), 
              c) return this.save(null, s);
          }
          (o = n.clone(o) || {}).wait && (a = n.clone(this.attributes));
          var u = n.clone(o) || {};
          u.wait && (u.silent = !0);
          var l;
          if (u.error = function(t, e) {
              l = e;
          }, s && !this.set(s, u)) return r.Promise.error(l)._thenRunCallbacks(o, this);
          var h = this;
          h._refreshCache();
          var d = [], _ = [];
          return r.Object._findUnsavedChildren(h.attributes, d, _), d.length + _.length > 0 ? r.Object._deepSaveAsync(this.attributes).then(function() {
              return h.save(null, o);
          }, function(t) {
              return r.Promise.error(t)._thenRunCallbacks(o, h);
          }) : (this._startSave(), this._saving = (this._saving || 0) + 1, this._allPreviousSaves = this._allPreviousSaves || r.Promise.as(), 
          this._allPreviousSaves = this._allPreviousSaves._continueWith(function() {
              var t = h.id ? "PUT" : "POST", e = h._getSaveJSON();
              "PUT" === t && h._fetchWhenSave && (e._fetchWhenSave = !0);
              var i = "classes", c = h.className;
              "_User" !== h.className || h.id || (i = "users", c = null);
              var l = r._request(i, c, h.id, t, e);
              return l = l.then(function(t, e, i) {
                  var r = h.parse(t, e, i);
                  return o.wait && (r = n.extend(s || {}, r)), h._finishSave(r), o.wait && h.set(a, u), 
                  h;
              }, function(t) {
                  return h._cancelSave(), r.Promise.error(t);
              })._thenRunCallbacks(o, h);
          }), this._allPreviousSaves);
      },
      destroy: function(t) {
          t = t || {};
          var e = this, i = function() {
              e.trigger("destroy", e, e.collection, t);
          };
          return this.id ? (t.wait || i(), r._request("classes", this.className, this.id, "DELETE").then(function() {
              return t.wait && i(), e;
          })._thenRunCallbacks(t, this)) : i();
      },
      parse: function(t, e, i) {
          var r = n.clone(t);
          return n([ "createdAt", "updatedAt" ]).each(function(t) {
              r[t] && (r[t] = r[t]);
          }), r.updatedAt || (r.updatedAt = r.createdAt), e && (this._existed = 201 !== e), 
          r;
      },
      clone: function() {
          return new this.constructor(this.attributes);
      },
      isNew: function() {
          return !this.id;
      },
      change: function(t) {
          t = t || {};
          var e = this._changing;
          this._changing = !0;
          var i = this;
          r._objectEach(this._silent, function(t) {
              i._pending[t] = !0;
          });
          var s = n.extend({}, t.changes, this._silent);
          if (this._silent = {}, r._objectEach(s, function(e, n) {
              i.trigger("change:" + n, i, i.get(n), t);
          }), e) return this;
          for (;!n.isEmpty(this._pending); ) this._pending = {}, this.trigger("change", this, t), 
          r._objectEach(this.changed, function(t, e) {
              i._pending[e] || i._silent[e] || delete i.changed[e];
          }), i._previousAttributes = n.clone(this.attributes);
          return this._changing = !1, this;
      },
      existed: function() {
          return this._existed;
      },
      hasChanged: function(t) {
          return arguments.length ? this.changed && n.has(this.changed, t) : !n.isEmpty(this.changed);
      },
      changedAttributes: function(t) {
          if (!t) return !!this.hasChanged() && n.clone(this.changed);
          var e = {}, i = this._previousAttributes;
          return r._objectEach(t, function(t, r) {
              n.isEqual(i[r], t) || (e[r] = t);
          }), e;
      },
      previous: function(t) {
          return arguments.length && this._previousAttributes ? this._previousAttributes[t] : null;
      },
      previousAttributes: function() {
          return n.clone(this._previousAttributes);
      },
      isValid: function() {
          return !this.validate(this.attributes);
      },
      validate: function(t, e) {
          return !(!n.has(t, "ACL") || t.ACL instanceof r.ACL) && new r.Error(r.Error.OTHER_CAUSE, "ACL must be a Bmob.ACL.");
      },
      _validate: function(t, e) {
          if (e.silent || !this.validate) return !0;
          t = n.extend({}, this.attributes, t);
          var i = this.validate(t, e);
          return !i || (e && e.error ? e.error(this, i, e) : this.trigger("error", this, i, e), 
          !1);
      },
      getACL: function() {
          return this.get("ACL");
      },
      setACL: function(t, e) {
          return this.set("ACL", t, e);
      }
  }), r.Object.createWithoutData = function(t, e, i) {
      var n = new r.Object(t);
      return n.id = e, n._hasData = i, n;
  }, r.Object.destroyAll = function(t, e) {
      if (null == t || 0 == t.length) return r.Promise.as()._thenRunCallbacks(e);
      var i = t[0].className, s = "", a = !0;
      t.forEach(function(t) {
          if (t.className != i) throw "Bmob.Object.destroyAll requires the argument object array's classNames must be the same";
          if (!t.id) throw "Could not delete unsaved object";
          a ? (s = t.id, a = !1) : s = s + "," + t.id;
      });
      var o = n.map(t, function(t) {
          t._getSaveJSON();
          var e = "POST", i = "/1/classes/" + t.className;
          return t.id && (i = i + "/" + t.id, e = "DELETE"), t._startSave(), {
              method: e,
              path: i
          };
      });
      return r._request("batch", null, null, "POST", {
          requests: o
      })._thenRunCallbacks(e);
  }, r.Object._getSubclass = function(t) {
      if (!n.isString(t)) throw "Bmob.Object._getSubclass requires a string argument.";
      var e = r.Object._classMap[t];
      return e || (e = r.Object.extend(t), r.Object._classMap[t] = e), e;
  }, r.Object._create = function(t, e, i) {
      return new (r.Object._getSubclass(t))(e, i);
  }, r.Object._classMap = {}, r.Object._extend = r._extend, r.Object.extend = function(t, e, i) {
      if (!n.isString(t)) {
          if (t && n.has(t, "className")) return r.Object.extend(t.className, t, e);
          throw new Error("Bmob.Object.extend's first argument should be the className.");
      }
      "User" === t && (t = "_User");
      var s = null;
      if (n.has(r.Object._classMap, t)) {
          var a = r.Object._classMap[t];
          s = a._extend(e, i);
      } else (e = e || {}).className = t, s = this._extend(e, i);
      return s.extend = function(e) {
          if (n.isString(e) || e && n.has(e, "className")) return r.Object.extend.apply(s, arguments);
          var i = [ t ].concat(r._.toArray(arguments));
          return r.Object.extend.apply(s, i);
      }, r.Object._classMap[t] = s, s;
  }, r.Object._findUnsavedChildren = function(t, e, i) {
      r._traverse(t, function(t) {
          if (t instanceof r.Object) return t._refreshCache(), void (t.dirty() && e.push(t));
          t instanceof r.File && (t.url() || i.push(t));
      });
  }, r.Object._canBeSerializedAsValue = function(t) {
      var e = !0;
      return t instanceof r.Object ? e = !!t.id : n.isArray(t) ? r._arrayEach(t, function(t) {
          r.Object._canBeSerializedAsValue(t) || (e = !1);
      }) : n.isObject(t) && r._objectEach(t, function(t) {
          r.Object._canBeSerializedAsValue(t) || (e = !1);
      }), e;
  }, r.Object._deepSaveAsync = function(t) {
      var e = [], i = [];
      r.Object._findUnsavedChildren(t, e, i);
      var s = r.Promise.as();
      n.each(i, function(t) {
          s = s.then(function() {
              return t.save();
          });
      });
      var a = n.uniq(e), o = n.uniq(a);
      return s.then(function() {
          return r.Promise._continueWhile(function() {
              return o.length > 0;
          }, function() {
              var t = [], e = [];
              if (r._arrayEach(o, function(i) {
                  t.length > 20 ? e.push(i) : i._canBeSerialized() ? t.push(i) : e.push(i);
              }), o = e, 0 === t.length) return r.Promise.error(new r.Error(r.Error.OTHER_CAUSE, "Tried to save a batch with a cycle."));
              var i = r.Promise.when(n.map(t, function(t) {
                  return t._allPreviousSaves || r.Promise.as();
              })), s = new r.Promise();
              return r._arrayEach(t, function(t) {
                  t._allPreviousSaves = s;
              }), i._continueWith(function() {
                  return r._request("batch", null, null, "POST", {
                      requests: n.map(t, function(t) {
                          var e = t._getSaveJSON(), i = "POST", n = "/1/classes/" + t.className;
                          return t.id && (n = n + "/" + t.id, i = "PUT"), t._startSave(), {
                              method: i,
                              path: n,
                              body: e
                          };
                      })
                  }).then(function(e, i, n) {
                      var s;
                      if (r._arrayEach(t, function(t, r) {
                          e[r].success ? t._finishSave(t.parse(e[r].success, i, n)) : (s = s || e[r].error, 
                          t._cancelSave());
                      }), s) return r.Promise.error(new r.Error(s.code, s.error));
                  }).then(function(t) {
                      return s.resolve(t), t;
                  }, function(t) {
                      return s.reject(t), r.Promise.error(t);
                  });
              });
          });
      }).then(function() {
          return t;
      });
  }, r.Role = r.Object.extend("_Role", {
      constructor: function(t, e) {
          n.isString(t) && e instanceof r.ACL ? (r.Object.prototype.constructor.call(this, null, null), 
          this.setName(t), this.setACL(e)) : r.Object.prototype.constructor.call(this, t, e);
      },
      getName: function() {
          return this.get("name");
      },
      setName: function(t, e) {
          return this.set("name", t, e);
      },
      getUsers: function() {
          return this.relation("users");
      },
      getRoles: function() {
          return this.relation("roles");
      },
      validate: function(t, e) {
          if ("name" in t && t.name !== this.getName()) {
              var i = t.name;
              if (this.id && this.id !== t.objectId) return new r.Error(r.Error.OTHER_CAUSE, "A role's name can only be set before it has been saved.");
              if (!n.isString(i)) return new r.Error(r.Error.OTHER_CAUSE, "A role's name must be a String.");
              if (!/^[0-9a-zA-Z\-_ ]+$/.test(i)) return new r.Error(r.Error.OTHER_CAUSE, "A role's name can only contain alphanumeric characters, _, -, and spaces.");
          }
          return !!r.Object.prototype.validate && r.Object.prototype.validate.call(this, t, e);
      }
  }), r.Collection = function(t, e) {
      (e = e || {}).comparator && (this.comparator = e.comparator), e.model && (this.model = e.model), 
      e.query && (this.query = e.query), this._reset(), this.initialize.apply(this, arguments), 
      t && this.reset(t, {
          silent: !0,
          parse: e.parse
      });
  }, n.extend(r.Collection.prototype, r.Events, {
      model: r.Object,
      initialize: function() {},
      toJSON: function() {
          return this.map(function(t) {
              return t.toJSON();
          });
      },
      add: function(t, e) {
          var i, s, a, o, c, u, l = {}, h = {};
          for (e = e || {}, i = 0, a = (t = n.isArray(t) ? t.slice() : [ t ]).length; i < a; i++) {
              if (t[i] = this._prepareModel(t[i], e), !(o = t[i])) throw new Error("Can't add an invalid model to a collection");
              if (c = o.cid, l[c] || this._byCid[c]) throw new Error("Duplicate cid: can't add the same model to a collection twice");
              if (u = o.id, !r._isNullOrUndefined(u) && (h[u] || this._byId[u])) throw new Error("Duplicate id: can't add the same model to a collection twice");
              h[u] = o, l[c] = o;
          }
          for (i = 0; i < a; i++) (o = t[i]).on("all", this._onModelEvent, this), this._byCid[o.cid] = o, 
          o.id && (this._byId[o.id] = o);
          if (this.length += a, s = r._isNullOrUndefined(e.at) ? this.models.length : e.at, 
          this.models.splice.apply(this.models, [ s, 0 ].concat(t)), this.comparator && this.sort({
              silent: !0
          }), e.silent) return this;
          for (i = 0, a = this.models.length; i < a; i++) l[(o = this.models[i]).cid] && (e.index = i, 
          o.trigger("add", o, this, e));
          return this;
      },
      remove: function(t, e) {
          var i, r, s, a;
          for (e = e || {}, i = 0, r = (t = n.isArray(t) ? t.slice() : [ t ]).length; i < r; i++) (a = this.getByCid(t[i]) || this.get(t[i])) && (delete this._byId[a.id], 
          delete this._byCid[a.cid], s = this.indexOf(a), this.models.splice(s, 1), this.length--, 
          e.silent || (e.index = s, a.trigger("remove", a, this, e)), this._removeReference(a));
          return this;
      },
      get: function(t) {
          return t && this._byId[t.id || t];
      },
      getByCid: function(t) {
          return t && this._byCid[t.cid || t];
      },
      at: function(t) {
          return this.models[t];
      },
      sort: function(t) {
          if (t = t || {}, !this.comparator) throw new Error("Cannot sort a set without a comparator");
          var e = n.bind(this.comparator, this);
          return 1 === this.comparator.length ? this.models = this.sortBy(e) : this.models.sort(e), 
          t.silent || this.trigger("reset", this, t), this;
      },
      pluck: function(t) {
          return n.map(this.models, function(e) {
              return e.get(t);
          });
      },
      reset: function(t, e) {
          var i = this;
          return t = t || [], e = e || {}, r._arrayEach(this.models, function(t) {
              i._removeReference(t);
          }), this._reset(), this.add(t, {
              silent: !0,
              parse: e.parse
          }), e.silent || this.trigger("reset", this, e), this;
      },
      fetch: function(t) {
          void 0 === (t = n.clone(t) || {}).parse && (t.parse = !0);
          var e = this;
          return (this.query || new r.Query(this.model)).find().then(function(i) {
              return t.add ? e.add(i, t) : e.reset(i, t), e;
          })._thenRunCallbacks(t, this);
      },
      create: function(t, e) {
          var i = this;
          if (e = e ? n.clone(e) : {}, !(t = this._prepareModel(t, e))) return !1;
          e.wait || i.add(t, e);
          var r = e.success;
          return e.success = function(n, s, a) {
              e.wait && i.add(n, e), r ? r(n, s) : n.trigger("sync", t, s, e);
          }, t.save(null, e), t;
      },
      parse: function(t, e) {
          return t;
      },
      chain: function() {
          return n(this.models).chain();
      },
      _reset: function(t) {
          this.length = 0, this.models = [], this._byId = {}, this._byCid = {};
      },
      _prepareModel: function(t, e) {
          if (t instanceof r.Object) t.collection || (t.collection = this); else {
              var i = t;
              e.collection = this, (t = new this.model(i, e))._validate(t.attributes, e) || (t = !1);
          }
          return t;
      },
      _removeReference: function(t) {
          this === t.collection && delete t.collection, t.off("all", this._onModelEvent, this);
      },
      _onModelEvent: function(t, e, i, n) {
          ("add" !== t && "remove" !== t || i === this) && ("destroy" === t && this.remove(e, n), 
          e && "change:objectId" === t && (delete this._byId[e.previous("objectId")], this._byId[e.id] = e), 
          this.trigger.apply(this, arguments));
      }
  });
  var u = [ "forEach", "each", "map", "reduce", "reduceRight", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "max", "min", "sortBy", "sortedIndex", "toArray", "size", "first", "initial", "rest", "last", "without", "indexOf", "shuffle", "lastIndexOf", "isEmpty", "groupBy" ];
  r._arrayEach(u, function(t) {
      r.Collection.prototype[t] = function() {
          return n[t].apply(n, [ this.models ].concat(n.toArray(arguments)));
      };
  }), r.Collection.extend = r._extend, r.View = function(t) {
      this.cid = n.uniqueId("view"), this._configure(t || {}), this._ensureElement(), 
      this.initialize.apply(this, arguments), this.delegateEvents();
  };
  var l = /^(\S+)\s*(.*)$/, h = [ "model", "collection", "el", "id", "attributes", "className", "tagName" ];
  n.extend(r.View.prototype, r.Events, {
      tagName: "div",
      $: function(t) {
          return this.$el.find(t);
      },
      initialize: function() {},
      render: function() {
          return this;
      },
      remove: function() {
          return this.$el.remove(), this;
      },
      make: function(t, e, i) {
          var n = document.createElement(t);
          return e && r.$(n).attr(e), i && r.$(n).html(i), n;
      },
      setElement: function(t, e) {
          return this.$el = r.$(t), this.el = this.$el[0], !1 !== e && this.delegateEvents(), 
          this;
      },
      delegateEvents: function(t) {
          if (t = t || r._getValue(this, "events")) {
              this.undelegateEvents();
              var e = this;
              r._objectEach(t, function(i, r) {
                  if (n.isFunction(i) || (i = e[t[r]]), !i) throw new Error('Event "' + t[r] + '" does not exist');
                  var s = r.match(l), a = s[1], o = s[2];
                  i = n.bind(i, e), a += ".delegateEvents" + e.cid, "" === o ? e.$el.bind(a, i) : e.$el.delegate(o, a, i);
              });
          }
      },
      undelegateEvents: function() {
          this.$el.unbind(".delegateEvents" + this.cid);
      },
      _configure: function(t) {
          this.options && (t = n.extend({}, this.options, t));
          var e = this;
          n.each(h, function(i) {
              t[i] && (e[i] = t[i]);
          }), this.options = t;
      },
      _ensureElement: function() {
          if (this.el) this.setElement(this.el, !1); else {
              var t = r._getValue(this, "attributes") || {};
              this.id && (t.id = this.id), this.className && (t.class = this.className), this.setElement(this.make(this.tagName, t), !1);
          }
      }
  }), r.View.extend = r._extend, r.User = r.Object.extend("_User", {
      _isCurrentUser: !1,
      _mergeMagicFields: function(t) {
          t.sessionToken && (this._sessionToken = t.sessionToken, delete t.sessionToken), 
          r.User.__super__._mergeMagicFields.call(this, t);
      },
      _cleanupAuthData: function() {
          if (this.isCurrent()) {
              var t = this.get("authData");
              t && r._objectEach(this.get("authData"), function(e, i) {
                  t[i] || delete t[i];
              });
          }
      },
      _synchronizeAllAuthData: function() {
          if (this.get("authData")) {
              var t = this;
              r._objectEach(this.get("authData"), function(e, i) {
                  t._synchronizeAuthData(i);
              });
          }
      },
      _synchronizeAuthData: function(t) {
          if (this.isCurrent()) {
              var e;
              n.isString(t) ? (e = t, t = r.User._authProviders[e]) : e = t.getAuthType();
              var i = this.get("authData");
              i && t && (t.restoreAuthentication(i[e]) || this._unlinkFrom(t));
          }
      },
      _handleSaveResult: function(t) {
          t && (this._isCurrentUser = !0), this._cleanupAuthData(), this._synchronizeAllAuthData(), 
          delete this._serverData.password, this._rebuildEstimatedDataForKey("password"), 
          this._refreshCache(), (t || this.isCurrent()) && r.User._saveCurrentUser(this);
      },
      _linkWith: function(t, e) {
          var i, s = this;
          if (n.isString(t) ? (i = t, t = r.User._authProviders[t]) : i = t.getAuthType(), 
          !e) return t.authenticate().then(function(e) {
              return s._linkWith(t, e);
          });
          var a = this.get("authData") || {};
          a[i] = e, this.set("authData", a);
          var o = new r.Promise();
          return this.save({
              authData: a
          }, c).then(function(t) {
              t._handleSaveResult(!0), o.resolve(t);
          }), o._thenRunCallbacks({});
          var c;
      },
      loginWithWeapp: function(t) {
          var e = new r.Promise();
          return r.User.requestOpenId(t, {
              success: function(t) {
                  r.Object._create("_User")._linkWith("weapp", t).then(function(t) {
                      e.resolve(t);
                  }, function(t) {
                      e.reject(t);
                  });
              },
              error: function(t) {
                  e.reject(t);
              }
          }), e._thenRunCallbacks({});
      },
      _unlinkFrom: function(t, e) {
          n.isString(t) ? (t, t = r.User._authProviders[t]) : t.getAuthType();
          var i = n.clone(e), s = this;
          return i.authData = null, i.success = function(i) {
              s._synchronizeAuthData(t), e.success && e.success.apply(this, arguments);
          }, this._linkWith(t, i);
      },
      _isLinked: function(t) {
          var e;
          return e = n.isString(t) ? t : t.getAuthType(), !!(this.get("authData") || {})[e];
      },
      _logOutWithAll: function() {
          if (this.get("authData")) {
              var t = this;
              r._objectEach(this.get("authData"), function(e, i) {
                  t._logOutWith(i);
              });
          }
      },
      _logOutWith: function(t) {
          this.isCurrent() && (n.isString(t) && (t = r.User._authProviders[t]), t && t.deauthenticate && t.deauthenticate());
      },
      signUp: function(t, e) {
          var i;
          e = e || {};
          var s = t && t.username || this.get("username");
          if (!s || "" === s) return i = new r.Error(r.Error.OTHER_CAUSE, "Cannot sign up user with an empty name."), 
          e && e.error && e.error(this, i), r.Promise.error(i);
          var a = t && t.password || this.get("password");
          if (!a || "" === a) return i = new r.Error(r.Error.OTHER_CAUSE, "Cannot sign up user with an empty password."), 
          e && e.error && e.error(this, i), r.Promise.error(i);
          var o = n.clone(e);
          return o.success = function(t) {
              t._handleSaveResult(!0), e.success && e.success.apply(this, arguments);
          }, this.save(t, o);
      },
      logIn: function(t) {
          var e = this;
          return r._request("login", null, null, "GET", this.toJSON()).then(function(t, i, n) {
              var r = e.parse(t, i, n);
              return e._finishFetch(r), e._handleSaveResult(!0), e;
          })._thenRunCallbacks(t, this);
      },
      save: function(t, e, i) {
          var s, a;
          n.isObject(t) || n.isNull(t) || n.isUndefined(t) ? (s = t, a = e) : ((s = {})[t] = e, 
          a = i), a = a || {};
          var o = n.clone(a);
          return o.success = function(t) {
              t._handleSaveResult(!1), a.success && a.success.apply(this, arguments);
          }, r.Object.prototype.save.call(this, s, o);
      },
      fetch: function(t) {
          var e = t ? n.clone(t) : {};
          return e.success = function(e) {
              e._handleSaveResult(!1), t && t.success && t.success.apply(this, arguments);
          }, r.Object.prototype.fetch.call(this, e);
      },
      isCurrent: function() {
          return this._isCurrentUser;
      },
      getUsername: function() {
          return this.get("username");
      },
      setUsername: function(t, e) {
          return this.set("username", t, e);
      },
      setPassword: function(t, e) {
          return this.set("password", t, e);
      },
      getEmail: function() {
          return this.get("email");
      },
      setEmail: function(t, e) {
          return this.set("email", t, e);
      },
      authenticated: function() {
          return !!this._sessionToken && r.User.current() && r.User.current().id === this.id;
      }
  }, {
      _currentUser: null,
      _currentUserMatchesDisk: !1,
      _CURRENT_USER_KEY: "currentUser",
      _authProviders: {},
      signUp: function(t, e, i, n) {
          return (i = i || {}).username = t, i.password = e, r.Object._create("_User").signUp(i, n);
      },
      logIn: function(t, e, i) {
          var n = r.Object._create("_User");
          return n._finishFetch({
              username: t,
              password: e
          }), n.logIn(i);
      },
      logOut: function() {
          null !== r.User._currentUser && (r.User._currentUser._logOutWithAll(), r.User._currentUser._isCurrentUser = !1), 
          r.User._currentUserMatchesDisk = !0, r.User._currentUser = null, wx.removeStorage({
              key: r._getBmobPath(r.User._CURRENT_USER_KEY),
              success: function(t) {
                  console.log(t.data);
              }
          });
      },
      requestPasswordReset: function(t, e) {
          var i = {
              email: t
          };
          return r._request("requestPasswordReset", null, null, "POST", i)._thenRunCallbacks(e);
      },
      requestEmailVerify: function(t, e) {
          var i = {
              email: t
          };
          return r._request("requestEmailVerify", null, null, "POST", i)._thenRunCallbacks(e);
      },
      requestOpenId: function(t, e) {
          var i = {
              code: t
          };
          return r._request("wechatApp", t, null, "POST", i)._thenRunCallbacks(e);
      },
      current: function() {
          if (r.User._currentUser) return r.User._currentUser;
          if (r.User._currentUserMatchesDisk) return r.User._currentUser;
          r.User._currentUserMatchesDisk = !0;
          var t = !1;
          try {
              if (t = wx.getStorageSync(r._getBmobPath(r.User._CURRENT_USER_KEY))) {
                  r.User._currentUser = r.Object._create("_User"), r.User._currentUser._isCurrentUser = !0;
                  var e = JSON.parse(t);
                  return r.User._currentUser.id = e._id, delete e._id, r.User._currentUser._sessionToken = e._sessionToken, 
                  delete e._sessionToken, r.User._currentUser.set(e), r.User._currentUser._synchronizeAllAuthData(), 
                  r.User._currentUser._refreshCache(), r.User._currentUser._opSetQueue = [ {} ], r.User._currentUser;
              }
          } catch (t) {
              return null;
          }
      },
      _saveCurrentUser: function(t) {
          r.User._currentUser !== t && r.User.logOut(), t._isCurrentUser = !0, r.User._currentUser = t, 
          r.User._currentUserMatchesDisk = !0;
          var e = t.toJSON();
          e._id = t.id, e._sessionToken = t._sessionToken, wx.setStorage({
              key: r._getBmobPath(r.User._CURRENT_USER_KEY),
              data: JSON.stringify(e)
          });
      },
      _registerAuthenticationProvider: function(t) {
          r.User._authProviders[t.getAuthType()] = t, r.User.current() && r.User.current()._synchronizeAuthData(t.getAuthType());
      },
      _logInWith: function(t, e) {
          return r.Object._create("_User")._linkWith(t, e);
      }
  }), r.Query = function(t) {
      n.isString(t) && (t = r.Object._getSubclass(t)), this.objectClass = t, this.className = t.prototype.className, 
      this._where = {}, this._include = [], this._limit = -1, this._skip = 0, this._extraOptions = {};
  }, r.Query.or = function() {
      var t = n.toArray(arguments), e = null;
      r._arrayEach(t, function(t) {
          if (n.isNull(e) && (e = t.className), e !== t.className) throw "All queries must be for the same class";
      });
      var i = new r.Query(e);
      return i._orQuery(t), i;
  }, r.Query._extend = r._extend, r.Query.prototype = {
      _processResult: function(t) {
          return t;
      },
      get: function(t, e) {
          var i = this;
          return i.equalTo("objectId", t), i.first().then(function(t) {
              if (t) return t;
              var e = new r.Error(r.Error.OBJECT_NOT_FOUND, "Object not found.");
              return r.Promise.error(e);
          })._thenRunCallbacks(e, null);
      },
      toJSON: function() {
          var t = {
              where: this._where
          };
          return this._include.length > 0 && (t.include = this._include.join(",")), this._select && (t.keys = this._select.join(",")), 
          this._limit >= 0 && (t.limit = this._limit), this._skip > 0 && (t.skip = this._skip), 
          void 0 !== this._order && (t.order = this._order), r._objectEach(this._extraOptions, function(e, i) {
              t[i] = e;
          }), t;
      },
      _newObject: function(t) {
          if (void 0 === e) var e;
          return e = t && t.className ? new r.Object(t.className) : new this.objectClass();
      },
      _createRequest: function(t) {
          return r._request("classes", this.className, null, "GET", t || this.toJSON());
      },
      find: function(t) {
          var e = this;
          return this._createRequest().then(function(t) {
              return n.map(t.results, function(i) {
                  var n = e._newObject(t);
                  return n._finishFetch(e._processResult(i), !0), n;
              });
          })._thenRunCallbacks(t);
      },
      destroyAll: function(t) {
          return this.find().then(function(t) {
              return r.Object.destroyAll(t);
          })._thenRunCallbacks(t);
      },
      count: function(t) {
          var e = this.toJSON();
          return e.limit = 0, e.count = 1, this._createRequest(e).then(function(t) {
              return t.count;
          })._thenRunCallbacks(t);
      },
      first: function(t) {
          var e = this, i = this.toJSON();
          return i.limit = 1, this._createRequest(i).then(function(t) {
              return n.map(t.results, function(t) {
                  var i = e._newObject();
                  return i._finishFetch(e._processResult(t), !0), i;
              })[0];
          })._thenRunCallbacks(t);
      },
      collection: function(t, e) {
          return e = e || {}, new r.Collection(t, n.extend(e, {
              model: this._objectClass || this.objectClass,
              query: this
          }));
      },
      skip: function(t) {
          return this._skip = t, this;
      },
      limit: function(t) {
          return this._limit = t, this;
      },
      equalTo: function(t, e) {
          return this._where[t] = r._encode(e), this;
      },
      _addCondition: function(t, e, i) {
          return this._where[t] || (this._where[t] = {}), this._where[t][e] = r._encode(i), 
          this;
      },
      notEqualTo: function(t, e) {
          return this._addCondition(t, "$ne", e), this;
      },
      lessThan: function(t, e) {
          return this._addCondition(t, "$lt", e), this;
      },
      greaterThan: function(t, e) {
          return this._addCondition(t, "$gt", e), this;
      },
      lessThanOrEqualTo: function(t, e) {
          return this._addCondition(t, "$lte", e), this;
      },
      greaterThanOrEqualTo: function(t, e) {
          return this._addCondition(t, "$gte", e), this;
      },
      containedIn: function(t, e) {
          return this._addCondition(t, "$in", e), this;
      },
      notContainedIn: function(t, e) {
          return this._addCondition(t, "$nin", e), this;
      },
      containsAll: function(t, e) {
          return this._addCondition(t, "$all", e), this;
      },
      exists: function(t) {
          return this._addCondition(t, "$exists", !0), this;
      },
      doesNotExist: function(t) {
          return this._addCondition(t, "$exists", !1), this;
      },
      matches: function(t, e, i) {
          return this._addCondition(t, "$regex", e), i || (i = ""), e.ignoreCase && (i += "i"), 
          e.multiline && (i += "m"), i && i.length && this._addCondition(t, "$options", i), 
          this;
      },
      matchesQuery: function(t, e) {
          var i = e.toJSON();
          return i.className = e.className, this._addCondition(t, "$inQuery", i), this;
      },
      doesNotMatchQuery: function(t, e) {
          var i = e.toJSON();
          return i.className = e.className, this._addCondition(t, "$notInQuery", i), this;
      },
      matchesKeyInQuery: function(t, e, i) {
          var n = i.toJSON();
          return n.className = i.className, this._addCondition(t, "$select", {
              key: e,
              query: n
          }), this;
      },
      doesNotMatchKeyInQuery: function(t, e, i) {
          var n = i.toJSON();
          return n.className = i.className, this._addCondition(t, "$dontSelect", {
              key: e,
              query: n
          }), this;
      },
      _orQuery: function(t) {
          var e = n.map(t, function(t) {
              return t.toJSON().where;
          });
          return this._where.$or = e, this;
      },
      _quote: function(t) {
          return "\\Q" + t.replace("\\E", "\\E\\\\E\\Q") + "\\E";
      },
      contains: function(t, e) {
          return this._addCondition(t, "$regex", this._quote(e)), this;
      },
      startsWith: function(t, e) {
          return this._addCondition(t, "$regex", "^" + this._quote(e)), this;
      },
      endsWith: function(t, e) {
          return this._addCondition(t, "$regex", this._quote(e) + "$"), this;
      },
      ascending: function(t) {
          return r._isNullOrUndefined(this._order) ? this._order = t : this._order = this._order + "," + t, 
          this;
      },
      cleanOrder: function(t) {
          return this._order = null, this;
      },
      descending: function(t) {
          return r._isNullOrUndefined(this._order) ? this._order = "-" + t : this._order = this._order + ",-" + t, 
          this;
      },
      near: function(t, e) {
          return e instanceof r.GeoPoint || (e = new r.GeoPoint(e)), this._addCondition(t, "$nearSphere", e), 
          this;
      },
      withinRadians: function(t, e, i) {
          return this.near(t, e), this._addCondition(t, "$maxDistance", i), this;
      },
      withinMiles: function(t, e, i) {
          return this.withinRadians(t, e, i / 3958.8);
      },
      withinKilometers: function(t, e, i) {
          return this.withinRadians(t, e, i / 6371);
      },
      withinGeoBox: function(t, e, i) {
          return e instanceof r.GeoPoint || (e = new r.GeoPoint(e)), i instanceof r.GeoPoint || (i = new r.GeoPoint(i)), 
          this._addCondition(t, "$within", {
              $box: [ e, i ]
          }), this;
      },
      include: function() {
          var t = this;
          return r._arrayEach(arguments, function(e) {
              n.isArray(e) ? t._include = t._include.concat(e) : t._include.push(e);
          }), this;
      },
      select: function() {
          var t = this;
          return this._select = this._select || [], r._arrayEach(arguments, function(e) {
              n.isArray(e) ? t._select = t._select.concat(e) : t._select.push(e);
          }), this;
      },
      each: function(t, e) {
          if (e = e || {}, this._order || this._skip || this._limit >= 0) {
              return r.Promise.error("Cannot iterate on a query with sort, skip, or limit.")._thenRunCallbacks(e);
          }
          new r.Promise();
          var i = new r.Query(this.objectClass);
          i._limit = e.batchSize || 100, i._where = n.clone(this._where), i._include = n.clone(this._include), 
          i.ascending("objectId");
          var s = !1;
          return r.Promise._continueWhile(function() {
              return !s;
          }, function() {
              return i.find().then(function(e) {
                  var n = r.Promise.as();
                  return r._.each(e, function(e) {
                      n = n.then(function() {
                          return t(e);
                      });
                  }), n.then(function() {
                      e.length >= i._limit ? i.greaterThan("objectId", e[e.length - 1].id) : s = !0;
                  });
              });
          })._thenRunCallbacks(e);
      }
  }, r.FriendShipQuery = r.Query._extend({
      _objectClass: r.User,
      _newObject: function() {
          return new r.User();
      },
      _processResult: function(t) {
          var e = t[this._friendshipTag];
          return "Pointer" === e.__type && "_User" === e.className && (delete e.__type, delete e.className), 
          e;
      }
  }), r.History = function() {
      this.handlers = [], n.bindAll(this, "checkUrl");
  };
  var d = /^[#\/]/, _ = /msie [\w.]+/;
  r.History.started = !1, n.extend(r.History.prototype, r.Events, {
      interval: 50,
      getHash: function(t) {
          var e = (t ? t.location : window.location).href.match(/#(.*)$/);
          return e ? e[1] : "";
      },
      getFragment: function(t, e) {
          if (r._isNullOrUndefined(t)) if (this._hasPushState || e) {
              t = window.location.pathname;
              var i = window.location.search;
              i && (t += i);
          } else t = this.getHash();
          return t.indexOf(this.options.root) || (t = t.substr(this.options.root.length)), 
          t.replace(d, "");
      },
      start: function(t) {
          if (r.History.started) throw new Error("Bmob.history has already been started");
          r.History.started = !0, this.options = n.extend({}, {
              root: "/"
          }, this.options, t), this._wantsHashChange = !1 !== this.options.hashChange, this._wantsPushState = !!this.options.pushState, 
          this._hasPushState = !!(this.options.pushState && window.history && window.history.pushState);
          var e = this.getFragment(), i = document.documentMode, s = _.exec(navigator.userAgent.toLowerCase()) && (!i || i <= 7);
          s && (this.iframe = r.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow, 
          this.navigate(e)), this._hasPushState ? r.$(window).bind("popstate", this.checkUrl) : this._wantsHashChange && "onhashchange" in window && !s ? r.$(window).bind("hashchange", this.checkUrl) : this._wantsHashChange && (this._checkUrlInterval = window.setInterval(this.checkUrl, this.interval)), 
          this.fragment = e;
          var a = window.location, o = a.pathname === this.options.root;
          return this._wantsHashChange && this._wantsPushState && !this._hasPushState && !o ? (this.fragment = this.getFragment(null, !0), 
          window.location.replace(this.options.root + "#" + this.fragment), !0) : (this._wantsPushState && this._hasPushState && o && a.hash && (this.fragment = this.getHash().replace(d, ""), 
          window.history.replaceState({}, document.title, a.protocol + "//" + a.host + this.options.root + this.fragment)), 
          this.options.silent ? void 0 : this.loadUrl());
      },
      stop: function() {
          r.$(window).unbind("popstate", this.checkUrl).unbind("hashchange", this.checkUrl), 
          window.clearInterval(this._checkUrlInterval), r.History.started = !1;
      },
      route: function(t, e) {
          this.handlers.unshift({
              route: t,
              callback: e
          });
      },
      checkUrl: function(t) {
          var e = this.getFragment();
          if (e === this.fragment && this.iframe && (e = this.getFragment(this.getHash(this.iframe))), 
          e === this.fragment) return !1;
          this.iframe && this.navigate(e), this.loadUrl() || this.loadUrl(this.getHash());
      },
      loadUrl: function(t) {
          var e = this.fragment = this.getFragment(t);
          return n.any(this.handlers, function(t) {
              if (t.route.test(e)) return t.callback(e), !0;
          });
      },
      navigate: function(t, e) {
          if (!r.History.started) return !1;
          e && !0 !== e || (e = {
              trigger: e
          });
          var i = (t || "").replace(d, "");
          if (this.fragment !== i) {
              if (this._hasPushState) {
                  0 !== i.indexOf(this.options.root) && (i = this.options.root + i), this.fragment = i;
                  var n = e.replace ? "replaceState" : "pushState";
                  window.history[n]({}, document.title, i);
              } else this._wantsHashChange ? (this.fragment = i, this._updateHash(window.location, i, e.replace), 
              this.iframe && i !== this.getFragment(this.getHash(this.iframe)) && (e.replace || this.iframe.document.open().close(), 
              this._updateHash(this.iframe.location, i, e.replace))) : window.location.assign(this.options.root + t);
              e.trigger && this.loadUrl(t);
          }
      },
      _updateHash: function(t, e, i) {
          if (i) {
              var n = t.toString().replace(/(javascript:|#).*$/, "");
              t.replace(n + "#" + e);
          } else t.hash = e;
      }
  }), r.Router = function(t) {
      (t = t || {}).routes && (this.routes = t.routes), this._bindRoutes(), this.initialize.apply(this, arguments);
  };
  var p = /:\w+/g, f = /\*\w+/g, m = /[\-\[\]{}()+?.,\\\^\$\|#\s]/g;
  n.extend(r.Router.prototype, r.Events, {
      initialize: function() {},
      route: function(t, e, i) {
          return r.history = r.history || new r.History(), n.isRegExp(t) || (t = this._routeToRegExp(t)), 
          i || (i = this[e]), r.history.route(t, n.bind(function(n) {
              var s = this._extractParameters(t, n);
              i && i.apply(this, s), this.trigger.apply(this, [ "route:" + e ].concat(s)), r.history.trigger("route", this, e, s);
          }, this)), this;
      },
      navigate: function(t, e) {
          r.history.navigate(t, e);
      },
      _bindRoutes: function() {
          if (this.routes) {
              var t = [];
              for (var e in this.routes) this.routes.hasOwnProperty(e) && t.unshift([ e, this.routes[e] ]);
              for (var i = 0, n = t.length; i < n; i++) this.route(t[i][0], t[i][1], this[t[i][1]]);
          }
      },
      _routeToRegExp: function(t) {
          return t = t.replace(m, "\\$&").replace(p, "([^/]+)").replace(f, "(.*?)"), new RegExp("^" + t + "$");
      },
      _extractParameters: function(t, e) {
          return t.exec(e).slice(1);
      }
  }), r.Router.extend = r._extend, r.generateCode = r.generateCode || {}, r.generateCode = function(t, e) {
      return r._request("wechatApp/qr/generatecode", null, null, "POST", r._encode(t, null, !0)).then(function(t) {
          return r._decode(null, t);
      })._thenRunCallbacks(e);
  }, r.sendMessage = r.sendMessage || {}, r.sendMessage = function(t, e) {
      return r._request("wechatApp/SendWeAppMessage", null, null, "POST", r._encode(t, null, !0)).then(function(t) {
          return r._decode(null, t);
      })._thenRunCallbacks(e);
  }, r.sendMasterMessage = r.sendMasterMessage || {}, r.sendMasterMessage = function(t, e) {
      return r._request("wechatApp/notifyMsg", null, null, "POST", r._encode(t, null, !0)).then(function(t) {
          return r._decode(null, t);
      })._thenRunCallbacks(e);
  }, r.Sms = r.Sms || {}, n.extend(r.Sms, {
      requestSms: function(t, e) {
          return r._request("requestSms", null, null, "POST", r._encode(t, null, !0)).then(function(t) {
              return r._decode(null, t);
          })._thenRunCallbacks(e);
      },
      requestSmsCode: function(t, e) {
          return r._request("requestSmsCode", null, null, "POST", r._encode(t, null, !0)).then(function(t) {
              return r._decode(null, t);
          })._thenRunCallbacks(e);
      },
      verifySmsCode: function(t, e, i) {
          var n = {
              mobilePhoneNumber: t
          };
          return r._request("verifySmsCode/" + e, null, null, "POST", r._encode(n, null, !0)).then(function(t) {
              return r._decode(null, t);
          })._thenRunCallbacks(i);
      },
      querySms: function(t, e) {
          return r._request("querySms/" + t, null, null, "GET", null).then(function(t) {
              return r._decode(null, t);
          })._thenRunCallbacks(e);
      }
  }), r.Pay = r.Pay || {}, n.extend(r.Pay, {
      wechatPay: function(t, e, i, n, s) {
          var a = {
              order_price: t,
              product_name: e,
              body: i,
              open_id: n,
              pay_type: 4
          };
          return r._request("pay", null, null, "POST", r._encode(a, null, !0)).then(function(t) {
              return r._decode(null, t);
          })._thenRunCallbacks(s);
      },
      queryOrder: function(t, e) {
          return r._request("pay/" + t, null, null, "GET", null).then(function(t) {
              return r._decode(null, t);
          })._thenRunCallbacks(e);
      }
  }), r.Cloud = r.Cloud || {}, n.extend(r.Cloud, {
      run: function(t, e, i) {
          return r._request("functions", t, null, "POST", r._encode(e, null, !0)).then(function(t) {
              return r._decode(null, t).result;
          })._thenRunCallbacks(i);
      }
  }), r.Installation = r.Object.extend("_Installation"), r.Push = r.Push || {}, r.Push.send = function(t, e) {
      if (t.where && (t.where = t.where.toJSON().where), t.push_time && (t.push_time = t.push_time.toJSON()), 
      t.expiration_time && (t.expiration_time = t.expiration_time.toJSON()), t.expiration_time && t.expiration_time_interval) throw "Both expiration_time and expiration_time_interval can't be set";
      return r._request("push", null, null, "POST", t)._thenRunCallbacks(e);
  };
  "undefined" == typeof module || module.exports;
  var v = {};
  exports.BmobSocketIo = v;
}).call(void 0);