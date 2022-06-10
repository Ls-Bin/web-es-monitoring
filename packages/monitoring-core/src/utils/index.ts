// @ts-ignore
import { Browser } from './browser'

export function convertObj(data: { [key: string]: string }) {
  let _result = []
  for (let key in data) {
    let value = data[key] as any
    if (value.constructor === Array) {
      value.forEach(function (_value: string) {
        _result.push(key + '=' + _value)
      })
    } else {
      _result.push(key + '=' + value)
    }
  }
  return _result.join('&')
}

export function formatNum(value: number) {
  return Math.floor(value)
}

const uid = generateUUID()
export function baseInfo(): {
  uid:string
  pageUrl: string
  browser: string
  device: string
  engine: string
  isWebview: boolean
  language: string
  os: string
  osVersion: string
  version: string

} {
  const browserData = new Browser() as any
  return {
    uid,
    pageUrl: location.href,
    ...browserData
  }
}

/**
 * 判断是否需要采样
 * @param sampleRate 采样率
 */
export function checkSampling(sampleRate = 100) {
  return Math.floor(Math.random() * 100) <= sampleRate
}

function generateUUID() {
  let d = new Date().getTime(),
    d2 = (performance && performance.now && performance.now() * 1000) || 0
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    let r = Math.random() * 16
    if (d > 0) {
      r = (d + r) % 16 | 0
      d = Math.floor(d / 16)
    } else {
      r = (d2 + r) % 16 | 0
      d2 = Math.floor(d2 / 16)
    }
    return (c == 'x' ? r : (r & 0x7) | 0x8).toString(16)
  })
}
