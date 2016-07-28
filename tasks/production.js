'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpSequence = require('gulp-sequence');
var env = require('../lib/env');

module.exports = function() {
  var productionTask = function() {
    if(!env.isProduction()) {
      gutil.log(
        gutil.colors.red('WARNING!'),
        'You are running the production build, but your NODE_ENV is not \'production\''
      );
    }

    return gulpSequence('clean', 'build', 'rev');
  };

  gulp.task('production', productionTask);
};
