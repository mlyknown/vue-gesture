

var webpack = require('webpack');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
// var HtmlWebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
  entry: './vue-gesture.js',
  output: {
    filename: './dist/vue-gesture.js'
  },
  plugins: [
    new uglifyJsPlugin({
      compress: {
        warnings: false
      },
      except: ['$super', '$', 'exports', 'require']    //排除关键字
    }),
    // new HtmlwebpackPlugin({
    //   title: 'vue-gesture'
    // }),
    new OpenBrowserPlugin({
      url: 'http://localhost:8080'
    })
  ]
};