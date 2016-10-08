'use strict';

import gutil from 'gulp-util';
import debug from 'gulp-debug';
import { isProduction } from './env';

export default (debugOptions) =>
  isProduction() ? gutil.noop() : debug(debugOptions);
