import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

import {
  smsCodeSender,
  registerUser,
  loginUser,
  getUsers,
} from "../pages/api/backend";
import getIp from "../utils/ipUtil";
import { saveUser, removeUser } from "../utils/store";
import Cookies from "js-cookie";
/**
 *
 * @returns 登录表单
 */
export function LoginForm() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: any) => {
    const phoneNumber = (
      document.getElementById("phoneNumber") as HTMLInputElement
    ).value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;

    if (
      phoneNumber === "" ||
      phoneNumber == null ||
      password === "" ||
      password == null
    ) {
      toast.error("账号密码不能为空");
      return;
    }

    let user = {
      phoneNumbers: phoneNumber,
      password: password,
    };

    // console.log("username:"+username+"password:"+password)
    try {
      // 登录api
      const token = Cookies.get("cookie") || "";
      if (token) {
        await getUsers();
      } else {
        const res = await loginUser(user);
        console.log('aaa', res, Cookies.get("cookie"))
        if (!Cookies.get("cookie")) {
          toast.error("登陆失败！");
          // 清除用户信息
          removeUser()
          return;
        }
        await getUsers();
      }
      if (registerUser == null) {
        toast.error("登陆失败！");
        return;
      }
      toast.success("登陆成功！");
      setShowModal(false);
      router.reload();
    } catch (err) {
      console.log(err);
      toast.error("登陆失败！");
    }
  };

  const loginTextOpacityClick = (e) => {
    if (e.target.style.opacity === "100") {
      e.target.style.opacity = "0.5";
    } else {
      e.target.style.opacity = "100";
    }
  };

  return (
    <>
      <button
        className="bg-black text-white font-bold py-1 px-2 rounded-md my-4 mx-1 text-sm"
        onClick={() => setShowModal(true)}
      >
        登录
      </button>
      {showModal ? (
        <div className="fixed z-99 inset-0">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity min-h-screen"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div
              className="z-99 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-center flex-col">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3
                      className="text-2xl leading-6 font-bold text-black-900 flex justify-center items-center"
                      id="modal-headline"
                    >
                      <span
                        className="flex-auto text-center cursor-pointer"
                        onClick={(e) => loginTextOpacityClick(e)}
                      >
                        登录
                      </span>

                      <button
                        type="button"
                        className="inline-flex justify-center  border border-transparent  px-2 py-2  text-base font-medium text-black  focus:outline-none  focus:ring-black-500 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => setShowModal(false)}
                        style={{ position: "absolute", top: "0", right: "0" }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </h3>

                    <div className="mt-5 sm:flex sm:items-center flex-col">
                      <div className="w-full sm:max-w-xs mb-4 flex-row">
                        <label
                          htmlFor="phoneNumber"
                          className="text-left inline-block text-gray-700 text-sm font-bold mb-2"
                        >
                          手机号
                        </label>
                        <input
                          type="text"
                          name="phoneNumber"
                          id="phoneNumber"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="手机号"
                        />
                      </div>
                      <div className=" w-full sm:max-w-xs mb-4">
                        <label
                          htmlFor="password"
                          className="text-left inline-block text-gray-700 text-sm font-bold mb-2"
                        >
                          密码
                        </label>
                        <input
                          type="password"
                          name="password"
                          id="password"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="密码"
                        />
                      </div>

                      <div className=" text-center mt-3 w-full sm:mt-0 sm:ml-3 sm:max-w-xs flex items-center">
                        <button
                          className=" bg-black bg-opacity-80 hover:bg-opacity-100 text-white font-bold py-2 px-4 rounded-full m-4 w-full"
                          onClick={(e) => {
                            console.log("Login button clicked");
                            handleLogin(e);
                          }}
                        >
                          登录
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

/**
 *
 * @returns 注册表单
 */
export function RegisterForm() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const [isSending, setIsSending] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    let intervalId;
    if (isSending && countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsSending(false);
      setCountdown(30);
    }

    return () => clearInterval(intervalId);
  }, [isSending, countdown]);

  const handleSendCode = () => {
    setIsSending(true);
    const phoneNumber = (
      document.getElementById("phoneNumber") as HTMLInputElement
    ).value;
    smsCodeSender(phoneNumber)
      .then((response) => {
        if (response.ok) {
          // 返回响应结果的 JSON 格式
          return response.json();
        } else {
          console.log("registerUser Network response was not ok.");
        }
      })
      .then((data) => {
        if (data.status != 200) {
          toast.error(data.message);
          return;
        }
        toast.success("验证码发送成功！");
      })
      .catch((e) => {
        toast.error(e);
      });
  };

  const handleRegister = (e: any) => {
    const username = (document.getElementById("username") as HTMLInputElement)
      .value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;
    const phoneNumber = (
      document.getElementById("phoneNumber") as HTMLInputElement
    ).value;
    const smscode = (document.getElementById("smscode") as HTMLInputElement)
      .value;
    const invitationCode = (
      document.getElementById("invitationCode") as HTMLInputElement
    ).value;

    // console.log("username:"+username+"password:"+password)
    if (
      username === "" ||
      username == null ||
      password === "" ||
      password == null ||
      phoneNumber === "" ||
      phoneNumber == null ||
      smscode === "" ||
      smscode == null
    ) {
      toast.error("账号密码或手机号不能为空");
      return;
    }

    let user = {
      phoneNumbers: phoneNumber,
      userName: username,
      password: password,
      verificationCode: smscode,
      ipaddress: getIp(),
      invitationCode: invitationCode,
    };

    try {
      // 注册api
      registerUser(user)
        .then((response) => {
          if (response.ok) {
            // 返回响应结果的 JSON 格式
            return response.json();
          } else {
            console.log("registerUser Network response was not ok.");
            throw new Error("registerUser Network response was not ok.");
          }
        })
        .then((data) => {
          if (data.status != 200) {
            toast.error(data.message);
            return;
          }
          setShowModal(false);
          toast.success("注册成功！");
          router.push("/");
        });
    } catch (err) {
      console.log(err);
    }
  };

  const loginTextOpacityClick = (e) => {
    if (e.target.style.opacity === "100") {
      e.target.style.opacity = "0.5";
    } else {
      e.target.style.opacity = "100";
    }
  };

  return (
    <>
      <button
        className="bg-black text-white font-bold py-1 px-2 rounded-md my-4 mx-1 text-sm"
        onClick={() => setShowModal(true)}
      >
        注册
      </button>
      {showModal ? (
        <div className="fixed z-99 inset-0">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity min-h-screen"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div
              className="z-99 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-center flex-col">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-2xl leading-6 font-bold text-black-900 flex justify-center items-center"
                      id="modal-headline"
                    >
                      <span
                        className="flex-auto text-center text-black cursor-pointer"
                        onClick={(e) => loginTextOpacityClick(e)}
                      >
                        {" "}
                        注册
                      </span>

                      <button
                        type="button"
                        className="inline-flex justify-center  border border-transparent  px-2 py-2  text-base font-medium text-black  focus:outline-none  focus:ring-black-500 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => setShowModal(false)}
                        style={{ position: "absolute", top: "0", right: "0" }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </h3>

                    <div className="mt-5 sm:flex sm:items-center flex-col">
                      <div className="w-full sm:max-w-xs mb-4">
                        <label htmlFor="username" className="sr-only">
                          账号
                        </label>
                        <input
                          type="text"
                          name="username"
                          id="username"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="账号"
                        />
                      </div>
                      <div className=" w-full sm:max-w-xs mb-4">
                        <label htmlFor="password" className="sr-only">
                          密码
                        </label>
                        <input
                          type="password"
                          name="password"
                          id="password"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="密码"
                        />
                      </div>
                      <div className=" w-full sm:max-w-xs mb-4">
                        <label htmlFor="phoneNumber" className="sr-only">
                          手机号
                        </label>
                        <input
                          type="text"
                          name="phoneNumber"
                          id="phoneNumber"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="手机号"
                        />
                      </div>
                      <div className="flex flex-col items-center justify-center mb-4">
                        <div className="flex flex-row items-center justify-center">
                          <input
                            type="text"
                            id="smscode"
                            placeholder="请输入验证码"
                            className="w-48 h-10 px-2 py-1 border border-gray-300 rounded-md mr-2"
                          />
                          <button
                            className={
                              isSending
                                ? " w-24 h-10 rounded-md text-white bg-gray-400 cursor-not-allowed"
                                : "w-24 h-10 rounded-md text-white bg-black hover:bg-black"
                            }
                            onClick={handleSendCode}
                            disabled={isSending}
                          >
                            {isSending ? `${countdown}s` : "发送"}
                          </button>
                        </div>
                      </div>
                      <div className="w-full sm:max-w-xs mb-4">
                        <label htmlFor="invitationCode" className="sr-only">
                          选填邀请码
                        </label>
                        <input
                          type="text"
                          name="invitationCode"
                          id="invitationCode"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="选填邀请码"
                        />
                      </div>
                      <div className=" text-center mt-3 w-full sm:mt-0 sm:ml-3 sm:max-w-xs flex items-center">
                        <button
                          className="bg-black hover:bg-black text-white font-bold py-2 px-4 rounded-full m-4 w-full"
                          onClick={(e) => {
                            console.log("Register button clicked");
                            handleRegister(e);
                          }}
                        >
                          完成
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
