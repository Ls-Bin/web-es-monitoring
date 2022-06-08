import { EsIndex } from './../enum';
import webEsMonitoring, { Options } from '../../index'
import { baseInfo, checkSampling } from '../utils'
/* eslint-disable no-restricted-globals */


// interface ApiRequestReportData {
//     _esIndex: string
//     createTime: Date
//     url: string, //url
//     userAgent?: string, //浏览器版本
//     type: string, //xhr
//     eventType: string //事件类型
//     status: number, //状态码
//     duration: number, //请求耗时
//     response?: string, //响应内容
//     params?: string //参数
// }


function initXHRErr() {
    // ie Polyfill
    (function () {
        if (typeof window.CustomEvent === "function") return false;

        function CustomEvent(event: string, params: any) {
            params = params || { bubbles: false, cancelable: false, detail: undefined };
            let evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        }

        CustomEvent.prototype = window.Event.prototype;

        window.CustomEvent = CustomEvent as any;
        return
    })();


    function ajaxEventTrigger(this: any, event: string) {
        let ajaxEvent = new CustomEvent(event, { detail: this });
        window.dispatchEvent(ajaxEvent);
    }


    let oldXHR = window.XMLHttpRequest as any;
    let open = window.XMLHttpRequest.prototype.open
    function openReplacement(this: any, method: string, url: string) {
        this._url = url
        return open.apply(this, arguments as any);
    }

    oldXHR.prototype.open = openReplacement;

    function newXHR() {
        let realXHR = new oldXHR();
        // this指向window
        realXHR.addEventListener('abort', function (this: any,) { ajaxEventTrigger.call(this, 'ajaxAbort'); }, false);

        realXHR.addEventListener('error', function (this: any,) { ajaxEventTrigger.call(this, 'ajaxError'); }, false);

        realXHR.addEventListener('load', function (this: any,) { ajaxEventTrigger.call(this, 'ajaxLoad'); }, false);
        realXHR.addEventListener('loadstart', function (this: any,) { ajaxEventTrigger.call(this, 'ajaxLoadStart'); }, false);
        realXHR.addEventListener('loadend', function (this: any,) { ajaxEventTrigger.call(this, 'ajaxLoadEnd'); }, false);

        realXHR.addEventListener('progress', function (this: any,) { ajaxEventTrigger.call(this, 'ajaxProgress'); }, false);

        realXHR.addEventListener('timeout', function (this: any,) { ajaxEventTrigger.call(this, 'ajaxTimeout'); }, false);

        realXHR.addEventListener('readystatechange', function (this: any,) { ajaxEventTrigger.call(this, 'ajaxReadyStateChange'); }, false);

        return realXHR;
    }

    window.XMLHttpRequest = newXHR as any;
}


export default {
    install(core: webEsMonitoring, options: Options) {
        let isCanReport = checkSampling(options.sampleRate)
        if (!isCanReport) return

        initXHRErr()

        const reportUrl = core.reportUrl
        const ajaxRecordArr: any[] = []
        window.addEventListener('ajaxLoadStart', function (e: any) {
            ajaxRecordArr.push({
                timeStamp: new Date().getTime(),
                event: e,
                isLoadEnd: false
            })

        });
        window.addEventListener('ajaxLoadEnd', function () {
            ajaxRecordArr.forEach(record => {

                if (record.isLoadEnd) return;
                const XHR = record.event.detail
                if (XHR.status > 0) {
                    const url = XHR.responseURL
                    record.isLoadEnd = true

                    // exclude es report xhr
                    if (!url.includes(reportUrl) && !url.includes(`/${EsIndex.ApiRequest}/`)) {
                        const reportData = Object.assign({}, baseInfo(), {
                            _esIndex: EsIndex.ApiRequest,
                            createTime: new Date(),
                            url: url,
                            type: 'xhr',
                            eventType: 'loadEnd',
                            status: XHR.status,
                            duration: new Date().getTime() - record.timeStamp,

                            // userAgent: '',
                            // response: '',
                            // params: ''
                        })

                        if (options.filter) isCanReport = options.filter(reportData);

                        if (isCanReport) {
                          core.report(reportData)
                        }
                    }

                    return
                }

            })

        });

        window.addEventListener('ajaxTimeout', function () {

            ajaxRecordArr.forEach(record => {

                if (record.isLoadEnd) return;
                const XHR = record.event.detail

                // find current timeout XHR
                if (XHR.status === 0 && XHR.readyState === 4 && XHR.responseURL === '') {
                    const url = XHR._url
                    record.isLoadEnd = true

                    // // exclude es report xhr
                    if (!url.includes(reportUrl) && !url.includes(`/${EsIndex.ApiRequest}/`)) {
                        const reportData = Object.assign({}, baseInfo(), {
                            _esIndex: EsIndex.ApiRequest,
                            createTime: new Date(),
                            url: url,
                            type: 'xhr',
                            eventType: 'timeout',
                            status: 0,
                            duration: XHR.timeout,
                        })

                        if (options.filter) isCanReport = options.filter(reportData);

                        if (isCanReport) {
                          core.report(reportData)
                        }
                    }

                    return
                }



            })
        });
    }
}

