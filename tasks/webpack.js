'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var env = require('../lib/env');
var logger = require('../lib/compileLogger');
var webpack = require('webpack');

module.exports = function(config) {
  if(!config.tasks.js) return;

  var wpconfig = require('../lib/webpackBaseConfig')(config);

  if(env.isDevelopment()) {
    wpconfig.devtool = 'source-map';
    webpack.debug = true;
  }

  if(env.isProduction()) {
    wpconfig.plugins.push(
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.NoErrorsPlugin()
    );
  }

  var webpackTask = function(watch) {
    return function(callback) {
      var initialCompile = false;
      var onCompile = function(err, stats) {
        logger(err, stats);

        if(!initialCompile) {
          initialCompile = true;
          callback();
        }
      };

      if(watch) {
        gutil.log('Kicking off webpack in watch-mode');

        var watchOptions = {
          poll: true
        };

        webpack(wpconfig).watch(watchOptions, onCompile);
      }
      else {
        gutil.log('Kicking off webpack in build-mode');

        webpack(wpconfig, onCompile);
      }
    };
  };

  gulp.task('webpack', webpackTask(false));
  gulp.task('webpack:watch', webpackTask(true));
};
