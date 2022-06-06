
import {  post } from '../http/index'

export default {
  install(options: any) {
    const report = (_opt: any) => {
      return async (result: any) => {
        await post(_opt.reportUrl + '/' + result.esIndex + '/_doc/', result).catch(
          async error => {
            if (!result.errorCount || result.errorCount < 3) {
              await setTimeout(async () => {
                await options.core.report({ ...result, errorCount: (result.errorCount || 0) + 1 })
              }, 2000);
            }
          }
        )
      }
    }

    options.plugin.register('report', report(options))

    // this.prototype.report = report(options)
    // core.prototype.onReport = async function () {
    //   if (this.queue.size()) {
    //     const result = this.queue.front()
    //     this.queue.dequeue()
    //     if (result.esIndex) {
    //       await report(result)
    //     }
    //   }
    //   return Promise.resolve()
    // }
  },
} as any
