import { EsIndex } from '../enum'
import { formatNum, checkSampling, baseInfo, formatDate } from '../utils'
import webEsMonitoring, { Options } from '../../index'

export default {
  install(core: webEsMonitoring, options: Options) {
    let isCanReport = checkSampling(options.sampleRate)
    if (!isCanReport) return

    function _reportGlobalError(event:ErrorEvent){
          const reportData = Object.assign({}, baseInfo(), {
            _esIndex: EsIndex.GlobalError,
            date: formatDate(),
            errorType:'js',
            colno:event.colno,
            lineno:event.lineno,
            message:event.message,
            filename:event.filename,
            stack:event.error.stack,
            timeStamp:formatNum(event.timeStamp)
          })

          if (options.filter) isCanReport = options.filter(reportData);

          if (isCanReport) {
            core.reportLazy(reportData)
          }
    }

    // js error
    window.addEventListener('error', (error: any) => {
      console.error('listener:error', error)
      if (!(error.target instanceof HTMLScriptElement||error.target instanceof HTMLImageElement||error.target instanceof HTMLLinkElement)) {
        _reportGlobalError(error)
      }
    })

    // promise error
    window.addEventListener('unhandledrejection', (error) => {

      let reason = error.reason

      // 过滤report请求错误,阻止递归请求错误
      if(reason.hasOwnProperty('reportError')){
        return
      }

      if(reason.constructor === Object){
        try{
          reason = JSON.stringify(error.reason)
        }catch(e){
          console.error('JSON.stringify:error',e)
        }
      }

      console.error('listener:unhandledrejection', error)

      const reportData = Object.assign({}, baseInfo(), {
        _esIndex: EsIndex.GlobalError,
        date: formatDate(),
        errorType:'promise',
        message:reason,
        timeStamp:formatNum(error.timeStamp)
      })

      if (options.filter) isCanReport = options.filter(reportData);

      if (isCanReport) {
        core.reportLazy(reportData)
      }
    })

  }
}
