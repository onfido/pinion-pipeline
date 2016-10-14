'use strict';

import gulp from 'gulp';
import jshint from 'gulp-jshint';
import babel from 'gulp-babel';

const lintSrc = [
  '*.js',
  './tasks/**/*.js',
  './wsTasks/**/*.js',
  './bin/**/*.js',
  './lib/**/*.js'
];

const bundleSrc = [
  './*.js',
  '!./gulpfile.*.js',
  './tasks/**/*.js',
  './wsTasks/**/*.js',
  './bin/**/*.js',
  './lib/**/*.js'
];

gulp.task('lint', () =>
  gulp.src(lintSrc)
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
);

gulp.task('bundle', () =>
  gulp.src(bundleSrc, { base: '.' })
  .pipe(babel({
      presets: ['es2015']
  }))
  .pipe(gulp.dest('dist'))
);

gulp.task('default', ['lint', 'bundle']);

gulp.task('watch', () => {
  gulp.watch(lintSrc, ['lint']);
  gulp.watch(bundleSrc, ['bundle']);
});
