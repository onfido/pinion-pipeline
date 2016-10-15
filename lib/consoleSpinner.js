'use strict';

export default (speed = 250) => {
  const pattern = ['\\', '|', '/', '-'];
  let i = 0;

  const interval = setInterval(() => {
    process.stdout.write('\r' + pattern[i++]);
    i = i % pattern.length;
  }, speed);

  return {
    stop: () => clearInterval(interval)
  };
};
