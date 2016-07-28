'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('lint', function() {
  return gulp.src([
      '*.js',
      './tasks/**/*.js',
      './devTasks/**/*.js',
      './bin/**/*.js',
      './lib/**/*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('default', ['lint']);
