import { EsIndex } from '../enum'
import { formatNum } from '../utils'

function getPerformance(){
  const performance :{[key:string]:any} = {}
  if(window.performance && typeof window.performance.getEntriesByType === 'function') {
    performance.resources = window.performance.getEntriesByType('resource');
    performance.marks = window.performance.getEntriesByType('mark');
    performance.measures = window.performance.getEntriesByType('measure');
    performance.timing = window.performance.getEntriesByType('navigation')[0];
    performance.paint = window.performance.getEntriesByType('paint');
    performance.isSupportRTL2 = true;
  } else {


    const winPerformance = window.performance as any ;
    const webkitGetEntriesByType = winPerformance.webkitGetEntriesByType

    if(window.performance && typeof webkitGetEntriesByType === 'function') {
      performance.resources = webkitGetEntriesByType('resource');
      performance.marks = webkitGetEntriesByType('mark');
      performance.measures = webkitGetEntriesByType('measure');
      performance.timing = webkitGetEntriesByType('navigation')[0];
      performance.paint = webkitGetEntriesByType('paint');
      performance.isSupportRTL2 = true;
    }
  }

  performance.timing = performance.timing || (window.performance && window.performance.timing);
  return performance
}


export default {
  install(options:any){
setTimeout(()=>{
  const performacce=  getPerformance() as any
  const timing  = performacce.timing as PerformanceNavigationTiming

  let stage:any = {

    // 关键性能指标
    fb: timing.responseStart - timing.domainLookupStart, // first byte
    fpt: timing.responseEnd - timing.fetchStart,         // first paint time 白屏
    tti: timing.domInteractive - timing.fetchStart,      // 首次可交互
    ready: timing.domContentLoadedEventEnd - timing.fetchStart,
    load: timing.loadEventStart - timing.fetchStart,
    transferSize:0,
    encodedBodySize:0,
    decodedBodySize:0,
    fp:0,
    fcp:0
  };

// 传输资源大小，用于判断文件是大小是否合适、是否开启了压缩(如 gzip)
  if(timing.transferSize !== undefined) {
    stage.transferSize = timing.transferSize;       // 文档 + 头部信息大小
    stage.encodedBodySize = timing.encodedBodySize; // 压缩文档大小
    stage.decodedBodySize = timing.decodedBodySize; // 解压文档大小
  }

  const [firstPaint, firstContentfulPaint] = performacce.paint;
  if(firstPaint) {
    stage.fp  = firstPaint.startTime;            // first point
    stage.fcp  = firstContentfulPaint.startTime;
  }


  for(let key in stage){
    stage[key] = formatNum(stage[key])
  }


  options.core.report({
    esIndex: EsIndex.Performance,
    createTime: new Date(),
    ...stage,
  })

},2000)
  }
}
