'use strict';

var path = require('path');

module.exports = function() {
  var joinedPath = path.join.apply(path.join, arguments);
  var invPath = joinedPath.split('!');

  return (invPath.length > 1 ? '!' : '') + invPath.join('');
};
