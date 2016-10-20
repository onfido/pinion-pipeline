'use strict';

import gulp from 'gulp';
import path from 'path';
import jeditor from 'gulp-json-editor';

export default (config) =>
  // Update rev manifest to include CDN information
  // This is separate from the `rev` task to stay true to build once, deploy anywhere

  gulp.task('rev-postfix', () => {
    return gulp.src(path.join(config.root.dest, 'rev-manifest.json'))
      .pipe(jeditor(function(json) {
        const completeKey = '__postfixComplete';
        if(json[completeKey]) {
          return json;
        }

        const searchPrefix = '/assets/';
        const cdn = process.env.ASSET_HOST;
        const outputPrefix = (cdn ? cdn : '') + searchPrefix;

        const newJson = {};
        for(let key in newJson) {
          newJson[path.join(searchPrefix, key)] = outputPrefix + json[key];
        }

        newJson[completeKey] = true;

        return newJson;
      }))
      .pipe(gulp.dest(config.root.dest));
  });
