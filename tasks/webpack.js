'use strict';

import gulp from 'gulp';
import gutil from 'gulp-util';
import { isDevelopment, isProduction } from '../lib/env';
import logger from '../lib/compileLogger';
import cookTask from '../lib/cookTask';
import cookTaskConfig from '../lib/cookTaskConfig';
import wpBaseConfig, { getTaskDeps as getWpTaskDeps } from '../lib/webpackBaseConfig';
import requireTaskDeps from '../lib/requireTaskDeps';

const taskDeps = {
  webpack: 'webpack',
  PassThrough: 'readable-stream/passthrough'
};

export const defaultTaskConfig = {
  src: 'javascripts',
  dest: '.',
  extensions: ['js']
};

export const getTaskDeps = (config) => {
  const rawTaskConfig = config.tasks.js;
  if(!rawTaskConfig) return;

  return Object.assign({}, taskDeps, getWpTaskDeps(rawTaskConfig));
};

export default (config) => {
  const rawTaskConfig = config.tasks.js;
  if(!rawTaskConfig) return;

  const taskConfig = cookTaskConfig(rawTaskConfig, defaultTaskConfig);
  const deps = requireTaskDeps(getTaskDeps(config));
  const { webpack, PassThrough } = deps;

  const rawTask = (watch) => {
    const wpconfig = wpBaseConfig(deps, taskConfig, config.root);

    if(isDevelopment()) {
      wpconfig.devtool = 'source-map';
      webpack.debug = true;
    }

    if(isProduction()) {
      wpconfig.plugins.push(
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.NoErrorsPlugin()
      );
    }

    const wpStream = new PassThrough();

    let initialCompile = false;
    const onCompile = (err, stats) => {
      logger(err, stats);

      if(!initialCompile) {
        initialCompile = true;
        wpStream.end();
      }
    };

    if(watch) {
      gutil.log('Kicking off webpack in watch-mode');

      const watchOptions = { poll: true };

      webpack(wpconfig).watch(watchOptions, onCompile);
    }
    else {
      gutil.log('Kicking off webpack in build-mode');

      webpack(wpconfig, onCompile);
    }

    return wpStream;
  };

  const cookWebpackTask = (watch) => cookTask(
    () => rawTask(watch),
    config.root,
    taskConfig
  );

  gulp.task('webpack', cookWebpackTask(false));
  gulp.task('webpack:watch', cookWebpackTask(true));
};
