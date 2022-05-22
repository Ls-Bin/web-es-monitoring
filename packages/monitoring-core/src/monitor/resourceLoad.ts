interface PluginConfig {
  done: Function
}
export class resourceLoad {
  public lazy: number

  constructor({ done }: PluginConfig) {
    this.lazy = 1000

    setTimeout(() => {
      done({
        esIndex: 'web_resource_load',
        data: performance.getEntriesByType('resource')
      })
    }, this.lazy)
  }
}
