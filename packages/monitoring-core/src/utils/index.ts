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

export function baseInfo() {
  return {
    pageUrl: location.href
  }
}

/**
 * 判断是否需要采样
 * @param sampleRate 采样率
 */
export function isCanReport(sampleRate: number) {
  return Math.floor(Math.random() * 100) < sampleRate
}
