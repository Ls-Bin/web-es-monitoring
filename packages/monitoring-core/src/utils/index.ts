export function convertObj(data:{[key:string]:string}) {
    let _result = [];
    for (let key in data) {
      let value = data[key] as any;
      if (value.constructor === Array) {
        value.forEach(function(_value:string) {
          _result.push(key + "=" + _value);
        });
      } else {
        _result.push(key + '=' + value);
      }
    }
    return _result.join('&');
  }


 export function formatNum(value:number){
  return Math.floor(value)
  }


  export function baseInfo(){
      return {
        pageUrl :location.href
      }
  }