import { post } from '../http/index'

// @ts-ignore
import { Browser } from '../utils/browser'
import webEsMonitoring, { Options } from '../../index'


export default {
  install(core: webEsMonitoring, options: Options) {
    //FIXME:需要用队列来优化请求，10秒批量上传或者链式1秒调用一个请求
    const report = (_opt: any) => {
      return async (result: any) => {

        const _esIndex = result._esIndex
        delete result._esIndex

        const _params = Object.assign({},  result)

        await post(_opt.reportUrl + '/' + _esIndex + '/_doc/', _params).catch(
          async error => {
            if (!result.errorCount || result.errorCount < 3) {
              setTimeout(async () => {
                await core.report({
                  ...result,
                  errorCount: (result.errorCount || 0) + 1
                })
              }, 2000)
            }
          }
        )
      }
    }

    core._plugin.register('report', report(options))

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
  }
} as any
