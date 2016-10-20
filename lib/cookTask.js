'use strict';

import path from 'path';
import merge from 'merge-stream';
import ensureArray from './ensureArray';

const cookSubTaskConfig = (config) => {
  config = Object.assign({}, config);

  if(!config.fileGlob && config.extensions) {
    const useBrackets = config.extensions.length > 1;

    config.fileGlob = '**/*.' +
      (useBrackets ? '{' : '') +
      config.extensions.join(',') +
      (useBrackets ? '}' : '');
  }

  return config;
};

const getFullSrc = (config, rootConfig) => {
  const baseSrcList = ensureArray(config.src).map((baseSrc) =>
    path.join(baseSrc, config.fileGlob || '**')
  );

  if(config.ignore) {
    baseSrcList.push('!' + config.ignore);
  }

  const srcVariants = baseSrcList.map((baseSrc) => {
    // The order of these variants denotes priority. Sooner is higher priority
    const variants = [path.join(rootConfig.src, baseSrc)];

    if(config.npm) {
      variants.push(path.join(process.cwd(), 'node_modules', baseSrc));
    }

    return variants;
  });

  // Turn our variants list (array of arrays) into a src list (flat array)
  const srcList = srcVariants.reduce(
    (soFar, remaining) => soFar.concat(remaining),
    []
  );

  return srcList;
};

const getOptionsList = (rootConfig, taskConfig) => {
  return taskConfig.taskArray.map((subTask) => {
    const subTaskConfig = Object.assign(
      {},
      cookSubTaskConfig(taskConfig),
      cookSubTaskConfig(subTask)
    );

    const src = getFullSrc(subTaskConfig, rootConfig);

    return {
      src: src,
      dest: path.join(rootConfig.dest, subTaskConfig.dest),
      config: subTaskConfig
    };
  });
};

export default (rawTask, rootConfig, taskConfig) => {
  const optionsList = getOptionsList(rootConfig, taskConfig);

  const cookedTask = () => {
    const streams = optionsList.map(rawTask);

    return merge(...streams);
  };

  return cookedTask;
};
