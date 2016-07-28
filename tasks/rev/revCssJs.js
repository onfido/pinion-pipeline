'use strict';

var gulp = require('gulp');
var path = require('path');
var rev = require('gulp-rev');
var revNapkin = require('gulp-rev-napkin');

module.exports = function(config) {
  // Rev CSS and JS files

  function revTask(suffix) {
    return gulp.src(path.join(config.root.dest, '**/*.' + suffix))
      .pipe(rev())
      .pipe(gulp.dest(config.root.dest))
      .pipe(revNapkin({verbose: false}))
      .pipe(rev.manifest(path.join(config.root.dest, 'rev-manifest.json'), {merge: true}))
      .pipe(gulp.dest(''));
  }

  gulp.task('rev-css', function(){
    return revTask('css');
  });

  gulp.task('rev-js', function() {
    return revTask('js');
  });

  gulp.task('rev-css-js', ['rev-css', 'rev-js']);
};
