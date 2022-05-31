export function imageRequest(url: string, params: { [key: string]: any }) {
  const image = new Image()

  return new Promise((resolve, reject) => {
    image.onload = function (res) {
      console.log('imageRequest', res)
      resolve(res)
    }
    image.onerror = function (e) {
      console.error('imageRequest', e)
      reject(e)
    }

    image.src =
      url +
      '?' +
      Object.keys(params)
        .map(key => [key] + '=' + params[key])
        .join('&')
  })


}
