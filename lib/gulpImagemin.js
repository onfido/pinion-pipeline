'use strict';

import semver from 'semver';
import gutil from 'gulp-util';
import imageminPackage from 'gulp-imagemin/package.json';

// This file is needed to ensure compatibility for older Node versions (<4)
export default () => {
  const nodeVersionIsSufficient = semver.satisfies(
    process.version,
    imageminPackage.engines.node
  );

  if(nodeVersionIsSufficient) {
    const imagemin = require('gulp-imagemin');
    return imagemin();
  }
  else {
    gutil.log(
      gutil.colors.red('WARNING!'),
      'Your node version',
      gutil.colors.bold(process.version),
      'is insufficient for the imagemin package, which requires',
      gutil.colors.bold(imageminPackage.engines.node),
      ' - this step will be skipped'
    );

    return gutil.noop();
  }
};
