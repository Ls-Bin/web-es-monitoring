import { post } from '../http/index'
import { Queue } from '../../src/utils/qunue'
// @ts-ignore
import { Browser } from '../utils/browser'
import webEsMonitoring, { Options } from '../index'
import { imageRequest } from '../http/imgRequest'

export interface ReportData {
  _esIndex: string
  date: Date
  [key: string]: any
}

interface ReportOptions extends Options {
  maxReportCache?: number
}

const initReport = (_opt: any) => {
  const queue = new Queue()
  let timeout: any = null

  function doIntervalRequest() {
    if (!queue.size()) {
      return
    }

    const result = queue.front()
    const { _esIndex } = result
    const _params = { ...result, _esIndex: undefined }

    imageRequest(`${_opt.reportUrl}/${_esIndex}/_doc/`, _params)

    // post(
    //   _opt.reportUrl + '/' + _esIndex + '/_doc/',
    //   JSON.stringify(_params)
    // )
    //   .then(res => {})
    //   .catch(async error => {
    //     if (!result.errorCount || result.errorCount < 3) {
    //       setTimeout(async () => {
    //         await core.report(
    //           JSON.stringify({
    //             ...result,
    //             errorCount: (result.errorCount || 0) + 1
    //           })
    //         )
    //       }, 3000)
    //     }
    //   })

    return setTimeout(() => {
      queue.dequeue()
      if (queue.size()) {
        clearInterval(timeout)
        timeout = doIntervalRequest()
      } else {
        timeout = null
      }
    }, 1000)
  }

  return async (result: ReportData) => {
    queue.enqueue(result)
    if (!timeout) timeout = doIntervalRequest()
  }
}

/**
 * elasticsearch _bulk 合并发送请求 格式参考：https://www.elastic.co/guide/cn/elasticsearch/guide/current/bulk.html
 * @param reportDataArray report数组
 */
async function bulkRequest(reportDataArray: ReportData[], options: ReportOptions) {
  if (!reportDataArray.length) return

  const esBlukDatas: string[] = []
  for (const item of reportDataArray) {
    esBlukDatas.push(JSON.stringify({ create: { _index: item._esIndex } }))
    esBlukDatas.push(JSON.stringify({ ...item, _esIndex: undefined }))
  }

  const reportDataStr = `${esBlukDatas.join('\n')}\n`
  if (navigator.sendBeacon) {
    navigator.sendBeacon(`${options.reportUrl}/_bulk`, reportDataStr)
  } else {
    await post(`${options.reportUrl}/_bulk/`, reportDataStr)
  }
}

export default {
  install(core: webEsMonitoring, options: ReportOptions) {
    let reportPool: any[] = []
    // 最大缓存 report 数量
    const maxReportCache = options.maxReportCache || 3

    /**
     * 添加到报告池
     */
    function reportLazy(reportData: ReportData) {
      reportPool.push(reportData)

      if (reportPool.length >= maxReportCache) {
        bulkRequest(reportPool.slice(0, maxReportCache), options)
        reportPool.splice(0, maxReportCache)
      }
    }

    core._plugin.register('report', initReport(options))
    core._plugin.register('reportLazy', reportLazy)

    // 页面关闭或隐藏时提交所有report
    document.addEventListener('visibilitychange', function logData() {
      if (document.visibilityState === 'hidden') {
        if (reportPool.length) {
          bulkRequest(reportPool, options)
          reportPool = []
        }
      }
    })
    // 兼容safari
    window.addEventListener('pagehide', (event) => {
      if (reportPool.length) {
        bulkRequest(reportPool, options)
        reportPool = []
      }
    })
  },
} as any
