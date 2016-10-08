'use strict';

import changed from 'gulp-changed';
import gulp from 'gulp';
import gutil from 'gulp-util';
import debug from '../lib/gulpDebug';
import cookTask from '../lib/cookTask';
import cookTaskConfig from '../lib/cookTaskConfig';

const defaultTaskConfig = {
  src: 'resources',
  dest: '.'
};

export default (config) => {
  const rawTaskConfig = config.tasks.resources;
  if(!rawTaskConfig) return;

  const taskConfig = cookTaskConfig(rawTaskConfig, defaultTaskConfig);

  const rawTask = (options) => {
    gutil.log('Building resources from ' + JSON.stringify(options.src));

    return gulp.src(options.src)
      .pipe(debug({ title: 'resources' }))
      .pipe(changed(options.dest)) // Ignore unchanged files
      .pipe(gulp.dest(options.dest));
  };

  gulp.task('resources', cookTask(rawTask, config.root, taskConfig));
};

export { defaultTaskConfig };
