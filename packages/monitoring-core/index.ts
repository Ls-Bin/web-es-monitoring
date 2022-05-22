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
    console.log('queue-size', this.queue.size(), this.queue.front())

    console.log('done:result', result)
  }

  async submit() {
    if (this.queue.size()) {
      const result = this.queue.front()

      result.esIndex && (await put(this.url + '/' + result.esIndex, result))
      await get(this.url + '/_cat/indices?v', result)

      this.queue.dequeue()

      await this.submit()
    }
    return Promise.resolve()
  }
}

export { resourceLoad }
