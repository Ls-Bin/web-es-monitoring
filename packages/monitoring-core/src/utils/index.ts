
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


export function baseInfo(): {
  pageUrl: string,
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
