import { useCookies } from "react-cookie";
import { saveUser } from "../../utils/store";
import Cookies from "js-cookie";
import c_fetch from "./fetch";

export const api = {
  // baseURL: 'http://127.0.0.1:9500/tool',
  baseURL: "https://toolkit.show/tool",
  headers: {
    "Content-Type": "application/json",
  },
};
/**
 * 登录
 * @param user 账号
 * @returns
 */
export const loginUser = (user) =>
  c_fetch(`${api.baseURL}/login/login`, {
    method: "POST",
    body: JSON.stringify(user),
    credentials: "include",
    headers: api.headers,
  });

export const smsCodeSender = (phoneNumbers) =>
  fetch(`${api.baseURL}/login/smsCode?phoneNumbers=` + phoneNumbers, {
    method: "POST",
  });

/**
 * 获取用户信息
 * @api /api/userInfo/getInfo
 */
export const getUsers = () => {
  c_fetch(`${api.baseURL}/api/userInfo/getInfo`, {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json; charset=UTF-8",
    }),
  }).then((data: any) => {
    if (data.status != 200) {
      return;
    }
    saveUser(data.data);
  });
};

/**
 * 获取会员信息
 * @api /tool/api/pay/gpt/package/list
 */

export const registerUser = (data) =>
  fetch(`${api.baseURL}/login/register`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: api.headers,
  });

export const addPrompt = (data) =>
  fetch(
    `${api.baseURL}/api/prompt/addPrompt
      `,
    {
      // fetch跨域不会携带cookie ，需要加上这行
      credentials: "include",
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        //  'Cookie': cookie,
        "Content-Type": "application/json",
      },
    }
  );

export const getPromptTypeList = () =>
  fetch(`${api.baseURL}/api/prompt/types`, {
    credentials: "include",
    method: "GET",
    headers: {
      //  'Cookie': cookie,
      "Content-Type": "application/json",
    },
  });
export const icrPromptView = (id) =>
  fetch(`${api.baseURL}/api/prompt/icr/view?id=${id}`, {
    credentials: "include",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

export const getPromptList = (status) =>
  fetch(`${api.baseURL}/api/prompt/list?status=${status}`, {
    credentials: "include",
    method: "GET",
    headers: {
      //  'Cookie': cookie,
      "Content-Type": "application/json",
    },
  });

// export const reqCount = (ip) =>
//   c_fetch(`${api.baseURL}/api/userInfo/reqCount?ipAddress=${ip}`, {
//     credentials: "include",
//     method: "GET",
//     headers: {
//       //  'Cookie': cookie,
//       "Content-Type": "application/json",
//     },
//   });
export const reqCount = (ip) =>
  fetch(`${api.baseURL}/api/userInfo/reqCount?ipAddress=${ip}`, {
    credentials: "include",
    method: "GET",
    headers: {
      "u-token": Cookies.get("cookie"),
      "Content-Type": "application/json",
    },
  });

//   export const deleteUser = (id) => fetch(`${api.baseURL}/users/${id}`, { method: 'DELETE' });
//   export const getUsers = () => fetch(`${api.baseURL}/users`);
//   export const getUserById = (id) => fetch(`${api.baseURL}/users/${id}`);
//   export const createUser = (data) => fetch(`${api.baseURL}/users`, { method: 'POST', body: JSON.stringify(data), headers: api.headers });
//   export const updateUser = (id, data) => fetch(`${api.baseURL}/users/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: api.headers });
//   export const deleteUser = (id) => fetch(`${api.baseURL}/users/${id}`, { method: 'DELETE' });
export const getCookie = () => {
  return localStorage.getItem("token") || "";
};

export default api;
