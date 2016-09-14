'use strict';

var changed = require('gulp-changed');
var gulp = require('gulp');
var gutil = require('gulp-util');
var debug = require('../lib/gulpDebug');
var cookTask = require('../lib/cookTask');
var cookTaskConfig = require('../lib/cookTaskConfig');

module.exports = function(config) {
  var rawTaskConfig = config.tasks.resources;
  if(!rawTaskConfig) return;

  var defaultTaskConfig = {
    src: '.',
    dest: '.'
  };
  var taskConfig = cookTaskConfig(rawTaskConfig, defaultTaskConfig);

  var rawTask = function(options) {
    gutil.log('Building resources from ' + JSON.stringify(options.src));

    return gulp.src(options.src)
      .pipe(debug({ title: 'resources' }))
      .pipe(changed(options.dest)) // Ignore unchanged files
      .pipe(gulp.dest(options.dest));
  };

  gulp.task('resources', cookTask(rawTask, config.root, taskConfig));
};
