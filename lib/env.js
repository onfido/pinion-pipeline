'use strict';

module.exports = {
  isProduction: function() {
    return process.env.NODE_ENV === 'production';
  },

  isDevelopment: function() {
    return !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
  },

  isTest: function() {
    return process.env.NODE_ENV === 'test';
  }
};
