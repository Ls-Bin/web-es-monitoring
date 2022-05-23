interface PluginConfig {
  done: Function
}

interface Pf extends PerformanceEntry {
  transferSize?: number
  initiatorType?: string
  nextHopProtocol?: string
}

export class resourceLoad {
  public lazy: number

  constructor({ done }: PluginConfig) {
    this.lazy = 1000

    const resourceType = ['script', 'css', 'video', 'audio', 'img', 'image']

    setTimeout(() => {
      const resource = performance.getEntriesByType('resource')
      console.log('resourceLoad', resource)

      done({
        esIndex: 'web_resource_load',
        data: resource
          .filter((d: Pf) => resourceType.includes(d.initiatorType || ''))
          .map((item: Pf) => ({
            // 资源的名称
            name: item.name,
            // 资源加载耗时
            duration: item.duration.toFixed(2),
            // // 资源大小
            transferSize: item.transferSize,
            // // 资源所用协议
            // protocol: item.nextHopProtocol,
            initiatorType: item.initiatorType,
            nextHopProtocol: item.nextHopProtocol
          }))
      })
    }, this.lazy)
  }
}
