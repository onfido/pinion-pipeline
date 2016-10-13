'use strict';

var env = require('./env');

module.exports = function(errorObject) {
  if(env.isDevelopment()) {
    var notify = require('gulp-notify');
    notify.onError(errorObject.toString().split(': ').join(':\n')).apply(this, arguments);
  }
};
