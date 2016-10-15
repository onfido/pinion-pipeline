'use strict';

import { isProduction } from './env';

const termSeq = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  cyan: '\x1b[35m',
  reset: '\x1b[0m'
};

export const red = (text) =>
  isProduction() ? text : termSeq.red + text + termSeq.reset;

export const green = (text) =>
  isProduction() ? text : termSeq.green + text + termSeq.reset;

export const yellow = (text) =>
  isProduction() ? text : termSeq.yellow + text + termSeq.reset;

export const magenta = (text) =>
  isProduction() ? text : termSeq.magenta + text + termSeq.reset;

export const cyan = (text) =>
  isProduction() ? text : termSeq.cyan + text + termSeq.reset;
