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

  var relativePathArr = config.tasks.images.src;
  if(!Array.isArray(relativePathArr)) {
    relativePathArr = [relativePathArr];
  }

  var imagesSrc = relativePathArr.reduceRight(function(soFar, relativePath) {
    console.warn(soFar, relativePath);
    var rootImagePath = path.join(config.root.src, relativePath, '/**');
    // Search for images in the package's node_modules too
    var npmImagePath = path.join(process.cwd(), 'node_modules', relativePath, '/**');

    // Order is important, it denotes merge priority (sooner is higher)
    var imagePathArr = [
      rootImagePath,
      npmImagePath
    ];

    return imagePathArr.concat(soFar);
  }, []);

  var paths = {
    src: imagesSrc,
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
