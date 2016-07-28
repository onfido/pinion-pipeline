'use strict';

var changed = require('gulp-changed');
var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');
var debug = require('../lib/gulpDebug');

module.exports = function(config) {
  if(!config.tasks.fonts) return;

  var paths = {
    src: path.join(config.root.src, config.tasks.fonts.src, '/**/*'),
    dest: path.join(config.root.dest, config.tasks.fonts.dest)
  };

  var fontsTask = function() {
    gutil.log('Building fonts from ' + JSON.stringify(paths.src));

    return gulp.src(paths.src)
      .pipe(debug({ title: 'fonts' }))
      .pipe(changed(paths.dest)) // Ignore unchanged files
      .pipe(gulp.dest(paths.dest));
  };

  gulp.task('fonts', fontsTask);
};
