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
  constructor(config: Config) {
    this.config = config
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

    }, config.lazy || 3000)

    // test
    setTimeout(() => {
      post('http://localhost:8080/test',{})
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
      if (result.esIndex) {
        await post(this.reportUrl + '/' + result.esIndex + '/_doc/', result).catch(
          error => {
            console.error('request', error)
          }
        )
      }

      // await get(this.reportUrl + '/_cat/indices?v', result)

      this.queue.dequeue()

      await setTimeout(async () => {
        await this.submit()
      }, 1000)
    }
    return Promise.resolve()
  }
}

export { resourceLoad, apiRequest }
