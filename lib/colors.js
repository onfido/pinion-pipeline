'use strict';

import { isProduction } from './env';

const termSeq = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m'
};

export const red = (text) =>
  isProduction() ? text : termSeq.red + text + termSeq.reset;

export const green = (text) =>
  isProduction() ? text : termSeq.green + text + termSeq.reset;

export const magenta = (text) =>
  isProduction() ? text : termSeq.magenta + text + termSeq.reset;