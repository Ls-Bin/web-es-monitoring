import { EsIndex } from './../enum';
/* eslint-disable no-restricted-globals */

interface PluginConfig {
    report: Function
    reportUrl: string
}

type ApiRequestReportData = {
    esIndex: string
    createTime: any
    title: string  //标题
    "url": string, //url
    "timestamp": number, //timestamp
    "userAgent": string, //浏览器版本
    "type": string, //xhr
    "eventType": string, //事件类型 load
    "pathname": string, //路径
    "status": string, //状态码
    "duration": number, //持续时间
    "response": string, //响应内容
    "params": string //参数
}



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

    let oldXHR = window.XMLHttpRequest;

    function newXHR() {
        let realXHR = new oldXHR();
        // this指向window
        realXHR.addEventListener('abort', function () { ajaxEventTrigger.call(this, 'ajaxAbort'); }, false);

        realXHR.addEventListener('error', function () { ajaxEventTrigger.call(this, 'ajaxError'); }, false);

        realXHR.addEventListener('load', function () { ajaxEventTrigger.call(this, 'ajaxLoad'); }, false);
        realXHR.addEventListener('loadstart', function () { ajaxEventTrigger.call(this, 'ajaxLoadStart'); }, false);
        realXHR.addEventListener('loadend', function () { ajaxEventTrigger.call(this, 'ajaxLoadEnd'); }, false);

        realXHR.addEventListener('progress', function () { ajaxEventTrigger.call(this, 'ajaxProgress'); }, false);

        realXHR.addEventListener('timeout', function () { ajaxEventTrigger.call(this, 'ajaxTimeout'); }, false);

        realXHR.addEventListener('readystatechange', function () { ajaxEventTrigger.call(this, 'ajaxReadyStateChange'); }, false);

        return realXHR;
    }

    window.XMLHttpRequest = newXHR as any;
}


export class apiRequest {

    constructor({ report, reportUrl }: PluginConfig) {

        initXHRErr()

        const ajaxRecordArr: any[] = []
        window.addEventListener('ajaxLoadStart', function (e: any) {
            ajaxRecordArr.push({
                timeStamp: new Date().getTime(),
                event: e,
                isLoadEnd: false
            })

        });
        window.addEventListener('ajaxLoadEnd', function (e: any) {
            ajaxRecordArr.forEach(record => {
                if (record.isLoadEnd) return;
                const XHR = record.event.detail

                if (XHR.status > 0) {
                    record.isLoadEnd = true

                    // exclude es report xhr 
                    if (!XHR.responseURL.includes(reportUrl) && !XHR.responseURL.includes(`/${EsIndex.ApiRequest}/`)) {

                        report({
                            esIndex: EsIndex.ApiRequest,
                            createTime: new Date(),
                            "url": XHR.responseURL, //url
                            "type": 'xhr', //xhr
                            "status": XHR.status, //xhr status
                            "duration": new Date().getTime() - record.timeStamp, 
                            // "response": string, 
                            // "params": string 
                        })
                    }

                    return
                }

            })

        });

    }
}
