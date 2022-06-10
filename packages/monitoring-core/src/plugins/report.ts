import { post } from '../http/index'
import { Queue } from '../../src/utils/qunue'
// @ts-ignore
import { Browser } from '../utils/browser'
import webEsMonitoring, { Options } from '../../index'

export interface ReportData {
  _esIndex: string
  createTime: Date
  [key: string]: any
}

interface ReportOptions extends Options {
  maxReportCache?: number
}

export default {
  install(core: webEsMonitoring, options: ReportOptions) {
    let reportPool: any[] = []
    // 最大缓存 report 数量
    let maxReportCache = options.maxReportCache || 3

    /**
     * elasticsearch _bulk 合并发送请求 格式参考：https://www.elastic.co/guide/cn/elasticsearch/guide/current/bulk.html
     * @param reportDataArray report数组
     */
    async function bulkRequest(reportDataArray: ReportData[]) {
      const esBlukDatas: string[] = []
      for (let item of reportDataArray) {
        esBlukDatas.push(JSON.stringify({ create: { _index: item._esIndex } }))
        esBlukDatas.push(
          JSON.stringify(Object.assign({}, item, { _esIndex: undefined }))
        )
      }
      await post(options.reportUrl + '/_bulk/', esBlukDatas.join('\n') + '\n')
    }

    /**
     * 添加到报告池
     */
    function reportLazy(reportData: ReportData) {
      reportPool.push(reportData)

      if (reportPool.length >= maxReportCache) {
        bulkRequest(reportPool.slice(0, maxReportCache))
        reportPool.splice(0, maxReportCache)
      }
    }

    const report = (_opt: any) => {
      const queue = new Queue()
      let timeout: any = null

      function doIntervalRequest() {
        if (!queue.size()) {
          return
        }

        const result = queue.front()
        const _esIndex = result._esIndex
        const _params = Object.assign({}, result, { _esIndex: undefined })

        post(
          _opt.reportUrl + '/' + _esIndex + '/_doc/',
          JSON.stringify(_params)
        )
          .then(res => {})
          .catch(async error => {
            if (!result.errorCount || result.errorCount < 3) {
              setTimeout(async () => {
                await core.report(
                  JSON.stringify({
                    ...result,
                    errorCount: (result.errorCount || 0) + 1
                  })
                )
              }, 2000)
            }
          })

        return setTimeout(() => {
          queue.dequeue()
          if (queue.size()) {
            clearInterval(timeout)
            timeout = doIntervalRequest()
          }else {
            timeout=null
          }
        }, 1000)
      }

      return async (result: ReportData) => {
        queue.enqueue(result)
        if (!timeout) timeout = doIntervalRequest()
      }
    }

    core._plugin.register('report', report(options))
    core._plugin.register('reportLazy', reportLazy)
  }
} as any
