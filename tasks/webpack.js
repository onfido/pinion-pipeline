'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var PassThrough = require('readable-stream/passthrough');
var env = require('../lib/env');
var logger = require('../lib/compileLogger');
var cookTask = require('../lib/cookTask');
var cookTaskConfig = require('../lib/cookTaskConfig');

var defaultTaskConfig = {
  src: 'javascripts',
  dest: '.',
  extensions: ['js'],
  cssModules: true
};

module.exports = function(config) {
  var rawTaskConfig = config.tasks.js;
  if(!rawTaskConfig) return;

  var taskConfig = cookTaskConfig(rawTaskConfig, defaultTaskConfig);

  var rawTask = function(watch) {
    var wpconfig = require('../lib/webpackBaseConfig')(taskConfig, config.root);

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

    var wpStream = new PassThrough();

    var initialCompile = false;
    var onCompile = function(err, stats) {
      logger(err, stats);

      if(!initialCompile) {
        initialCompile = true;
        wpStream.end();
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

    return wpStream;
  };

  var cookWebpackTask = function(watch) {
    return cookTask(rawTask.bind(rawTask, watch), config.root, taskConfig);
  };

  gulp.task('webpack', cookWebpackTask(false));
  gulp.task('webpack:watch', cookWebpackTask(true));
};

module.exports.defaultTaskConfig = defaultTaskConfig;
