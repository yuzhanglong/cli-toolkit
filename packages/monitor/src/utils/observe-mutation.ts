import { noop } from 'lodash';
import { getMutationObserver } from './browser-interfaces';

/**
 * 监视对DOM树所做更改的能力
 *
 * @author yuzhanglong
 * @date 2021-09-05 00:03:39
 * @param target 需要观察变动的节点
 * @param callback 回调函数
 * @param options observe 方法的相关选项
 */
export const observeMutation = (
  target: Node,
  options?: MutationObserverInit,
  callback: (mutations: MutationRecord[]) => void = noop) => {
  const MutationObserver = getMutationObserver();

  let destroy = noop;

  if (MutationObserver) {
    const observer: MutationObserver = new MutationObserver((mutations: MutationRecord[]) => {
      callback(mutations);
    });

    observer.observe(target, options);

    destroy = () => observer.disconnect();
  }


  return {
    destroy: destroy,
  };
};
