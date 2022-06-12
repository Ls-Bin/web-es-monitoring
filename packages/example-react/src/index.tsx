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
import globalError from 'monitoring-core/src/plugins/globalError'
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
webEsMonitoring.use(globalError)
webEsMonitoring.use(apiRequestPlugin)

webEsMonitoring.use(resourceLoadPlugin,{filter:function(data: any){
    return true
}})
webEsMonitoring.use(performancePlugin)


    
        // try{
            // @ts-ignore 
        // JSON.parse('sdfs')
//          }catch(e){
//  console.error(e)
//          }


function testPromise (){
    return new Promise((resolve,reject)=>{
        // resolve('test1')
        setTimeout(() => {
              reject({test:22})
        }, 3000);
    })
}

testPromise().then((d)=>{
         // @ts-ignore 
        JSON.parse('sdfs')
})

// eslint-disable-next-line no-restricted-globals
ReactDom.render(<App />, document.getElementById('root'));
