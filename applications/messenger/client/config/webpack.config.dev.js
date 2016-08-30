'use strict';

const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const AssetsWebpackPlugin = require('assets-webpack-plugin');

const srcPath = path.resolve(__dirname, '../src');
const nodeModulesPath = path.join(__dirname, '../../../../node_modules');
const indexHtmlPath = path.resolve(__dirname, '../index.html');
const logoPath = path.resolve(__dirname, '../metarhia.png');
const buildPath = path.join(__dirname, '../build');

module.exports = {
  devtool: 'source-map',
  entry: [
    'babel-polyfill',
    path.join(srcPath, 'index')
  ],
  watch: true,
  output: {
    path: buildPath,
    pathinfo: true,
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['', '.js'],
  },
  resolveLoader: {
    root: nodeModulesPath,
    moduleTemplates: ['*-loader']
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint',
        include: srcPath,
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        include: srcPath,
        loader: 'babel',
        query: require('./babel.dev')
      },
      {
        test: /\.css$/,
        loader: 'style!css!postcss'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
        loader: 'url?limit=10000',
      },
      {
        test: /\.(mp4|webm)$/,
        loader: 'url?limit=10000'
      }
    ]
  },
  eslint: {
    configFile: path.join(__dirname, 'eslint.js'),
    useEslintrc: false
  },
  postcss: function() {
    return [autoprefixer];
  },
  plugins: [
    new AssetsWebpackPlugin({
      path: buildPath,
      assetsRegex: /favicon\.ico$/
    }),
    new FaviconsWebpackPlugin({
      logo: logoPath,
      persistentCache: true,
      inject: true,
      title: 'Metarhia Messenger',
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        coast: false,
        favicons: true,
        firefox: false,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false
      }
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: indexHtmlPath
    }),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"development"' }),
  ]
};
