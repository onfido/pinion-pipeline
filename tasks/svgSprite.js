'use strict';

import gulp from 'gulp';
import gutil from 'gulp-util';
import { isProduction } from '../lib/env';
import debug from '../lib/gulpDebug';
import gulpIf from '../lib/gulpIf';
import cookTask from '../lib/cookTask';
import cookTaskConfig from '../lib/cookTaskConfig';
import requireTaskDeps from '../lib/requireTaskDeps';

const taskDeps = {
  svgstore: 'gulp-svgstore',
  imagemin: 'gulp-imagemin'
};

export const defaultTaskConfig = {
  src: 'sprites',
  dest: '.',
  extensions: ['svg']
};

export const getTaskDeps = (config) => config.tasks.svgSprite && taskDeps;

export default (config) => {
  const rawTaskConfig = config.tasks.svgSprite;
  if(!rawTaskConfig) return;

  const taskConfig = cookTaskConfig(rawTaskConfig, defaultTaskConfig);

  const rawTask = (options) => {
    const { svgstore, imagemin } = requireTaskDeps(getTaskDeps());

    gutil.log('Building SVGs from ' + JSON.stringify(options.src));

    return gulp.src(options.src)
      .pipe(debug({ title: 'svg' }))
      .pipe(gulpIf(isProduction(), imagemin()))
      .pipe(svgstore())
      .pipe(gulp.dest(options.dest));
  };

  gulp.task('svgSprite', cookTask(rawTask, config.root, taskConfig));
};
