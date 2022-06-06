import { Queue } from './src/utils/qunue'
import Plugin from './plugin'
import { get } from './src/http'

declare interface Config {
  reportUrl: string
  lazy?: number
}

export default class webEsMonitoring {
  public fn!: Function
  queue: Queue
  reportUrl: string
  config: Config
  lazy: number

  _plugin: Plugin;
  constructor(config: Config) {
    this._plugin = new Plugin()

    this.config = config
    this.lazy = config.lazy || 2000
    this.queue = new Queue()

    this.reportUrl = config.reportUrl

    // if request error log has "cluster_block_exception read_only_allow_delete"
    // put(config.reportUrl + '/_all/_settings', {
    //   index: {
    //     blocks: {
    //       read_only_allow_delete: 'false'
    //     }
    //   }
    // })

    // test
    setTimeout(() => {
      get('https://api.github.com/users/defunkt', {})
    }, 2000);
  }

  use(func: any, options?: any) {
    this._plugin.install(func, { ...this.config, ...options,core:this,plugin:this._plugin })
  }

  report(result: any) {
    console.log(this)
    this._plugin.report.call(this._plugin, result)
  }


}


