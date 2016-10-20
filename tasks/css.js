'use strict';

import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import handleErrors from '../lib/handleErrors';
import { isProduction } from '../lib/env';
import { gulpIf, gulpDebug } from '../lib/gulpHelpers';
import cookTask from '../lib/cookTask';
import cookTaskConfig from '../lib/cookTaskConfig';
import requireTaskDeps from '../lib/requireTaskDeps';

const taskDeps = {
  sass: 'gulp-sass',
  autoprefixer: 'gulp-autoprefixer',
  cleanCSS: 'gulp-clean-css'
};

export const defaultTaskConfig = {
  src: 'stylesheets',
  dest: '.',
  extensions: ['css', 'scss']
};

export const getTaskDeps = (config) => config.tasks.css && taskDeps;

export default (config) => {
  const rawTaskConfig = config.tasks.css;
  if(!rawTaskConfig) return;

  const taskConfig = cookTaskConfig(rawTaskConfig, defaultTaskConfig);

  const rawTask = (options) => {
    const { sass, autoprefixer, cleanCSS } = requireTaskDeps(taskDeps);

    console.log('Compiling SASS from ' + JSON.stringify(options.src));
    const sassConfig = Object.assign({}, options.config.sass);

    // Allow `@import` calls to search the package's node_modules directory
    sassConfig.includePaths = ['node_modules'];

    return gulp.src(options.src)
      .pipe(gulpDebug({ title: 'css' }))
      .pipe(gulpIf(!isProduction(), sourcemaps.init()))
      .pipe(sass(sassConfig))
      .on('error', handleErrors)
      .pipe(autoprefixer(options.config.autoprefixer))
      .pipe(gulpIf(isProduction(), cleanCSS()))
      .pipe(gulpIf(!isProduction(), sourcemaps.write()))
      .pipe(gulp.dest(options.dest));
  };

  gulp.task('css', cookTask(rawTask, config.root, taskConfig));
};
