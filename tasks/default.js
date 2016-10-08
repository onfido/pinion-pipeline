'use strict';

import gulp from 'gulp';
import gulpSequence from 'gulp-sequence';

export default () => gulp.task('default', gulpSequence('clean', 'watch'));
