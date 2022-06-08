import '@styles/styles.css';
/**
 * Created by: Andrey Polyakov (andrey@polyakov.im)
 */
import '@styles/styles.less';
import '@styles/styles.scss';

import React from 'react';
import ReactDom from 'react-dom';

import {App} from '@components/app/app';

import WebEsMonitoring  from 'monitoring-core'
import performancePlugin from 'monitoring-core/src/plugins/performance'
import resourceLoadPlugin from 'monitoring-core/src/plugins/resourceLoad'
import apiRequestPlugin from 'monitoring-core/src/plugins/apiRequest'
import reportPlugin from 'monitoring-core/src/plugins/report'

const webEsMonitoring = new WebEsMonitoring({
    reportUrl:'http://localhost:8080/es'
})

/* webEsMonitoring.addFn((monitor: { data: () => any; })=>{
    console.log(monitor.data())
}) */
// datawebEsMonitoring.use(apiRequest)
webEsMonitoring.use(reportPlugin)
webEsMonitoring.use(apiRequestPlugin)

webEsMonitoring.use(resourceLoadPlugin,{filter:function(data: any){
    return true
}})
webEsMonitoring.use(performancePlugin)


// eslint-disable-next-line no-restricted-globals
ReactDom.render(<App />, document.getElementById('root'));
