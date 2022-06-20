import Plugin from './plugin'

export interface Options {
  reportUrl: string
  lazy?: number
  sampleRate?: number // 采样率
  filter?(data: any): boolean
}

const defaultOptions: Options = {
  reportUrl: '/es',
  sampleRate: 100,
}

export default class webEsMonitoring {
  public fn!: Function

  reportUrl: string

  options: Options

  lazy: number

  _plugin: Plugin

  constructor(options: Options) {
    this._plugin = new Plugin()

    this.options = { ...defaultOptions, ...options }
    this.lazy = options.lazy || 2000

    this.reportUrl = options.reportUrl

    // if request error log has "cluster_block_exception read_only_allow_delete"
    // put(options.reportUrl + '/_all/_settings', {
    //   index: {
    //     blocks: {
    //       read_only_allow_delete: 'false'
    //     }
    //   }
    // })
  }

  use(func: any, options?: any) {
    this._plugin.install(func, this, { ...this.options, ...options })
  }

  report(result: any) {
    this._plugin.report.call(this._plugin, result)
  }

  /**
   * 延迟提交 report
   * @param result
   */
  reportLazy(result: any) {
    this._plugin.reportLazy.call(this._plugin, result)
  }
}
