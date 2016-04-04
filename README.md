http://localhost:8080/webpack-dev-server/example.html

# vue-gesture

> gesture events plugin for Vue.js.You can v-gesture directive,and directive auguments can use a tap, swipe, touchstart etc.
- tap — fires when the element is tapped.
- doubleTap — this pair of events can be used to detect double taps on the same element
- longTap — fires when an element is tapped and the finger is held down for more than 750ms.
- swipe, swipeLeft, swipeRight, swipeUp, swipeDown — fires when an element is swiped 
- touchstart touchmove touchend - These equivalent to touch the primary event


## Install

#### CommonJS

- Available through npm as `vue-gesture`.

  ``` js
  var VueGesture = require('vue-gesture')
  Vue.use(VueGesture)
  ```

#### Direct include

- You can also directly include it with a `<script>` tag when you have Vue already included globally. It will automatically install itself, and will add a global `vueGesture`.

## Usage

#### Using the `v-gesture` directive

``` html
<div v-gesture:touchstart.stop.prevent="handle($event, 'touchstart')">touchstart</div>
<div v-gesture:touchmove="handle($event, 'touchmove')">touchmove</div>
<div v-gesture:touchend.stop.prevent="handle($event, 'touchend')">touchend</div>
<div v-gesture:tap.stop.prevent="handle($event, 'tap')">tap</div>
<div v-gesture:doubletap.stop.prevent="handle($event, 'doubleTap')">doubleTap</div>
<div v-gesture:longTap.stop.prevent="handle($event, 'longTap')">longTap</div>
<div v-gesture:swipe="handle($event, 'swipe')">swipe</div>
<div v-gesture:swipeLeft="handle($event, 'swipeLeft')">swipeLeft</div>
<div v-gesture:swipeRight="handle($event, 'swipeRight')">swipeRight</div>
<div v-gesture:swipeUp="handle($event, 'swipeUp')">swipeUp</div>
<div v-gesture:swipeDown="handle($event, 'swipeDown')">swipeDown</div>
```

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

