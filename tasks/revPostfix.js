'use strict';

var gulp = require('gulp');
var path = require('path');
var jeditor = require('gulp-json-editor');

module.exports = function(config) {
  // Update rev manifest to include CDN information
  // This is separate from the `rev` task to stay true to build once, deploy anywhere

  gulp.task('rev-postfix', function() {
    return gulp.src(path.join(config.root.dest, 'rev-manifest.json'))
      .pipe(jeditor(function(json) {
        var completeKey = '__postfixComplete';
        if(json[completeKey]) {
          return json;
        }

        var searchPrefix = '/assets/';
        var cdn = process.env.ASSET_HOST;
        var outputPrefix = (cdn ? cdn : '') + searchPrefix;

        var newJson = {};
        Object.keys(json).forEach(function(key) {
          newJson[path.join(searchPrefix, key)] = outputPrefix + json[key];
        });

        newJson[completeKey] = true;

        return newJson;
      }))
      .pipe(gulp.dest(config.root.dest));
  });
};
