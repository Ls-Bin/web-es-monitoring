import '@styles/styles.css';
/**
 * Created by: Andrey Polyakov (andrey@polyakov.im)
 */
import '@styles/styles.less';
import '@styles/styles.scss';

import React from 'react';
import ReactDom from 'react-dom';

import {App} from '@components/app/app';

import WebEsMonitoring from 'monitoring-core';
import performancePlugin from 'monitoring-core/src/plugins/performance';
import globalErrorPlugin from 'monitoring-core/src/plugins/globalError';
import resourceLoadPlugin from 'monitoring-core/src/plugins/resourceLoad';
import apiRequestPlugin from 'monitoring-core/src/plugins/apiRequest';
import reportPlugin from 'monitoring-core/src/plugins/report';
import {get} from 'monitoring-core/src/http';
const webEsMonitoring = new WebEsMonitoring({
    reportUrl: 'http://localhost:8080/es',
});

webEsMonitoring.use(reportPlugin);
webEsMonitoring.use(globalErrorPlugin);
webEsMonitoring.use(apiRequestPlugin);

webEsMonitoring.use(resourceLoadPlugin);
webEsMonitoring.use(performancePlugin);

// try{
// @ts-ignore
// JSON.parse('sdfs')
//          }catch(e){
//  console.error(e)
//          }

function testPromise() {
    return new Promise((resolve, reject) => {
        // resolve('test1')
        setTimeout(() => {
            reject({promiseError: 'test'});
        }, 1000);
    });
}


// promise测试
testPromise().then((d) => {
    // @ts-ignore
    JSON.parse('sdfs');
});

throw 'js error错误测试'


// fetch请求测试
fetch('https://api.github.com/users/defunkt', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
});
// 请求测试
setTimeout(() => {
    get('https://api.github.com/users/defunkt', {});
}, 2000);

// eslint-disable-next-line no-restricted-globals
ReactDom.render(<App />, document.getElementById('root'));
