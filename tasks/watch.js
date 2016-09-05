'use strict';

var gulp = require('gulp');
var path = require('path');
var env = require('../lib/env');

module.exports = function(config) {
  var watchTask = function() {
    if(env.isProduction()) {
      throw new Error('Cannot run the `watch` task in production mode!');
    }

    var watch = require('gulp-watch');

    var watchableTasks = ['fonts', 'images', 'svgSprite', 'resources', 'html', 'css'];

    watchableTasks.forEach(function(taskName) {
      var taskList = config.tasks[taskName];
      if(taskList) {
        if(!Array.isArray(taskList)) {
          taskList = [taskList];
        }

        var globList = taskList.map(function(task) {
          var taskSrc = Array.isArray(task.src) ? '{' + task.src.join(',') + '}' : task.src;
          return path.join(config.root.src, taskSrc, '**/*');
        });

        watch(globList, { usePolling: true }, function() {
          gulp.start(taskName);
        });
      }
    });
  };

  gulp.task('watch', ['build:watch'], watchTask);
};
