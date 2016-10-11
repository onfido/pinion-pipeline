'use strict';

import changed from 'gulp-changed';
import gulp from 'gulp';
import gutil from 'gulp-util';
import { isProduction } from '../lib/env';
import gulpIf from '../lib/gulpIf';
import debug from '../lib/gulpDebug';
import cookTask from '../lib/cookTask';
import cookTaskConfig from '../lib/cookTaskConfig';
import requireTaskDeps from '../lib/requireTaskDeps';

const taskDeps = {
  imagemin: 'gulp-imagemin'
};

export const defaultTaskConfig = {
  src: 'images',
  dest: '.',
  npm: true
};

export const getTaskDeps = () => taskDeps;

export default (config) => {
  const rawTaskConfig = config.tasks.images;
  if(!rawTaskConfig) return;

  const taskConfig = cookTaskConfig(rawTaskConfig, defaultTaskConfig);
  const { imagemin } = requireTaskDeps(taskDeps);

  const rawTask = (options) => {
    gutil.log('Building images from ' + JSON.stringify(options.src));

    return gulp.src(options.src)
      .pipe(debug({ title: 'images' }))
      .pipe(changed(options.dest)) // Ignore unchanged files
      .pipe(gulpIf(isProduction(), imagemin())) // Optimize
      .pipe(gulp.dest(options.dest));
  };

  gulp.task('images', cookTask(rawTask, config.root, taskConfig));
};
