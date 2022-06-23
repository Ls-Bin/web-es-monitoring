import webEsMonitoring, { Options } from './index'

export interface PluginsInterface {
  install(plugin: { install: () => void }, core: webEsMonitoring, options: Options): void
  apply?(hookName: string, handler: Function): void
  get?(hookName: string): void
  report(result: any): void
  reportLazy(result: any): void
}

export default class Plugin implements PluginsInterface {
  hooks: { report: Function; reportLazy: Function }

  constructor() {
    this.hooks = {
      report() {},
      reportLazy() {},
    }
  }

  install(plugin: { install: (core: webEsMonitoring, _opt: any) => void }, core: webEsMonitoring, options: Options) {
    plugin.install(core, options)
  }

  // apply(hookName: string, handler: Function) {

  // }

  get(hookName: 'report') {
    return this.hooks[hookName]
  }

  report(result: any) {
    this.hooks.report(result)
  }

  reportLazy(result: any) {
    this.hooks.reportLazy(result)
  }

  register(fnName: 'report' | 'reportLazy', fn: Function) {
    this.hooks[fnName] = fn as any
  }
}
