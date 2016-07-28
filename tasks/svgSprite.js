'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var svgstore = require('gulp-svgstore');
var path = require('path');
var env = require('../lib/env');
var debug = require('../lib/gulpDebug');
var gulpIf = require('../lib/gulpIf');
var imagemin = require('../lib/gulpImagemin');

module.exports = function(config) {
  if(!config.tasks.svgSprite) return;

  var svgSpriteTask = function() {

    var settings = {
      src: path.join(config.root.src, config.tasks.svgSprite.src, '/*.svg'),
      dest: path.join(config.root.dest, config.tasks.svgSprite.dest)
    };

    gutil.log('Building SVGs from ' + JSON.stringify(settings.src));

    return gulp.src(settings.src)
      .pipe(debug({ title: 'svg' }))
      .pipe(gulpIf(env.isProduction(), imagemin()))
      .pipe(svgstore())
      .pipe(gulp.dest(settings.dest));
  };

  gulp.task('svgSprite', svgSpriteTask);
};
