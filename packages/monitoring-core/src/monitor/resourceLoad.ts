import { EsIndex } from './../enum';
interface PluginConfig {
  report: Function
}

interface Pf extends PerformanceEntry {
  transferSize?: number
  initiatorType?: string
  nextHopProtocol?: string
}

export class resourceLoad {
  public lazy: number

  constructor({ report }: PluginConfig) {
    this.lazy = 1000

    const resourceType = ['script', 'css', 'video', 'audio', 'img', 'image']

    setTimeout(() => {
      const resource = performance.getEntriesByType('resource')
      report({
        esIndex: EsIndex.ResourceLoad,
        createTime: new Date(),
        data: resource
          .filter((d: Pf) => resourceType.includes(d.initiatorType || ''))
          .map((item: Pf) => {
            const url = item.name
            return {
              fileName: url.substring(url.lastIndexOf('/') + 1),
              // 资源的名称
              name: url,
              // 资源加载耗时
              duration: Math.floor(item.duration) ,
              // // 资源大小
              transferSize: item.transferSize,
              // // 资源所用协议
              // protocol: item.nextHopProtocol,
              initiatorType: item.initiatorType,
              nextHopProtocol: item.nextHopProtocol
            }
          })
      })
    }, this.lazy)
  }
}
