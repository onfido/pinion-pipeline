'use strict';

var env = require('./env');

module.exports = function(errorObject) {
  if(env.isProduction()) {
    console.log(errorObject);
    process.exit(1);
  }
  else {
    var notify = require('gulp-notify');
    notify.onError(errorObject.toString().split(': ').join(':\n')).apply(this, arguments);
  }
};
