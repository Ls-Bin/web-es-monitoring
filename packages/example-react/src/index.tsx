import '@styles/styles.css';
/**
 * Created by: Andrey Polyakov (andrey@polyakov.im)
 */
import '@styles/styles.less';
import '@styles/styles.scss';

import React from 'react';
import ReactDom from 'react-dom';

import {App} from '@components/app/app';

import WebEsMonitoring, { apiRequest, resourceLoad }  from 'monitoring-core'


const webEsMonitoring = new WebEsMonitoring({
    reportUrl:'http://localhost:8080/es'
})

/* webEsMonitoring.addFn((monitor: { data: () => any; })=>{
    console.log(monitor.data())
}) */
webEsMonitoring.use(apiRequest)
webEsMonitoring.use(resourceLoad)


// eslint-disable-next-line no-restricted-globals
ReactDom.render(<App />, document.getElementById('root'));
