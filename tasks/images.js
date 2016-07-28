'use strict';

var changed = require('gulp-changed');
var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');
var env = require('../lib/env');
var gulpIf = require('../lib/gulpIf');
var debug = require('../lib/gulpDebug');
var imagemin = require('../lib/gulpImagemin');

module.exports = function(config) {
  if(!config.tasks.images) return;

  var paths = {
    src: path.join(config.root.src, config.tasks.images.src, '/**'),
    dest: path.join(config.root.dest, config.tasks.images.dest)
  };

  var imagesTask = function() {
    gutil.log('Building images from ' + JSON.stringify(paths.src));

    return gulp.src(paths.src)
      .pipe(debug({ title: 'images' }))
      .pipe(changed(paths.dest)) // Ignore unchanged files
      .pipe(gulpIf(env.isProduction(), imagemin())) // Optimize
      .pipe(gulp.dest(paths.dest));
  };

  gulp.task('images', imagesTask);
};
