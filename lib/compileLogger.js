'use strict';

import gutil from 'gulp-util';
import prettifyTime from './prettifyTime';
import handleErrors from'./handleErrors';

export default (err, stats) => {
  if(err) {
    throw new gutil.PluginError('webpack', err);
  }

  var statColor = stats.compilation.warnings.length < 1 ? 'green' : 'yellow';

  if(stats.compilation.errors.length > 0) {
    stats.compilation.errors.forEach(function(error) {
      handleErrors(error);
      statColor = 'red';
    });
  }
  else {
    var webpack = gutil.colors.cyan('webpack');
    var compileTime = gutil.colors.magenta(
      prettifyTime(stats.endTime - stats.startTime)
    );

    gutil.log(gutil.colors[statColor](stats));
    gutil.log('Compiled with', webpack, 'in', compileTime);
  }
};
