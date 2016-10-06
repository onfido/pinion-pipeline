'use strict';

var changed = require('gulp-changed');
var gulp = require('gulp');
var gutil = require('gulp-util');
var debug = require('../lib/gulpDebug');
var cookTask = require('../lib/cookTask');
var cookTaskConfig = require('../lib/cookTaskConfig');

var defaultTaskConfig = {
  src: 'fonts',
  dest: '.'
};

module.exports = function(config) {
  var rawTaskConfig = config.tasks.fonts;
  if(!rawTaskConfig) return;

  var taskConfig = cookTaskConfig(rawTaskConfig, defaultTaskConfig);

  var rawTask = function(options) {
    gutil.log('Building fonts from ' + JSON.stringify(options.src));

    return gulp.src(options.src)
      .pipe(debug({ title: 'fonts' }))
      .pipe(changed(options.dest)) // Ignore unchanged files
      .pipe(gulp.dest(options.dest));
  };

  gulp.task('fonts', cookTask(rawTask, config.root, taskConfig));
};

module.exports.defaultTaskConfig = defaultTaskConfig;
