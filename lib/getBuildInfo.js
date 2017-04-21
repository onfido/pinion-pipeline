'use strict';

var git = require('git-rev-sync');

module.exports = function(src) {
  var buildInfo = {
    date: new Date(),
    short: process.env.GIT_SHORT,
    branch: process.env.GIT_BRANCH
  };

  var buildInfoSatisfied = Object.keys(buildInfo).reduce(function(acc, key) {
    return acc && Boolean(buildInfo[key]);
  }, true);

  if(!buildInfoSatisfied) {
    try {
      buildInfo.short = git.short(src);
      buildInfo.branch = git.branch(src);
    }
    catch(e) {
      console.log('No git directory found. Git-specific info being set as undefined');
    }
  }

  return buildInfo;
};
