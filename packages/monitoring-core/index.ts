import { EsIndex } from './src/enum';
import { apiRequest } from './src/monitor/apiRequest';
import { resourceLoad } from './src/monitor/resourceLoad'
import { Queue } from './src/utils/qunue'
import { get, post, put } from './src/http/index'
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
  constructor(config: Config) {
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

    setInterval(() => {
      this.submit()

    }, this.lazy)

    // test
    setTimeout(() => {
      post('http://localhost:8080/test', {})
    }, 2000);
  }

  use(func: any) {
    new func({
      ...this.config,
      report: this.report.bind(this)
    })
  }

  report(result: any) {
    this.queue.enqueue(result)


  }

  async submit() {
    if (this.queue.size()) {
      const result = this.queue.front()
      this.queue.dequeue()
      if (result.esIndex) {
        await post(this.reportUrl + '/' + result.esIndex + '/_doc/', result).catch(
          async error => {
            if (!result.errorCount || result.errorCount < 3) {
              this.report({ ...result, errorCount: (result.errorCount || 0) + 1 })
            }
            console.error('request', error)
          }
        )
      }
    }
    return Promise.resolve()
  }
}

export { resourceLoad, apiRequest }
