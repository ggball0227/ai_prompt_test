/**
 * c_fetch
 * 基于原生fetch封装了拦截器功能，暴露出来的c_fetch跟原生fetch用法一致，只是增加了拦截器功能。拦截器用法参考axios的拦截器用法。
 * 注意: 拦截器不拦截reject类型的response结果
 */
import Cookies from "js-cookie";

function c_fetch(input: any, init: any) {
  //fetch默认请求方式设为GET
  if (!init.method) {
    init.method = "GET";
  }
  const token = Cookies.get("cookie") || '';
  if (token) {
    init.headers.set('u-token', token)
  }
  //在原生fetch外面封装一个promise，为了在promise里面可以对fetch请求的结果做拦截处理。
  //同时，保证c_fetch函数返回的结果是个promise对象。
  return new Promise(function (resolve, reject) {
    //发起fetch请求，fetch请求的形参是接收上层函数的形参
    fetch(input, init)
      .then((res: any) => {
        // console.log('res1', res, res.headers.get('cookie'))
        if(res.headers.get('cookie')) {
          Cookies.set('cookie', res.headers.get('cookie'))
        }
        //将拦截器处理后的响应结果resolve出去
        if (res.ok && !res.url.includes('/login/login')) {
          res = res.json()
        }
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}


export default c_fetch;
