'use strict';

var changed = require('gulp-changed');
var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');
var env = require('../lib/env');
var gulpIf = require('../lib/gulpIf');
var debug = require('../lib/gulpDebug');
var imagemin = require('../lib/gulpImagemin');
var cookTask = require('../lib/cookTask');
var cookTaskConfig = require('../lib/cookTaskConfig');

module.exports = function(config) {
  var rawTaskConfig = config.tasks.images;
  if(!rawTaskConfig) return;

  var defaultTaskConfig = {
    src: '.',
    dest: '.',
    npm: true
  };
  var taskConfig = cookTaskConfig(rawTaskConfig, defaultTaskConfig);

  var rawTask = function(options) {
    gutil.log('Building images from ' + JSON.stringify(options.src));

    return gulp.src(options.src)
      .pipe(debug({ title: 'images' }))
      .pipe(changed(options.dest)) // Ignore unchanged files
      .pipe(gulpIf(env.isProduction(), imagemin())) // Optimize
      .pipe(gulp.dest(options.dest));
  };

  gulp.task('images', cookTask(rawTask, config.root, taskConfig));
};
