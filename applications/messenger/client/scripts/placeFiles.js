'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const execSync = require('child_process').execSync;

const buildPath = path.resolve(__dirname, '../build');
const staticPath = path.resolve(__dirname, '../../static');
const webpackAssets = path.join(buildPath, 'webpack-assets.json');

function fixFavicon(callback) {
  fs.readFile(webpackAssets, (err, data) => {
    if (err) throw err;
    let assets = JSON.parse(data).assets;
    let favicon = assets.find(asset => {
      return asset.name.endsWith('favicon.ico');
    });
    if (favicon) {
      copyFavicon(favicon.name, finalize);
    } else {
      console.log(chalk.yellow('Warning: no favicon.ico'));
      finalize();
    }
  });

  function finalize() {
    removeAssetsData(callback);
  }
}

function copyFavicon(filename, callback) {
  let source = path.join(buildPath, filename);
  let destination = path.join(buildPath, 'favicon.ico');
  let sourceStream = fs.createReadStream(source);
  let destinationStream = fs.createWriteStream(destination);
  destinationStream.on('close', callback);
  sourceStream.pipe(destinationStream);
}

function removeAssetsData(callback) {
  fs.unlink(webpackAssets, callback);
}

module.exports = (callback) => {
  fixFavicon(() => {
    let staticIndex = path.join(staticPath, 'index.html');
    let wwwIndex = path.resolve(staticPath, '../www/html.template');
    execSync('rsync -a --delete ' + buildPath + '/ ' + staticPath);
    execSync('mv ' + staticIndex + ' ' + wwwIndex);
    callback();
  });
};
