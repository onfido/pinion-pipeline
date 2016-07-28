'use strict';

var changed = require('gulp-changed');
var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');
var debug = require('../lib/gulpDebug');

module.exports = function(config) {
  if(!config.tasks.resources) return;

  var paths = {
    src: path.join(config.root.src, config.tasks.resources.src, '/**'),
    dest: path.join(config.root.dest, config.tasks.resources.dest)
  };

  var resourcesTask = function() {
    gutil.log('Building resources from ' + JSON.stringify(paths.src));

    return gulp.src(paths.src)
      .pipe(debug({ title: 'resources' }))
      .pipe(changed(paths.dest)) // Ignore unchanged files
      .pipe(gulp.dest(paths.dest));
  };

  gulp.task('resources', resourcesTask);
};
