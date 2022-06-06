
import { post } from '../http/index'
import { baseInfo } from '../utils'

import {Browser} from '../utils/browser' 

const browserInfo = new Browser();

export default {
  install(options: any) {
    const report = (_opt: any) => {
      return async (result: any) => {
        const _esIndex = result._esIndex
        delete result._esIndex
        
        const _params = Object.assign({}, baseInfo(),browserInfo,result)

        await post(_opt.reportUrl + '/' + _esIndex + '/_doc/', _params).catch(
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
    //     if (result._esIndex) {
    //       await report(result)
    //     }
    //   }
    //   return Promise.resolve()
    // }
  },
} as any
