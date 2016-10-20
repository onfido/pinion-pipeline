'use strict';

import changed from 'gulp-changed';
import gulp from 'gulp';
import { gulpDebug } from '../lib/gulpHelpers';
import cookTask from '../lib/cookTask';
import cookTaskConfig from '../lib/cookTaskConfig';

export const defaultTaskConfig = {
  src: 'resources',
  dest: '.'
};

export default (config) => {
  const rawTaskConfig = config.tasks.resources;
  if(!rawTaskConfig) return;

  const taskConfig = cookTaskConfig(rawTaskConfig, defaultTaskConfig);

  const rawTask = (options) => {
    console.log('Building resources from ' + JSON.stringify(options.src));

    return gulp.src(options.src)
      .pipe(gulpDebug({ title: 'resources' }))
      .pipe(changed(options.dest)) // Ignore unchanged files
      .pipe(gulp.dest(options.dest));
  };

  gulp.task('resources', cookTask(rawTask, config.root, taskConfig));
};
