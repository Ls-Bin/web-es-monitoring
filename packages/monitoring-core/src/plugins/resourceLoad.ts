import { EsIndex } from './../enum';
import webEsMonitoring, { Options } from '../index'
import { baseInfo, checkSampling as checkSampling, formatDate } from '../utils'

interface Pf extends PerformanceEntry {
  transferSize?: number
  initiatorType?: string
  nextHopProtocol?: string
}


export default {
  lazy: 2000,
  install(core: webEsMonitoring, options: Options) {
    let isCanReport = checkSampling(options.sampleRate)
    if (!isCanReport) return

    const resourceType = ['script', 'css', 'video', 'audio', 'img', 'image']

    setTimeout(() => {
      const resource = performance.getEntriesByType('resource')

      const reportData = Object.assign({}, baseInfo(), {
        _esIndex: EsIndex.ResourceLoad,
        date: formatDate(),
        resource: resource
          .filter((d: Pf) => resourceType.includes(d.initiatorType || ''))
          .map((item: Pf) => {
            const url = item.name
            return {
              fileName: url.substring(url.lastIndexOf('/') + 1),
              // 资源的名称
              name: url,
              // 资源加载耗时
              duration: Math.floor(item.duration),
              //资源大小
              transferSize: item.transferSize,
              //资源所用协议
              // protocol: item.nextHopProtocol,
              initiatorType: item.initiatorType,
              nextHopProtocol: item.nextHopProtocol
            }
          })
      })


      if (options.filter) isCanReport = options.filter(reportData);

      if (isCanReport) {
        core.reportLazy(reportData)
      }


    }, this.lazy)
  }
}
