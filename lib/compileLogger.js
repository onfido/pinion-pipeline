'use strict';

import prettifyTime from './prettifyTime';
import handleErrors from'./handleErrors';
import * as colors from './colors';

export default (err, stats) => {
  const statColor = stats.compilation.warnings.length < 1 ? 'green' : 'yellow';

  if(stats.compilation.errors.length > 0) {
    stats.compilation.errors.forEach(handleErrors);
  }
  else {
    console.log(colors[statColor](stats));

    console.log(
      `Compiled with ${colors.cyan('webpack')} in`,
      colors.magenta(prettifyTime(stats.endTime - stats.startTime))
    );
  }
};
