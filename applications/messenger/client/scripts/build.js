'use strict';

process.env.NODE_ENV = 'production';

var childProcess = require('child_process');
var path = require('path');
var webpack = require('webpack');
var config = require('../config/webpack.config.prod');
var copyFavicon = require('./copyFavicon');

var buildDir = path.join(__dirname, '../build');
var staticDir = path.join(__dirname, '../../static');

childProcess.execSync('rm -rf ' + buildDir);

webpack(config).run(function(err, stats) {
  if (err) {
    console.error('Failed to create a production build. Reason:');
    console.error(err.message || err);
    process.exit(1);
  }

  copyFavicon(function() {
    childProcess.execSync('rsync -a --delete ' + buildDir + '/ ' + staticDir);
    console.log('The bundle is optimized and ready to be deployed to production.');
  });
});
