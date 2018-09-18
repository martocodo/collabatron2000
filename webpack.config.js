var path = require('path');
var webpack = require('webpack');
module.exports = {
  entry: './app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/env']
        }
      }
    ]
  },
  stats: {
    colors: true
  },
  node: {
    fs: 'empty',
    net: 'empty'
  },
  mode: 'development',
  externals: {
    uws: 'uws'
  }
};