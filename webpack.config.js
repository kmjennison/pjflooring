
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/js/app.js',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist', 'js')
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: './src/app.html',
    }),
    new ExtractTextPlugin('./src/css/app.css'),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 9000
  },
  module: {
    rules: [{
      test: /\.css$/,
      // use: 'css-loader'
      use: ExtractTextPlugin.extract({
        use: 'css-loader'
      })
    }]
  }
};
