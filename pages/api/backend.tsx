import { useCookies } from "react-cookie";
import { saveUser } from "../../utils/store";
import Cookies from "js-cookie";
import c_fetch from "./fetch";

const api = {
  // baseURL: 'http://127.0.0.1:9500/tool',
  baseURL: "https://toolkit.show/tool",
  headers: {
    "Content-Type": "application/json",
  },
};

const form_headers = {
  "content-type": "multipart/form-data",
};

export const registerUser = (data) =>
  fetch(`${api.baseURL}/login/register`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: api.headers,
  });

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

export const getUsers = (cookie) => {
  const token = Cookies.get("cookie");

  console.log("token", token);
  c_fetch(`${api.baseURL}/api/userInfo/getInfo`, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json; charset=UTF-8",
      token: token,
    }),
  }).then((res: any) => {
    console.log("res", res);
  });
  // fetch(`${api.baseURL}/api/userInfo/getInfo`, {
  //   method: "POST",
  //   credentials: "include",
  //   headers: new Headers({
  //     "Content-Type": "application/json; charset=UTF-8",
  //     token: token,
  //   }),
  // })
  //   .then((response: any) => {
  //     if (response.ok) {
  //       // 返回响应结果的 JSON 格式
  //       return response.json();
  //     } else {
  //       console.log("userInfo/getInfo Network response was not ok.");
  //       throw new Error("userInfo/getInfo Network response was not ok.");
  //     }
  //   })
  //   .then((data) => {
  //     if (data.status != 200) {
  //       return;
  //     }
  //     console.log("data", data);
  //     saveUser(data.data);
  //   });
};

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

export const getPromptList = (status) =>
  fetch(`${api.baseURL}/api/prompt/list?status=${status}`, {
    credentials: "include",
    method: "GET",
    headers: {
      //  'Cookie': cookie,
      "Content-Type": "application/json",
    },
  });

export const reqCount = (ip) =>
  fetch(`${api.baseURL}/api/userInfo/reqCount?ipAddress=${ip}`, {
    credentials: "include",
    method: "GET",
    headers: {
      //  'Cookie': cookie,
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
