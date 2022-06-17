export function imageRequest(url: string, params: { [key: string]: any }) {
  const logId: any = 'report_log_' + new Date().getTime()
  let image = (window[logId] = new Image() as any)

  return new Promise((resolve, reject) => {
    image.onload = image.onerror = function (res: any) {
      resolve(res)
      window[logId] = null as any;
      image = null
    }
    image.onerror = function (e:any) {
      // reject({reportError:e})
      window[logId] = null as any;
      image = null
    }
    image.src =
      url +
      '?' +
      Object.keys(params)
        .map(key => [key] + '=' + params[key])
        .join('&')
  })
}
