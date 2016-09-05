'use strict';

var changed = require('gulp-changed');
var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');
var merge = require('merge-stream');
var debug = require('../lib/gulpDebug');

module.exports = function(config) {
  var resources = config.tasks.resources;
  if(!resources) return;

  if(!Array.isArray(resources)) {
    resources = [resources];
  }

  var pathsList = resources.map(function(res) {
    return {
      src: path.join(config.root.src, res.src, res.glob || '**'),
      dest: path.join(config.root.dest, res.dest)
    };
  });

  var resourcesTask = function() {
    gutil.log('Building resources from ' + JSON.stringify(pathsList.map(function(paths) {
      return paths.src;
    })));

    var streams = pathsList.map(function(paths) {
      return gulp.src(paths.src)
        .pipe(debug({ title: 'resources' }))
        .pipe(changed(paths.dest)) // Ignore unchanged files
        .pipe(gulp.dest(paths.dest));
    });

    return merge.apply(merge, streams);
  };

  gulp.task('resources', resourcesTask);
};
