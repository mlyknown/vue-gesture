# vue-gesture

> **Vue-Gesture** is a simple Vue.js gesture events plugin.
 >It runs now under Vue.js 2, which comes from a fork, to see here: https://github.com/bees4ever/vue2-gesture. The old version for Vue.js 1 is not longer available.
 See the example for how to use this plugin, simply it's now a component and not a directive anymore.
 There are a bunches of arguments you can use, i.e. tap, swipe, touchstart etc. 
 When you are in the use of the PC，"tap, longtap, touchstart" will automatically be converted to "click".

- tap — fires when the element is tapped.
- doubleTap — this pair of events can be used to detect double taps on the same element
- longTap — fires when an element is tapped and the finger is held down for more than 750ms.
- swipe, swipeLeft, swipeRight, swipeUp, swipeDown — fires when an element is swiped 
- touchstart touchmove touchend click- These equivalent to touch the primary event 


## Install

#### CommonJS

The updated version is available through npm as `vue2-gesture`. So simply run `npm install vue2-gesture`. Then you can use it as follows:

  ``` js
  // You may use: 
    window.Vue = Vue;
  var VueGesture = require('vue2-gesture')
  Vue.use(VueGesture)
  ```

#### Direct include

You can also directly include it with a `<script>` tag when you have Vue already included globally. It will automatically install itself, and will add a global `vueGesture`.

## Usage

#### Using the `vue-gesture` component
***WARNING: You may have to use <vue2-gesture> if you installed the npm version***

You can add a single event with the `type` parameter or you add a set of events with the `types` parameter which is
a javascript array.

``` html
 <vue-gesture :type="'touchstart'"  :call="handleComponent.bind(this,'touchstart')" >touchstart</vue-gesture>
  <vue-gesture :type="'touchmove'"  :call="handleComponent.bind(this,'touchmove')" ><i>touchmove</i></vue-gesture>
  <vue-gesture :type="'touchend'"  :call="handleComponent.bind(this,'touchend')" >touchend</vue-gesture>
  <vue-gesture :type="'doubletap'"  :call="handleComponent.bind(this,'doubletap')">doubleTap</vue-gesture>
  <vue-gesture :type="'tap'"  :call="handleComponent.bind(this,'tap')">tap</vue-gesture>
  <vue-gesture :type="'longTap'"  :call="handleComponent.bind(this,'longTap')">longTap</vue-gesture>
  <vue-gesture :type="'swipe'"  :call="handleComponent.bind(this,'swipe')">swipe</vue-gesture>
  <vue-gesture :type="'swipeLeft'"  :call="handleComponent.bind(this,'swipeLeft')">swipeLeft</vue-gesture>
  <vue-gesture :type="'swipeRight'"  :call="handleComponent.bind(this,'swipeRight')">swipeRight</vue-gesture>
  <vue-gesture :type="'swipeUp'"  :call="handleComponent.bind(this,'swipeUp')">swipeUp</vue-gesture>
  <vue-gesture :type="'swipeDown'"  :call="handleComponent.bind(this,'swipeDown')">swipeDown</vue-gesture>
  <vue-gesture :type="'click'"  :call="handleComponent.bind(this,'click')">click</vue-gesture>
  <vue-gesture :types="['swipeDown','click']"   :call="handleComponent.bind(this,'EVENT')" >swipeDown and click</vue-gesture>

```

Where `handleComponent` is a method in your Vue.js web-application. `handleComponent` should understand this two parameters:

  ``` js
 handleComponent: function(str,e){
             // str is the second input, like 'longTap', 'touchmove', 
             // there you can pass some information to the handler 
             // e is the element itself, you may use it or not
             var html = e.srcElement.innerHTML;
             e.srcElement.innerHTML=html+" "+str;
             console.log(str);
         }
  ```
  
#### EDIT:

A simpler way to handle vue-gesture events have been provided by @sjoerdloeve and uses this syntax:

```
<vue-gesture :type="'tap'" :call="() => { changeProperty = true}" >tap</vue-gesture>
```
_Where the type, of course, is changeable._


#### Configuring Recognizer Options

There are two ways to customize recognizer options such as `direction` and `threshold`. The first one is setting global options:

``` js
// change the config
vueGesture.config = {
  maxSingleTapTimeInterval: 200
}
```
#### Registering Custom Events

See `/example` for a multi-event demo. To build it, run `npm install && npm run build`.

## License

MIT
