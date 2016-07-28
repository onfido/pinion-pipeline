'use strict';

var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');

module.exports = function() {
  var defaultTask = function(cb) {
    gulpSequence('clean', 'watch', cb);
  };

  gulp.task('default', defaultTask);
};
