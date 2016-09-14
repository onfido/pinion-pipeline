'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var svgstore = require('gulp-svgstore');
var path = require('path');
var env = require('../lib/env');
var debug = require('../lib/gulpDebug');
var gulpIf = require('../lib/gulpIf');
var imagemin = require('../lib/gulpImagemin');
var cookTask = require('../lib/cookTask');
var cookTaskConfig = require('../lib/cookTaskConfig');

var defaultTaskConfig = {
  src: '.',
  dest: '.',
  extensions: ['svg']
};

module.exports = function(config) {
  var rawTaskConfig = config.tasks.svgSprite;
  if(!rawTaskConfig) return;

  var taskConfig = cookTaskConfig(rawTaskConfig, defaultTaskConfig);

  var rawTask = function(options) {
    gutil.log('Building SVGs from ' + JSON.stringify(options.src));

    return gulp.src(options.src)
      .pipe(debug({ title: 'svg' }))
      .pipe(gulpIf(env.isProduction(), imagemin()))
      .pipe(svgstore())
      .pipe(gulp.dest(options.dest));
  };

  gulp.task('svgSprite', cookTask(rawTask, config.root, taskConfig));
};

module.exports.defaultTaskConfig = defaultTaskConfig;
