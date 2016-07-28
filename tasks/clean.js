'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');

module.exports = function(config) {
  var cleanTask = function () {
    gutil.log('Cleaning ' + config.root.dest);

    return del([config.root.dest]);
  };

  gulp.task('clean', cleanTask);
};
