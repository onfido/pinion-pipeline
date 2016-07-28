'use strict';

var gutil = require('gulp-util');
var env = require('./env');

module.exports = function(debugOptions) {
  var debugMethod = gutil.noop();

  if(!env.isProduction()) {
    var debug = require('gulp-debug');
    debugMethod = debug(debugOptions);
  }

  return debugMethod;
};
