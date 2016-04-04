/**
 * Created by mlyknown on 4/1/16
**/

// tap — fires when the element is tapped.
// doubleTap — this pair of events can be used to detect both single and double taps on the same element (if you don’t need double tap detection, use tap instead).
// longTap — fires when an element is tapped and the finger is held down for more than 750ms.
// swipe, swipeLeft, swipeRight, swipeUp, swipeDown — fires when an element is swiped (optionally in the given direction)

(function(){
  //todo if(vueGesture) return;
  if(vueGesture) return;
  var vueGesture = {};
  vueGesture.domCaches = {};
  vueGesture.gloabal = {
    domUuid : 1,
    InternalKeyName : "vueGestureInternalKey"
  }
  vueGesture.util={
        getType:function(o){    //判断对象类型
            var _t;
            return ((_t = typeof(o)) == "object" ? o==null && "null" || Object.prototype.toString.call(o).slice(8,-1):_t).toLowerCase();
        },
        deepClone:function(source){    //深拷贝
            var self=this;    //保存当前对象引用
            var destination=self.getType(source);
            destination=destination==='array'?[]:(destination==='object'?{}:source);
            for (var p in source) {
                if (self.getType(source[p]) === "array" || self.getType(source[p]) === "object") {
                    destination[p] = self.getType(source[p]) === "array" ? [] : {};
                    destination[p]=arguments.callee.call(self, source[p]);    //使用call修改函数的作用域
                } else {
                    destination[p] = source[p];
                }
            }
            return destination;
        }
    };
  vueGesture.config = {
    maxSingleTapTimeInterval : 300, // ms
    maxSingleTapPageDistanceSquared : 25, // within 5px we consider it as a single tap
    minLongtapTimeInterval : 750,
    maxDoubleTapTimeInterval: 250,
    maxDoubleTapPageDistanceSquared: 64 //8px
  };

  vueGesture.Statics = {       
    initEvents : function(self){
      var _self = this;
      var b = vueGesture.Statics.isInDomCaches(self);
      if(b) return;
      var domCache = vueGesture.Statics.getDomCache(self);
      self.el.addEventListener('touchstart',function(e) {
        _self.touchstartHandler(self, e);
        console.log("start");
        },false);
      self.el.addEventListener('touchmove',function(e) {
        _self.touchmoveHandler(self, e);
        console.log("move", event.touches[0].pageX, event.touches[0].pageY);
      },false);
      self.el.addEventListener('touchend',function(e) {
        _self.touchendHandler(self, e);
      },false);
    },
    invokeHandler : function(e, o, touch, gestureName){
      if (vueGesture.judgements[gestureName](touch)) {
        o.fn(e);;
      }
      if(o.modifiers.stop)
        e.stopPropagation();
      if(o.modifiers.prevent)
        e.preventDefault();
    },
    touchstartHandler : function(self, e) {
      var domCache = vueGesture.Statics.getDomCache(self);
      var touch = domCache.touch; 
      if(this.isPrimaryTouch(e)) return;
      touch.touchstartTime = e.timeStamp;
      touch.touchstartCoord.pageX = e.touches[0].pageX;
      touch.touchstartCoord.pageY = e.touches[0].pageY;
    },
    touchmoveHandler : function(self ,e){
      e.preventDefault();
    },
    touchendHandler : function(self, e) {
      var _self = this;
      var domCache = vueGesture.Statics.getDomCache(self);
      var touch = domCache.touch; 
      touch.touchendTime = e.timeStamp;
      touch.touchendCoord.pageX = e.changedTouches[0].pageX;
      touch.touchendCoord.pageY = e.changedTouches[0].pageY;
      //is match condition;
      for (var o in domCache.gestureEvents){
        _self.invokeHandler(e, domCache.gestureEvents[o], touch, o);
      }
      touch.lastTouchstartTime = touch.touchstartTime;
      touch.lastTouchendTime = touch.touchendTime;
      touch.lastTouchstartCoord = vueGesture.util.deepClone(touch.touchstartCoord);
      touch.lastTouchstartCoord = vueGesture.util.deepClone(touch.touchendCoord);
    },
    getDomCache : function(self) {
        return vueGesture.domCaches[self.el[vueGesture.gloabal.InternalKeyName]] || 
          (vueGesture.domCaches[self.el[vueGesture.gloabal.InternalKeyName] = vueGesture.gloabal.domUuid++] = this.initDomCache());
    },
    isInDomCaches : function(self){
        return vueGesture.domCaches[self.el[vueGesture.gloabal.InternalKeyName]] ? true : false;
    },
    unbindDirective : function(self) {
      self.el.removeEventListener('click', invokeHandler)
      self.el.removeEventListener('touchend', handleTouchEnd)
      self.el.removeEventListener('touchstart', handleTouchStart)
    },
    initDomCache : function(){
      return {
        touch : {
          touchstartTime : 0,
          touchendTime : 0,
          touchstartCoord : {},
          touchendCoord : {},

          lastTouchendTime : 0,
          lastTouchstartTime: 0,
          lastTouchstartCoord : {},
          lastPageXDistance : {},

          get timeInterval () {
            return this.touchendTime - this.touchstartTime;
          },
          get pageXDistance () {
            return this.touchendCoord.pageX - this.touchstartCoord.pageX;
          },
          get pageYDistance () {
            return this.touchendCoord.pageY - this.touchstartCoord.pageY;
          },
          get lastTimeInterval () {
            return this.lastTouchendTime - this.lastTouchstartTime;
          },
          get lastPageXDistance () {
            return this.touchendCoord.pageX - this.touchstartCoord.pageX;
          },
          get lastPageYDistance () {
            return this.touchendCoord.pageY - this.touchstartCoord.pageY;
          },
          get deltaTime () {
            return this.touchendTime - this.lastTouchstartTime;
          }
        },
        gestureEvents: {}
      }
    },
    getEventNameByArg : function(arg){
      var str = (0 === arg.indexOf(':') ? arg.substr(1):arg);
      str = str.toLowerCase();
      if (typeof vueGesture.judgements[str] != "function") {
        return false;
      }
      return str;
    },
    isPrimaryTouch : function(event){
      // ensure swiping with one touch and not pinching
      return (event.touches.length > 1 || event.scale && event.scale !== 1);
    }
  };
  vueGesture.judgements = {
    'tap': function(touch){
      return (touch.timeInterval < vueGesture.config.maxSingleTapTimeInterval) && (touch.pageXDistance * touch.pageXDistance + touch.pageYDistance * touch.pageYDistance) < vueGesture.config.maxSingleTapPageDistanceSquared;
    },
    'longtap': function(touch){
      return (touch.timeInterval > vueGesture.config.minLongtapTimeInterval) && (touch.pageXDistance * touch.pageXDistance + touch.pageYDistance * touch.pageYDistance) < vueGesture.config.maxSingleTapPageDistanceSquared;
    },
    'doubletap': function(touch){
      return touch.deltaTime < vueGesture.config.maxDoubleTapTimeInterval && 
        (touch.lastPageXDistance * touch.lastPageXDistance + touch.lastPageYDistance * touch.lastPageYDistance) < vueGesture.config.maxDoubleTapPageDistanceSquared &&
        (touch.timeInterval < vueGesture.config.maxSingleTapTimeInterval) && (touch.pageXDistance * touch.pageXDistance + touch.pageYDistance * touch.pageYDistance) < vueGesture.config.maxSingleTapPageDistanceSquared &&
        (touch.lastTimeInterval < vueGesture.config.maxSingleTapTimeInterval) && (touch.lastPageXDistance * touch.lastPageXDistance + touch.lastPageYDistance * touch.lastPageYDistance) < vueGesture.config.maxSingleTapPageDistanceSquared;
    },
    'swipe': function(touch){
      return (touch.pageXDistance * touch.pageXDistance + touch.pageYDistance * touch.pageYDistance) > vueGesture.config.maxSingleTapPageDistanceSquared;
    },
    'swipeleft': function(touch){
      if(!this['swipe'](touch)) return false;
      return touch.pageXDistance < 0 && Math.abs(touch.pageXDistance) > Math.abs(touch.pageYDistance);
    },
    'swiperight': function(touch){
      if(!this['swipe'](touch)) return false;
      return touch.pageXDistance > 0 && Math.abs(touch.pageXDistance) > Math.abs(touch.pageYDistance);
    },
    'swipeup': function(touch){
      if(!this['swipe'](touch)) return false;
      return touch.pageYDistance < 0 && Math.abs(touch.pageYDistance) > Math.abs(touch.pageXDistance);
    },
    'swipedown': function(touch){
      if(!this['swipe'](touch)) return false;
      return touch.pageYDistance > 0 && Math.abs(touch.pageYDistance) > Math.abs(touch.pageXDistance);
    }
  };
  vueGesture.install = function(Vue){
    Vue.directive('gesture', {
      acceptStatement: true,
      priority: Vue.directive('on').priority,

      bind: function () {
        var self = this;
        var domCache = vueGesture.Statics.initEvents(self);
      },

      update: function (fn) {
        var self = this;
        if(typeof fn !== 'function') {
          return console.error('The param of directive "v-tap" must be a function!');
        }
        var eventName = vueGesture.Statics.getEventNameByArg(self.arg);
        var domCache = vueGesture.Statics.getDomCache(self);
        if(!eventName) {
          console.error("self.arg not corrent argument");
          return;
        }
        domCache.gestureEvents[eventName] = {},
        domCache.gestureEvents[eventName].fn = fn;
        domCache.gestureEvents[eventName].modifiers = self.modifiers;
      },

      unbind: function () {
        vueGesture.Statics.unbindDirective(this);
      }
    });
  }

  if (typeof exports === 'object') {
    module.exports = vueGesture;
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return vueGesture;
    })
  } else if (window.Vue) {
    window.vueGesture = vueGesture;
    Vue.use(vueGesture);
  }
})()