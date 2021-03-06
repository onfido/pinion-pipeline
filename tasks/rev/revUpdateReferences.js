'use strict';

var gulp = require('gulp');
var path = require('path');
var revReplace = require('gulp-rev-replace');

module.exports = function(config) {
  // Update asset references with reved filenames in compiled css + js + html
  gulp.task('rev-update-references', function(){
    var manifest = gulp.src(path.join(config.root.dest, 'rev-manifest.json'));

    return gulp.src(path.join(config.root.dest,'/**/**.{css,js,html}'))
      .pipe(revReplace({manifest: manifest}))
      .pipe(gulp.dest(config.root.dest));
  });
};
