'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var objectAssign = require('object-assign');
var PassThrough = require('readable-stream/passthrough');
var env = require('../lib/env');
var logger = require('../lib/compileLogger');
var cookTask = require('../lib/cookTask');
var cookTaskConfig = require('../lib/cookTaskConfig');

// Webpack builds both JS and CSS, so needs default config for both of these tasks
var defaultJsTaskConfig = {
  src: 'javascripts',
  dest: '.',
  extensions: ['js'],
  cssModules: true
};
var defaultCssTaskConfig = {
  src: 'stylesheets',
  dest: '.',
  extensions: ['css', 'scss']
};

function addCssEntries(config) {
  // CSS tasks did not use to specify entries, so we need to generate them to be
  // backwards compatible. This also will allow us to glob webpack JS files, if
  // we want to add it as a feature

  var srcGlobless = config.src.split('*')[0];
  var srcGlob = config.src.substr(srcGlobless.length);
  config.src = srcGlobless;
  config.entriesGlob = srcGlob || '**/*.{' + config.extensions.join(',') + '}';

  return config;
}

module.exports = function(config) {
  var rawJsTaskConfig = config.tasks.js;
  var rawCssTaskConfig = config.tasks.css;
  if(!rawJsTaskConfig && !rawCssTaskConfig) return;

  var taskConfig = [];
  if(rawJsTaskConfig) {
    var jsTaskConfig = cookTaskConfig(rawJsTaskConfig, defaultJsTaskConfig);
    taskConfig.push(jsTaskConfig);
  }
  if(rawCssTaskConfig) {
    var cssTaskConfig = cookTaskConfig(rawCssTaskConfig, defaultCssTaskConfig);
    taskConfig.push(cssTaskConfig);
  }
  taskConfig = cookTaskConfig(taskConfig);

  var rawTask = function(watch, options) {
    var wpBaseConfig = require('../lib/webpackBaseConfig');
    var wpconfigArr = [];
    options.config.taskArray.forEach(function(optionsTaskConfig) {
      var optionsSrcArr = optionsTaskConfig.src || options.config.src;
      if(!Array.isArray(optionsSrcArr)) {
        optionsSrcArr = [optionsSrcArr];
      }
      optionsSrcArr.forEach(function(optionsSrc) {
        var flattenedConfig = addCssEntries(objectAssign({},
          options.config,
          optionsTaskConfig,
          {src: optionsSrc}
        ));

        var wpconfig = wpBaseConfig(flattenedConfig, config.root);

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

        wpconfigArr.push(wpconfig);
      });
    });

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

      webpack(wpconfigArr).watch(watchOptions, onCompile);
    }
    else {
      gutil.log('Kicking off webpack in build-mode');

      webpack(wpconfigArr, onCompile);
    }

    return wpStream;
  };

  var cookWebpackTask = function(watch) {
    return cookTask(rawTask.bind(rawTask, watch), config.root, taskConfig);
  };

  gulp.task('webpack', cookWebpackTask(false));
  gulp.task('webpack:watch', cookWebpackTask(true));
};
