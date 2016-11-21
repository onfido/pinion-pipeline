'use strict';

var gulp = require('gulp');
var path = require('path');
var jeditor = require('gulp-json-editor');
var replace = require('gulp-replace');
var debug = require('../lib/gulpDebug');

module.exports = function(config) {
  // Update rev manifest to include CDN information
  // This is separate from the `rev` task to stay true to build once, deploy anywhere

  var searchPrefix = '/assets/';
  var cdn = process.env.ASSET_HOST;
  var outputPrefix = (cdn ? cdn : '') + searchPrefix;

  gulp.task('rev-postfix-assets', function() {
    var searchRegex = new RegExp(
      '([\'"])' + searchPrefix + '(?=[^\\s\'"]+[\\?\'"])',
      'g'
    );

    return gulp.src(path.join(config.root.dest, '**/*.{css,js}'))
      .pipe(debug({ title: 'rev-postfix-assets' }))
      .pipe(replace(searchRegex, '$1' + outputPrefix))
      .pipe(gulp.dest(config.root.dest));
  });

  gulp.task('rev-postfix-manifest', function() {
    return gulp.src(path.join(config.root.dest, 'rev-manifest.json'))
      .pipe(jeditor(function(json) {
        var completeKey = '__postfixComplete';
        if(json[completeKey]) {
          return json;
        }

        var newJson = {};
        Object.keys(json).forEach(function(key) {
          newJson[path.join(searchPrefix, key)] = outputPrefix + json[key];
        });

        newJson[completeKey] = true;

        return newJson;
      }))
      .pipe(gulp.dest(config.root.dest));
  });

  gulp.task('rev-postfix', ['rev-postfix-assets', 'rev-postfix-manifest']);
};
