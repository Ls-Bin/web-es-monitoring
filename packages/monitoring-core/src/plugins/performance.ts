import { EsIndex } from '../enum'
import { formatNum, checkSampling, baseInfo } from '../utils'
import webEsMonitoring, { Options } from '../../index'

function getPerformance() {
  const performance: { [key: string]: any } = {}
  if (window.performance && typeof window.performance.getEntriesByType === 'function') {
    performance.resources = window.performance.getEntriesByType('resource');
    performance.marks = window.performance.getEntriesByType('mark');
    performance.measures = window.performance.getEntriesByType('measure');
    performance.timing = window.performance.getEntriesByType('navigation')[0];
    performance.paint = window.performance.getEntriesByType('paint');
    performance.isSupportRTL2 = true;
  } else {


    const winPerformance = window.performance as any;
    const webkitGetEntriesByType = winPerformance.webkitGetEntriesByType

    if (window.performance && typeof webkitGetEntriesByType === 'function') {
      performance.resources = webkitGetEntriesByType('resource');
      performance.marks = webkitGetEntriesByType('mark');
      performance.measures = webkitGetEntriesByType('measure');
      performance.timing = webkitGetEntriesByType('navigation')[0];
      performance.paint = webkitGetEntriesByType('paint');
      performance.isSupportRTL2 = true;
    }
  }

  performance.timing = performance.timing || (window.performance && window.performance.timing);


  const timing = performance.timing as PerformanceNavigationTiming

  let stage: any = {

    // 关键性能指标
    fb: timing.responseStart - timing.domainLookupStart, // first byte
    fpt: timing.responseEnd - timing.fetchStart,         // first paint time 白屏
    tti: timing.domInteractive - timing.fetchStart,      // 首次可交互
    ready: timing.domContentLoadedEventEnd - timing.fetchStart,
    load: timing.loadEventStart - timing.fetchStart,
    transferSize: 0,
    encodedBodySize: 0,
    decodedBodySize: 0,
    fp: 0,
    fcp: 0
  };

  // 传输资源大小，用于判断文件是大小是否合适、是否开启了压缩(如 gzip)
  if (timing.transferSize !== undefined) {
    stage.transferSize = timing.transferSize;       // 文档 + 头部信息大小
    stage.encodedBodySize = timing.encodedBodySize; // 压缩文档大小
    stage.decodedBodySize = timing.decodedBodySize; // 解压文档大小
  }

  const [firstPaint, firstContentfulPaint] = performance.paint;
  if (firstPaint) {
    stage.fp = firstPaint.startTime;            // first point
    stage.fcp = firstContentfulPaint.startTime;
  }


  for (let key in stage) {
    stage[key] = formatNum(stage[key])
  }


  return stage
}


export default {
  install(core: webEsMonitoring, options: Options) {
    let isCanReport = checkSampling(options.sampleRate)
    if (!isCanReport) return

    if ('performance' in window) {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((entries) => {
          const _performance = getPerformance() as any
          const reportData = Object.assign({}, baseInfo(), {
            _esIndex: EsIndex.Performance,
            createTime: new Date(),
            ..._performance,
          })

          if (options.filter) isCanReport = options.filter(reportData);

          if (isCanReport) {
            core.report(reportData)
          }
        })

        observer.observe({ entryTypes: ['paint', 'navigation'] })

      } else {
        // todo
      }
    }



  }
}
