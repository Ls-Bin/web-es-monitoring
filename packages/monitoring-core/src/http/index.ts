import { convertObj } from '../utils'
// import { imageRequest } from './imgRequest'

interface Params {
  [key: string]: any
}

interface Request {
  (type: string, url: string, params: Params|any): Promise<any>
}

const request: Request = function (type, url, params) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.timeout = 1000 * 30
    xhr.open(type, type === 'GET' ? `${url}${convertObj(params)?("?"+convertObj(params)):''}` : url, true)
    xhr.setRequestHeader('content-type', 'application/json')
    xhr.onload = function () {
      if (xhr.getResponseHeader('Content-Type')?.includes('application/json')) {
        return resolve(JSON.parse(xhr.responseText))
      }

      return resolve(xhr.responseText)
    }
    xhr.onerror = function () {
      reject({reportError:xhr})

    }

    xhr.ontimeout = function () {
      reject({reportError:xhr})
    }

    if (type === 'GET') {
      xhr.send()
    } else {
      xhr.send(params)
    }

  })
}

const get = function (url: string, params: Params) {
  // if (Image) {
  //   return imageRequest(url, params)
  // }
  return request('GET', url, params)
}

const post = function (url: string, params: Params|string) {
  return request('POST', url, params)
}
const put = function (url: string, params: Params) {
  return request('PUT', url, params)
}
export { get, post, put }
