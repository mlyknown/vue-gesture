/**
 * Created by mlyknown on 4/1/16
**/

// tap — fires when the element is tapped.
// doubleTap — this pair of events can be used to detect both single and double taps on the same element (if you don’t need double tap detection, use tap instead).
// longTap — fires when an element is tapped and the finger is held down for more than 750ms.
// swipe, swipeLeft, swipeRight, swipeUp, swipeDown — fires when an element is swiped (optionally in the given direction)
// touchstart touchmove touchend - These equivalent to touch the primary event

;(function(){
  if(vueGesture && vueGesture.config && vueGesture.config.id === "vue-Gesture@ylminglmingming@gmail.com") return;
  var vueGesture = {};
  vueGesture.gloabal = {
    id: "vue-Gesture@ylminglmingming@gmail.com",
    domUuid : 1,
    InternalKeyName : "vueGestureInternalKey"
  }
  vueGesture.domCaches = {};
  vueGesture.util={
        getType:function(o){   
          var _t;
          return ((_t = typeof(o)) == "object" ? o==null && "null" || Object.prototype.toString.call(o).slice(8,-1):_t).toLowerCase();
        },
        deepClone:function(source){    
          var self=this;   
          var destination=self.getType(source);
          destination=destination==='array'?[]:(destination==='object'?{}:source);
          for (var p in source) {
              if (self.getType(source[p]) === "array" || self.getType(source[p]) === "object") {
                  destination[p] = self.getType(source[p]) === "array" ? [] : {};
                  destination[p]=arguments.callee.call(self, source[p]);    
              } else {
                  destination[p] = source[p];
              }
          }
          return destination;
        },
        isFunction: function(f){
          return (f && Object.prototype.toString.call(f)==="[object Function]") ? true : false;
        }
    };
  vueGesture.config = {
    maxSingleTapTimeInterval : 300, // ms
    maxSingleTapPageDistanceSquared : 25, // within 5px we consider it as a single tap
    minLongtapTimeInterval : 700,
    maxDoubleTapTimeInterval: 300,
    maxDoubleTapPageDistanceSquared: 64, //8px
    gestureEventsToClick:['tap', 'longtap', 'touchstart']
  };

  vueGesture.Statics = {
    initEvents : function(self){
      var _self = this;
      var b = vueGesture.Statics.isInDomCaches(self);
      if(b) return;
      var domCache = vueGesture.Statics.getDomCache(self);

      domCache.listenTouchEvents.touchstart = function(e) {
        if (_self.isPC()) {return}
        if(_self.isPrimaryTouch(e)) return;
        _self.touchstartHandler(self, e);
      }
      domCache.listenTouchEvents.touchmove = function(e) {
        if (_self.isPC()) {return}
        if(_self.isPrimaryTouch(e)) return;
        _self.touchmoveHandler(self, e);
      }
      domCache.listenTouchEvents.touchend = function(e) {
        if(e.type != "touchend") return;
        if (_self.isPC()) {return}
        if(_self.isPrimaryTouch(e)) return;
        _self.touchendHandler(self, e);
      }
      domCache.listenTouchEvents.click = function(e){
        //todo
        // if(_self.isPrimaryTouch(e)) return;
        _self.clickHandler(self, e);
      }
      self.addEventListener('touchstart',domCache.listenTouchEvents.touchstart,false);
      self.addEventListener('touchmove',domCache.listenTouchEvents.touchmove,false);
      self.addEventListener('touchend',domCache.listenTouchEvents.touchend,false);
      self.addEventListener('click',domCache.listenTouchEvents.click,false);
    },
    invokeHandler : function(e, o, touch, gestureName){

      var _self = this;
      if (vueGesture.judgements[gestureName](touch)) {
        _self.executeFn(e, o);
      }
    },
    clickHandler: function(self , e){
      var _self = this;
      var domCache = vueGesture.Statics.getDomCache(self);
      var touch = domCache.touch;
      var o = domCache.gestureEvents['click'];
      if (o) {
        _self.executeFn(e ,o);
      }
      if (_self.isPC()) {
        vueGesture.config.gestureEventsToClick.forEach(function(elem){
          var _o = domCache.gestureEvents[elem];
          if (_o){
            _self.executeFn(e ,_o);
          }
        });
      }
    },
    touchstartHandler : function(self, e) {

      var _self = this;
      var domCache = vueGesture.Statics.getDomCache(self);
      var touch = domCache.touch;
      var o = domCache.gestureEvents['touchstart'];
      if (o) {
        _self.executeFn(e, o);
      }
      touch.touchstartTime = e.timeStamp;
      touch.touchstartCoord.pageX = e.touches[0].pageX;
      touch.touchstartCoord.pageY = e.touches[0].pageY;
    },
    touchmoveHandler : function(self ,e){
      var _self = this;
      var domCache = vueGesture.Statics.getDomCache(self);
      var touch = domCache.touch;
      var o = domCache.gestureEvents['touchmove'];
      if (o) {
        _self.executeFn(e , o);
      }
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
      touch.lastTouchendCoord = vueGesture.util.deepClone(touch.touchendCoord);
    },
    getDomCache : function(self) {
        return vueGesture.domCaches[self[vueGesture.gloabal.InternalKeyName]] ||
          (vueGesture.domCaches[self[vueGesture.gloabal.InternalKeyName] = vueGesture.gloabal.domUuid++] = this.initDomCache());
    },
    isInDomCaches : function(self){

      return vueGesture.domCaches[self[vueGesture.gloabal.InternalKeyName]] ? true : false;
    },
    unbindDirective : function(self) {
      var domCache = vueGesture.Statics.getDomCache(self);
      vueGesture.Statics.removeDirectiveEventListeners(self, domCache);
      //todo Memory recovery
      vueGesture.domCaches[self.el[vueGesture.gloabal.InternalKeyName]] = null;
      delete vueGesture.domCaches[self.el[vueGesture.gloabal.InternalKeyName]];
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
          lastTouchendCoord: {},

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
        gestureEvents: {},
        listenTouchEvents: {}
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
    },
    isPC :function() {
      var uaInfo = navigator.userAgent;
      var agents = ["Android", "iPhone", "Windows Phone", "iPad", "iPod"];
      var flag = true;
      for (var i = 0; i < agents.length; i++) {
         if (uaInfo.indexOf(agents[i]) > 0) { flag = false; break; }
      }
      return flag;
    },
    removeDirectiveEventListeners : function(self, domCache){
      self.removeEventListener('touchstart', domCache.listenTouchEvents.touchstart);
      self.removeEventListener('touchmove', domCache.listenTouchEvents.touchmove);
      self.removeEventListener('touchend', domCache.listenTouchEvents.touchend);
      self.removeEventListener('click', domCache.listenTouchEvents.click);
    },
    executeFn: function(e ,o){
      o.fn(e);
       if(typeof o.modifiers != "undefined")
       {
         if(o.modifiers.stop)
             e.stopPropagation();
         if(o.modifiers.prevent)
             e.preventDefault();
       }

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
    },
    //not calculate
    'touchstart': function(){return false},
    'touchmove': function(){return false},
    'touchend': function(){return true},
    'click': function(){return false;}
  };


    Vue.component('vue-gesture', {
        template: '<span><slot></slot></span>',
        props: {
            type: {type: String, default: function () { return "touch" }},
            call: {type: Function }

        },
        mounted: function () {
            var self = this;
            vueGesture.Statics.initEvents(this.$el);
            if(typeof this.call !== 'function') {
              console.log(this.call);
                return console.error('The expression of directive "v-gesture" must be a function!');
            }
            var eventName = vueGesture.Statics.getEventNameByArg(this.type);
            var domCache = vueGesture.Statics.getDomCache(this.$el);
            if(!eventName) {
                //console.error("self.arg not correct argument;");
                return;
            }
            domCache.gestureEvents[eventName] = {};
            domCache.gestureEvents[eventName].fn = this.call;


        },
        data: function () {
            return {};
        }
    });

})()
