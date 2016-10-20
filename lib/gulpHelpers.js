'use strict';

import debug from 'gulp-debug';
import through from 'through';
import { isProduction } from './env';

export const gulpDebug = (debugOptions) =>
  isProduction() ? through() : debug(debugOptions);

export const gulpIf = (b, pipeTarget) =>  b ? pipeTarget : through();
