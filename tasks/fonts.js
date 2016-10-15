'use strict';

import changed from 'gulp-changed';
import gulp from 'gulp';
import { gulpDebug } from '../lib/gulpHelpers';
import cookTask from '../lib/cookTask';
import cookTaskConfig from '../lib/cookTaskConfig';

export const defaultTaskConfig = {
  src: 'fonts',
  dest: '.'
};

export default (config) => {
  var rawTaskConfig = config.tasks.fonts;
  if(!rawTaskConfig) return;

  const taskConfig = cookTaskConfig(rawTaskConfig, defaultTaskConfig);

  const rawTask = (options) => {
    console.log('Building fonts from ' + JSON.stringify(options.src));

    return gulp.src(options.src)
      .pipe(gulpDebug({ title: 'fonts' }))
      .pipe(changed(options.dest)) // Ignore unchanged files
      .pipe(gulp.dest(options.dest));
  };

  gulp.task('fonts', cookTask(rawTask, config.root, taskConfig));
};
