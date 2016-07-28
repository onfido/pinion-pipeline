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
      'css',
      {
        configName: 'js',
        default: 'webpack',
        watch: 'webpack:watch'
      }
  ];

  var applyUnboundVariant = function(variant, task) {
    return (task && task[variant || 'default']) || task;
  };

  var matchFilter = function(task) {
    return config.tasks[(task && task.configName) || task];
  };

  var buildDefaultTask = function(variant) {
    var applyVariant = applyUnboundVariant.bind(this, variant);

    return function(cb) {
      gulpSequence(
        assetTasks.filter(matchFilter).map(applyVariant),
        codeTasks.filter(matchFilter).map(applyVariant),
        cb
      );
    };
  };

  gulp.task('build', buildDefaultTask());
  gulp.task('build:watch', buildDefaultTask('watch'));

  // This is deprecated, but included for backwards compatibility for production pipelines
  gulp.task('buildAllAssets:production', ['build']);
};
