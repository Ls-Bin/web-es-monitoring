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
  url: string
  constructor(config: Config) {
    this.queue = new Queue()

    this.url = config.reportUrl

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
    }, config.lazy || 1000)
  }

  use(func: any) {
    new func({
      done: this.done.bind(this)
    })
  }

  done(result: any) {
    this.queue.enqueue(result)
  }

  async submit() {
    if (this.queue.size()) {
      const result = this.queue.front()
      if (result.esIndex) {
        await post(this.url + '/' + result.esIndex + '/_doc/', result).catch(
          e => {
            console.error('request', e)
          }
        )
      }

      await get(this.url + '/_cat/indices?v', result)

      this.queue.dequeue()

      await setTimeout(async () => {
        await this.submit()
      }, 1000)
    }
    return Promise.resolve()
  }
}

export { resourceLoad }
