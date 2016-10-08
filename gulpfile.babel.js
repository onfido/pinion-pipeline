'use strict';

import gulp from 'gulp';
import jshint from 'gulp-jshint';
import uglify from 'gulp-uglify';
import babel from 'gulp-babel';

gulp.task('lint', () =>
  gulp.src([
    '*.js',
    './tasks/**/*.js',
    './bin/**/*.js',
    './lib/**/*.js'
  ])
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
);

gulp.task('bundle', () =>
  gulp.src([
    './index.js',
    './tasks/**/*.js',
    './bin/**/*.js',
    './lib/**/*.js'
  ], { base: '.' })
  .pipe(babel({
      presets: ['es2015']
  }))
  .pipe(uglify())
  .pipe(gulp.dest('dist'))
);

gulp.task('default', ['lint', 'bundle']);
