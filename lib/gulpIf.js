'use strict';

var gutil = require('gulp-util');

module.exports = function(b, pipeTarget) {
  return b ? pipeTarget : gutil.noop();
};
