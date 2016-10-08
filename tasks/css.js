'use strict';

import gulp from 'gulp';
import gutil from 'gulp-util';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import handleErrors from '../lib/handleErrors';
import { isProduction } from '../lib/env';
import gulpIf from '../lib/gulpIf';
import debug from '../lib/gulpDebug';
import cookTask from '../lib/cookTask';
import cookTaskConfig from '../lib/cookTaskConfig';

const defaultTaskConfig = {
  src: 'stylesheets',
  dest: '.',
  extensions: ['css', 'scss']
};

export default (config) => {
  const rawTaskConfig = config.tasks.css;
  if(!rawTaskConfig) return;

  const taskConfig = cookTaskConfig(rawTaskConfig, defaultTaskConfig);

  const rawTask = (options) => {
    gutil.log('Compiling SASS from ' + JSON.stringify(options.src));
    const sassConfig = Object.assign({}, options.config.sass);

    // Allow `@import` calls to search the package's node_modules directory
    sassConfig.includePaths = ['node_modules'];

    return gulp.src(options.src)
      .pipe(debug({ title: 'css' }))
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

export { defaultTaskConfig };
