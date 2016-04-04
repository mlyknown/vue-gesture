http://localhost:8080/webpack-dev-server/example.html

# vue-gesture

> gesture events plugin for Vue.js


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
<div class="button" v-gesture::tap="handle($event, 'tap')"></div>
<div class="button" v-gesture::singletap="handle($event, 'singleTap')"></div>
<div class="button" v-gesture::doubletap="handle($event, 'doubleTap')"></div>
<div class="button" v-gesture::longTap="handle($event, 'longTap')"></div>
<div class="button" v-gesture::swipe="handle($event, 'swipe')"></div>
<div class="button" v-gesture::swipeLeft="handle($event, 'swipeLeft')"></div>
<div class="button" v-gesture::swipeRight="handle($event, 'swipeRight')"></div>
<div class="button" v-gesture::swipeUp="handle($event, 'swipeUp')"></div>
<div class="button" v-gesture:swipeDown="handle($event, 'swipeDown')"></div>
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

