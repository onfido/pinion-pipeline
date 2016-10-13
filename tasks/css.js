'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var handleErrors = require('../lib/handleErrors');
var env = require('../lib/env');
var gulpIf = require('../lib/gulpIf');
var debug = require('../lib/gulpDebug');
var cookTask = require('../lib/cookTask');
var cookTaskConfig = require('../lib/cookTaskConfig');

var defaultTaskConfig = {
  src: 'stylesheets',
  dest: '.',
  extensions: ['css', 'scss']
};

module.exports = function(config) {
  var rawTaskConfig = config.tasks.css;
  if(!rawTaskConfig) return;

  var taskConfig = cookTaskConfig(rawTaskConfig, defaultTaskConfig);

  var rawTask = function (options) {
    gutil.log('Compiling SASS from ' + JSON.stringify(options.src));
    var sassConfig = options.config.sass || {};

    // Allow `@import` calls to search the package's node_modules directory
    sassConfig.includePaths = ['node_modules'];

    return gulp.src(options.src)
      .pipe(debug({ title: 'css' }))
      .pipe(gulpIf(!env.isProduction(), sourcemaps.init()))
      .pipe(sass(sassConfig))
      .on('error', handleErrors)
      .pipe(autoprefixer(options.config.autoprefixer))
      .pipe(gulpIf(env.isProduction(), cleanCSS()))
      .pipe(gulpIf(!env.isProduction(), sourcemaps.write()))
      .pipe(gulp.dest(options.dest));
  };

  gulp.task('css', cookTask(rawTask, config.root, taskConfig));
};

module.exports.defaultTaskConfig = defaultTaskConfig;
