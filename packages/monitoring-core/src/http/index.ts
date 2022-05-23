import { imageRequest } from './imgRequest'

interface Params {
  [key: string]: any
}

interface Request {
  (type: string, url: string, params: Params): Promise<any>
}

const request: Request = function (type, url, params) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()

    xhr.open(type, url, true)
    xhr.setRequestHeader('content-type', 'application/json')
    xhr.onload = function () {
  
      if (xhr.getResponseHeader('Content-Type')?.includes('application/json')) {
        return resolve(JSON.parse(xhr.responseText))
      }
      return resolve(xhr.responseText)
    }
    xhr.onerror = function (error) {
      reject(error)
    }

    xhr.send(JSON.stringify(params))
  })
}

const get = function (url: string, params: Params) {
  /*   if (Image) {
    return imageRequest(url, params)
  } */
  return request('GET', url, params)
}

const post = function (url: string, params: Params) {
  return request('POST', url, params)
}
const put = function (url: string, params: Params) {
  return request('PUT', url, params)
}
export { get, post, put }
