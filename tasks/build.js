'use strict';

import gulp from 'gulp';
import gulpSequence from 'gulp-sequence';

export default (config) => {
  // Grouped by what can run in parallel
  const assetTasks = [
    'fonts',
    'images',
    'svgSprite',
    'resources'
  ];
  const codeTasks = [
    'css',
    {
      configName: 'js',
      default: 'webpack',
      watch: 'webpack:watch'
    }
  ];

  const applyUnboundVariant = (variant, task) =>
    (task && task[variant || 'default']) || task;

  const matchFilter = (task) =>
    config.tasks[(task && task.configName) || task];

  const nonEmptyFilter = (x) => x && !(Array.isArray(x) && x.length === 0);

  const buildDefaultTask = (variant) => {
    const applyVariant = (task) => applyUnboundVariant(variant, task);

    return (cb) => {
      const sequence = [
        assetTasks.filter(matchFilter).map(applyVariant),
        codeTasks.filter(matchFilter).map(applyVariant),
        cb
      ].filter(nonEmptyFilter);

      gulpSequence(...sequence);
    };
  };

  gulp.task('build', buildDefaultTask());
  gulp.task('build:watch', buildDefaultTask('watch'));

  // This is deprecated, but included for backwards compatibility for production pipelines
  gulp.task('buildAllAssets:production', ['build']);
};
