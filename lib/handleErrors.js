'use strict';

import { isDevelopment } from './env';
import notify from 'gulp-notify';

export default function(err) {
  if(isDevelopment()) {
    notify.onError(err.name + '\n' + err.error).apply(this, arguments);
  }
}
