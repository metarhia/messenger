'use strict';

process.env.NODE_ENV = 'production';

const childProcess = require('child_process');
const path = require('path');
const webpack = require('webpack');
const config = require('../config/webpack.config.prod');
const placeFiles = require('./placeFiles');

const buildDir = path.join(__dirname, '../build');
const staticDir = path.join(__dirname, '../../static');

childProcess.execSync('rm -rf ' + buildDir);

webpack(config).run((err, stats) => {
  if (err) {
    console.error('Failed to create a production build. Reason:');
    console.error(err.message || err);
    process.exit(1);
  }

  placeFiles(() => {
    console.log('The bundle is optimized and ready to be deployed to production.');
  });
});
