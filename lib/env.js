'use strict';

export function isProduction() {
  return process.env.NODE_ENV === 'production';
}

export function isDevelopment() {
  return !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
}

export function isTest() {
  return process.env.NODE_ENV === 'test';
}
