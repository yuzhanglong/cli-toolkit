import { getPerformance, getPerformanceObserver, getXMLHttpRequest } from '../utils/browser-interfaces';
import { getPerformanceEntriesByName } from '../utils/get-performance-entries-by-name';
import { EventType } from '../types';
import { createScheduler } from '../utils/create-scheduler';
import { calculateTTI } from '../utils/calculate-tti';
import { TaskTimeInfo, TTIMonitorOptions } from './types';
import { computeLastKnownNetwork2Busy } from '../utils/compute-last-known-network-2-busy';
import { observeIncomingRequests } from '../utils/observe-incoming-requests';
import { observeLongTaskAndResources } from '../utils/observe-long-task-and-resources';

const TIME_GAP = 5000;

/**
 * 上报 tti
 *
 * @author yuzhanglong
 * @date 2021-09-06 17:56:44
 * @param options 选项
 * @param lastKnownNetwork2Busy
 * @param longTasks
 */
const checkAndReportTTI = (
  options: TTIMonitorOptions,
  lastKnownNetwork2Busy: number,
  longTasks: { startTime: number; endTime: number }[],
) => {
  const fcp = getPerformanceEntriesByName('first-contentful-paint')[0];
  const searchStartTime = fcp ? fcp.startTime : 0;


  const tti = calculateTTI({
    searchStart: searchStartTime,
    checkTimeInQuiteWindow: performance.now(),
    longTasks: longTasks,
    lastKnownNetwork2Busy: lastKnownNetwork2Busy,
  });

  console.log('tti:', tti);

  options.onReport({
    eventType: EventType.TTI,
    data: {
      tti: tti,
    },
  });
};

export const createTtiMonitor = (options: TTIMonitorOptions) => {
  const XMLHttpRequest = getXMLHttpRequest();
  const performanceObserver = getPerformanceObserver();
  const performance = getPerformance();

  if (!XMLHttpRequest || !performanceObserver || !performance) {
    return;
  }

  const longTasks: TaskTimeInfo[] = [];
  const networkRequests: TaskTimeInfo[] = [];

  const ttiCalculatorScheduler = createScheduler();
  const { getIncomingRequestsTimes } = observeIncomingRequests();

  const getLastKnownNetworkBusy = () => {
    return computeLastKnownNetwork2Busy(getIncomingRequestsTimes(), networkRequests);
  };


  // 监听 long task 和 network resource
  observeLongTaskAndResources(
    (timeInfo) => {
      longTasks.push(timeInfo);
      ttiCalculatorScheduler.resetScheduler(timeInfo.endTime + TIME_GAP);
    },
    (timeInfo) => {
      networkRequests.push(timeInfo);
      ttiCalculatorScheduler.resetScheduler(getLastKnownNetworkBusy() + TIME_GAP);
    },
  );

  const checkAndReport = () => {
    checkAndReportTTI(
      options,
      getLastKnownNetworkBusy(),
      longTasks,
    );
  };

  ttiCalculatorScheduler.startSchedule(checkAndReport, performance.now() + TIME_GAP);
};