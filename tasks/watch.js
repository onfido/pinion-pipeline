'use strict';

var gulp = require('gulp');
var path = require('path');
var watch = require('gulp-watch');
var merge = require('merge-stream');
var env = require('../lib/env');
var cookTask = require('../lib/cookTask');
var cookTaskConfig = require('../lib/cookTaskConfig');

var nonEmptyFilter = function(item) {
  return Boolean(item);
};

module.exports = function(config) {
  var watchableTasks = ['fonts', 'images', 'svgSprite', 'resources', 'css'];

  var watchTask = function() {
    var watchStreams = watchableTasks.map(function(taskName) {
      var rawTaskConfig = config.tasks[taskName];
      if(!rawTaskConfig) return;

      var defaultTaskConfig = require('./' + taskName).defaultTaskConfig;

      var taskConfig = cookTaskConfig(rawTaskConfig, defaultTaskConfig);

      var rawTask = function(options) {
        if(env.isProduction()) {
          throw new Error('Cannot run the `watch` task in production mode!');
        }

        console.log('Watching ' + JSON.stringify(options.src) + ' to trigger ' + taskName);
        return watch(options.src, { usePolling: true }, function() {
          gulp.start(taskName);
        });
      };

      return cookTask(rawTask, config.root, taskConfig)();
    });

    return merge.apply(merge, watchStreams.filter(nonEmptyFilter));
  };

  gulp.task('watch', ['build:watch'], watchTask);
};
