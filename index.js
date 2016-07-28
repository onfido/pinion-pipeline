'use strict';

/*
  gulpfile.js
  ===========
  Rather than manage one giant configuration file responsible
  for creating multiple tasks, each task has been broken out into
  its own file in ./tasks. Any files in that directory get
  automatically required below.

  To add a new task, simply add a new task file that directory.
  ./tasks/default.js specifies the default set of tasks to run
  when you run `pinion`.
*/

var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');
var requireDir = require('require-dir');

function passConfigRecursive(taskConstrucs, config) {
  Object.keys(taskConstrucs).forEach(function(key) {
    if(!taskConstrucs.hasOwnProperty(key)) {
      return;
    }

    if(typeof taskConstrucs[key] === 'object') {
      passConfigRecursive(taskConstrucs[key], config);
    }
    else if(typeof taskConstrucs[key] === 'function') {
      taskConstrucs[key](config);
    }
    else {
      throw new Error('Can only pass config to a function, or an object containing functions');
    }
  });
}

module.exports = {
  start: function(toRun, config) {
    config = config || {};

    // Load all of the tasks that we might need to run
    var taskConstrucs = requireDir('./tasks', { recurse: true });
    passConfigRecursive(taskConstrucs, config);

    // `gulp.start()` forces our tasks in parallel, so we need a pseudo-task to
    // force sequential task running
    gulp.task('__toRun', gulpSequence.apply(this, toRun));
    gulp.start('__toRun');
  }
};
