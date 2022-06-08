import webEsMonitoring,{Options} from './index'


export interface PluginsInterface {
  install(plugin: { install: () => void },core:webEsMonitoring, options: Options): void
  apply?(hookName: string, handler: Function): void
  get?(hookName: string): void
  report(result: any): void
}


export default class Plugin implements PluginsInterface {

  hooks: { report: Function, }
  constructor() {

    this.hooks = {
      report: function () { },
    }
  }


  install(plugin: { install: (core:webEsMonitoring,_opt: any) => void },core:webEsMonitoring, options: Options) {
    plugin.install(core,options)
  }

  // apply(hookName: string, handler: Function) {

  // }

  get(hookName: 'report',) {
    return this.hooks[hookName]
  }

  report(result: any) {
    this.hooks.report(result)
  }

  register(fnName: 'report', fn: Function) {
    this.hooks[fnName] = fn as any
  }
}
