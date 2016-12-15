'use strict';

var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');

module.exports = function(config) {
  // Grouped by what can run in parallel
  var assetTasks = [
    'fonts',
    'images',
    'svgSprite',
    'resources'
  ];
  var codeTasks = [
    {
      configName: /(css|js)/,
      default: 'webpack',
      watch: 'webpack:watch'
    }
  ];

  var applyUnboundVariant = function(variant, task) {
    return (task && task[variant || 'default']) || task;
  };

  var matchFilter = function(task) {
    var configNameMatcher = new RegExp((task && task.configName) || task);
    var matches = Object.keys(config.tasks).filter(function(configName) {
      return configNameMatcher.exec(configName);
    });

    return matches[0];
  };

  var duplicateFilter = function(task, i, taskArray) {
    return taskArray.indexOf(task) === i;
  };

  var nonEmptyFilter = function(x) {
    return x && !(Array.isArray(x) && x.length === 0);
  };

  var buildDefaultTask = function(variant) {
    var applyVariant = applyUnboundVariant.bind(this, variant);

    return function(cb) {
      var sequence = [
        assetTasks.filter(matchFilter).filter(duplicateFilter).map(applyVariant),
        codeTasks.filter(matchFilter).filter(duplicateFilter).map(applyVariant),
        cb
      ].filter(nonEmptyFilter);

      gulpSequence.apply(gulpSequence, sequence);
    };
  };

  gulp.task('build', buildDefaultTask());
  gulp.task('build:watch', buildDefaultTask('watch'));

  // This is deprecated, but included for backwards compatibility for production pipelines
  gulp.task('buildAllAssets:production', ['build']);
};
