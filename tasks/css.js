'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var handleErrors = require('../lib/handleErrors');
var env = require('../lib/env');
var gulpIf = require('../lib/gulpIf');
var debug = require('../lib/gulpDebug');
var autoprefixer = require('gulp-autoprefixer');
var path = require('path');
var npmSass = require('npm-sass');
var cleanCSS = require('gulp-clean-css');

module.exports = function(config) {
  if(!config.tasks.css) return;

  var ignore = [];
  if(config.tasks.css.ignore) {
    ignore.push('!' + path.join(config.root.src, config.tasks.css.ignore));
  }

  var paths = {
    src: [
      path.join(
        config.root.src,
        config.tasks.css.src,
        '/**/*.{' + config.tasks.css.extensions + '}'
      )
    ].concat(ignore),
    dest: path.join(config.root.dest, config.tasks.css.dest)
  };

  var cssTask = function () {
    gutil.log('Compiling SASS from ' + JSON.stringify(paths.src));
    var sassConfig = config.tasks.css.sass;

    // Allow `@import` calls to search the package's node_modules directory
    sassConfig.importer = npmSass.importer;

    return gulp.src(paths.src)
      .pipe(debug({ title: 'css' }))
      .pipe(gulpIf(!env.isProduction(), sourcemaps.init()))
      .pipe(sass(sassConfig))
      .on('error', handleErrors)
      .pipe(autoprefixer(config.tasks.css.autoprefixer))
      .pipe(gulpIf(env.isProduction(), cleanCSS()))
      .pipe(gulpIf(!env.isProduction(), sourcemaps.write()))
      .pipe(gulp.dest(paths.dest));
  };

  gulp.task('css', cssTask);
};
