/**
 * c_fetch
 * 基于原生fetch封装了拦截器功能，暴露出来的c_fetch跟原生fetch用法一致，只是增加了拦截器功能。拦截器用法参考axios的拦截器用法。
 * 拦截器: c_fetch.interceptors
 * 注意: 拦截器不拦截reject类型的response结果
 */
import Cookies from "js-cookie";

//定义用来存储拦截请求和拦截响应结果的处理函数集合
let interceptors_req = [],
  interceptors_res = [];

function c_fetch(input: any, init: any) {
  //fetch默认请求方式设为GET
  if (!init.method) {
    init.method = "GET";
  }
  const token = Cookies.get("cookie");
//   console.log("aaaaaaaaaaaa", init, token);
  init.headers["token"] = token;
  //interceptors_req是拦截请求的拦截处理函数集合
  //   interceptors_req.forEach((interceptors: any) => {
  //     console.log('aaa', init)
  //     init = interceptors(init);
  //   });

  //在原生fetch外面封装一个promise，为了在promise里面可以对fetch请求的结果做拦截处理。
  //同时，保证c_fetch函数返回的结果是个promise对象。
  return new Promise(function (resolve, reject) {
    //发起fetch请求，fetch请求的形参是接收上层函数的形参
    fetch(input, init)
      .then((res: any) => {
        //interceptors_res是拦截响应结果的拦截处理函数集合
        // interceptors_res.forEach((interceptors: any) => {
        //   //拦截器对响应结果做处理，把处理后的结果返回给响应结果。
        //   res = interceptors(res);
        // });
        //将拦截器处理后的响应结果resolve出去
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

//在c_fetch函数上面增加拦截器interceptors，拦截器提供request和response两种拦截器功能。
//可以通过request和response的use方法来绑定两种拦截器的处理函数。
//use方法接收一个参数，参数为一个callback函数，callback函数用来作为拦截器的处理函数；
//request.use方法会把callback放在interceptors_req中，等待执行。
//response.use方法会把callback放在interceptors_res中，等待执行。
//拦截器的处理函数callback接收一个参数。
//request拦截器的callback接收的是请求发起前的config；
//response拦截器的callback接收的是网络请求的response结果。
c_fetch.interceptors = {
  request: {
    use: function (callback) {
      interceptors_req.push(callback as never);
    },
  },
  response: {
    use: function (callback) {
      interceptors_res.push(callback as never);
    },
  },
};

export default c_fetch;
