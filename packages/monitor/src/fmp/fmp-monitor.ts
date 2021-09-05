/**
 * File: fmp-monitor.ts
 * Description: 首次有意义渲染条件监控
 * Created: 2021-09-04 18:20:13
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { FmpMonitorOptions } from './types';
import { observeMutation } from '../utils/observe-mutation';

export const createFirstMeaningfulPaintMonitor = (options: FmpMonitorOptions) => {

  const opts: MutationObserverInit = {
    subtree: true,
    childList: true,
  };

  const { destroy } = observeMutation(document, opts, (mutations) => {
    console.log(mutations);
  });


  return {
    destroy: destroy,
  };
};
