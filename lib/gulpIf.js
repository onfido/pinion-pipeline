'use strict';

import gutil from 'gulp-util';

export default (b, pipeTarget) =>  b ? pipeTarget : gutil.noop();
