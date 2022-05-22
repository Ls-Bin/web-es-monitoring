export function imageRequest(url: string, params: { [key: string]: any }) {
  const image = new Image()
  image.onload = function (res) {
    console.log(res)
  }
  image.onerror = function (e) {
    console.error(e)
  }
  
  image.src =
    url +
    '?' +
    Object.keys(params)
      .map(key => [key] + '=' + params[key])
      .join('&')
}
