import { isFunction, isObject } from 'lodash';

export const getBrowserWindow = () => {
  if (isObject(window)) {
    return window;
  }
  return null;
};

export const getPerformance = () => {
  if (getBrowserWindow() && isObject(window.performance)) {
    return window.performance;
  }
  return null;
};

export const getPerformanceObserver = () => {
  if (getBrowserWindow() && isFunction(window.PerformanceObserver)) {
    return window.PerformanceObserver;
  }
  return null;
};

export const getMutationObserver = () => {
  if (getBrowserWindow() && isFunction(window.MutationObserver)) {
    return window.MutationObserver;
  }
  return null;
};
