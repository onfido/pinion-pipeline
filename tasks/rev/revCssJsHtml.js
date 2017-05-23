'use strict';

var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');
var path = require('path');
var rev = require('gulp-rev');
var revNapkin = require('gulp-rev-napkin');
var joinGlob = require('../../lib/joinGlob');

module.exports = function(config) {
  // Rev CSS and JS files

  function revTask(suffixList) {
    if(!Array.isArray(suffixList)) {
      suffixList = [suffixList];
    }

    var srcList = suffixList.map(function(suffix) {
      return joinGlob(config.root.dest, '**/', suffix);
    });

    return gulp.src(srcList)
      .pipe(rev())
      .pipe(gulp.dest(config.root.dest))
      .pipe(revNapkin({verbose: false}))
      .pipe(rev.manifest(path.join(config.root.dest, 'rev-manifest.json'), {merge: true}))
      .pipe(gulp.dest(''));
  }

  gulp.task('rev-css', function(){
    return revTask('*.css');
  });

  gulp.task('rev-js', function() {
    return revTask('*.js');
  });

  gulp.task('rev-html', function() {
    return revTask(['*.html', '!index.html']);
  });

  gulp.task('rev-css-js-html', gulpSequence('rev-css', 'rev-js', 'rev-html'));
};
