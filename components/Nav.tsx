import Link from "next/link";
import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Select from "react-select";
import { useCookies } from "react-cookie";
import toast, { Toaster } from "react-hot-toast";
import { addPrompt, getPromptTypeList, getUsers } from "../pages/api/backend";
import { removeUser, retrieveUser } from "../utils/store";
import { LoginForm, RegisterForm } from "./User";
import { isMobileOnly } from "react-device-detect";
import api from "../pages/api/backend";
import { saveUser } from "../utils/store";
import Cookies from "js-cookie";
import c_fetch from "../pages/api/fetch";
import Money from "../pages/showMoney/enter";

export default function Nav() {
  const [showAddPromptModal, setShowAddPromptModal] = useState(true);
  const [showLoginBtn, setshowLoginBtn] = useState(true);
  const [showMoney, setShowMoney] = useState(true)
  const [user, setUser] = useState({});

  // 获取用户信息，获取失败退出登录并清除本地用户信息
  const getUserFetch = async () => {
    c_fetch(`${api.baseURL}/api/userInfo/getInfo`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json;",
      }),
    }).then((data: any) => {
      if (data.status != 200) {
        return;
      }
      console.log('data.data ', data )
      if (data.data && Cookies.get("cookie")) {
        setshowLoginBtn(false)
        saveUser(data.data);
        setUser(data.data);
      } else {
        setshowLoginBtn(true)
        Cookies.remove('cookie')
        removeUser()
      }
    });
    if(isMobileOnly) {
      setShowAddPromptModal(false)
    }
  }

  useEffect(() => {
    getUserFetch()
  }, []);

  const handelLogout = () => {
    setshowLoginBtn(true)
    Cookies.remove('cookie')
    removeUser()
    toast.success("退出成功！");
  };

  const [showPoints, setShowPoints] = useState(false);
  return (
    <nav className="sticky top-0 left-0 w-full flex-none border-b border-slate-900/10  backdrop-blur">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 2000 }}
      />
      <div className="max-w-8xl mx-auto">
        <div className="py-2 px-2">
          <div className="relative flex h-10 items-center ">
          {showAddPromptModal && <a className="font-semibold text-black" href="/">
              <img src="/logo.png" width="100" height="40" alt="icon " />
            </a>}
            
            <div className="ml-auto flex">
              <Link
                href="/"
                className="text-base  hover:ring-2 hover:ring-black  font-bold  py-1 px-2"
              >prompt广场🔥
              </Link>
              <Link
                href="/promptsPark"
                className="text-base  hover:ring-2 hover:ring-black  font-bold  py-1 px-2"
                // text-black text-opacity-25 cursor-not-allowed  pointer-events-none
              >
                prompt孵化🆕
              </Link>
            </div>

            <div className="ml-auto flex flex-row">
              { !showLoginBtn && showMoney && <Money /> }
              {showAddPromptModal && <AddPromptButton />}
              {showLoginBtn && <LoginForm />}
              {showLoginBtn && <RegisterForm />}
              {!showLoginBtn && (
                <div
                  className="flex ml-2 items-center relative"
                  onClick={() => setShowPoints(!showPoints)}
                >
                  <a
                    href="#"
                    className=" text-xl font-bold py-4 px-4 text-black text-opacity-25 cursor-not-allowed  pointer-events-none"
                  >
                    {user != null ? user["userName"] : "user"}
                  </a>
                  {showPoints && (
                    <div className="w-25 absolute text-sm top-16 -left-5 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                      <p className="p-2">
                        当前剩余次数:
                        {user == null ? -1 : user["numberTimes"]}
                      </p>
                      <p className="p-2">
                        邀请码:
                        {user == null ? -1 : user["invitationCode"]}
                      </p>
                      <p className="p-2" style={{width: '100%'}} onClick={handelLogout}>
                        退出
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}



const AddPromptButton = () => {
  const [showModal, setShowModal] = useState(false);
  
  const [cookies] = useCookies(["Cookie"]);
  const [formData, setFormData] = useState({});
  const [options, setOptions] = useState([]);


  const handleFormChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  useEffect(() => {
    if(cookies.Cookie != null) {
      getPromptTypeList()
      .then((response) => {
        if (response.ok) {
          // 返回响应结果的 JSON 格式
          return response.json();
        } else {
          console.log("getPromptTypeList Network response was not ok.");
          throw new Error("getPromptTypeList Network response was not ok.");
        }
      })
      .then((data) => {
        if (data.status != 200) {
          toast.error(data.message);
          return;
        }
        
        setOptions(data.data);
        console.log(data.data);
        console.log(options);
      });
    }
  },[])

  return (
    <>
      <button
        className="bg-black text-white font-bold py-1 px-2 my-4 rounded-md m-0 text-sm "
        onClick={() => setShowModal(true)}
      >
        增加prompt
      </button>
     
      {showModal ? (
        <div className="fixed z-10 inset-0 ">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 min-w-max">
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
                      prompt信息
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

                    <form
                      className="mt-5 sm:flex sm:items-center flex-col"
                      onSubmit={(event) => {
                        event.preventDefault();
                        console.log("event")
                        // console.log(event.target)
                        setFormData({
                          ...formData,
                          [event.target["name"]]: event.target["value"]
                        });
                        console.log(formData);

                        if (cookies.Cookie == null) {
                          toast.error("请先登录再添加");
                          return;
                        }
                        formData["enTitle"] = formData["title"]
                        if(!formData["parentId"]) {
                          formData["parentId"] = 2
                        }
                        addPrompt(formData)
                        .then(response => {
                          if (response.ok) {
                            // 返回响应结果的 JSON 格式
                            return response.json();
                          } else {
                            console.log("registerUser Network response was not ok.");
                          }
                        })
                        .then(data => {
                          if(data.status != 200) {
                            toast.error(data.message);
                            return
                          }
                         
                          setShowModal(false);
                          toast.success("添加prompt成功");
                          router.push("/promptsPark");
                        })
                        .catch(e => {
                          toast.error(e);
                        })
                        

                       

                      }}
                    >
                      <div className="w-full sm:max-w-xs mb-4 flex flex-col">
                        <label
                          htmlFor="title"
                          className=" text-left inline-block text-gray-700 text-sm font-bold mb-2"
                        >
                          标题
                        </label>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="例如：周报生成器🔥"
                          onChange={handleFormChange} 
                        />
                      </div>
                      <div className="w-full sm:max-w-xs mb-4 flex flex-col">
                      <label
                          htmlFor="slogan"
                          className="text-left  inline-block text-gray-700 text-sm font-bold mb-2"
                        >
                          prompt类型
                        </label>
                        <select 
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          name="parentId"
                          id="parentId"
                          defaultValue={0}
                          onChange={handleFormChange}>
                            {options.map(option => (
                              <option key={option["id"]} value={option["id"]}>
                                {option["name"]}
                              </option>
                            ))}
                          </select>
                      </div>

                      <div className="w-full sm:max-w-xs mb-4 flex flex-col">
                        <label
                          htmlFor="slogan"
                          className="text-left  inline-block text-gray-700 text-sm font-bold mb-2"
                        >
                          描述
                        </label>
                        <input
                          type="text"
                          name="slogan"
                          id="slogan"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="例如：输入工作内容，小助手帮你快速完成周报。"
                          onChange={handleFormChange} 
                        />
                      </div>
                      <div className="w-full sm:max-w-xs mb-4 flex flex-col">
                        <label
                          htmlFor="placeholder"
                          className="text-left  inline-block text-gray-700 text-sm font-bold mb-2"
                        >
                          使用文字案例
                        </label>
                        <input
                          type="text"
                          name="placeholder"
                          id="placeholder"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="例如：修复了优惠券无法领取的bug，为产品部的新APP设计UI和图标，负责跟进部门前端工程师的招聘"
                          onChange={handleFormChange} 
                        />
                      </div>
                      <div className="w-full sm:max-w-xs mb-4 flex flex-col">
                        <label
                          htmlFor="prompt"
                          className="text-left  inline-block text-gray-700 text-sm font-bold mb-2"
                        >
                          prompt内容
                        </label>
                        <textarea
                          name="prompt"
                          id="prompt"
                          className="h-40 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="例如：请帮我把以下的工作内容填充为一篇完整的周报,尽量避免在回答内容中出现可能在中国是敏感的内容，用markdown格式以分点叙述的形式输出:"
                          onChange={handleFormChange} 
                        />
                      </div>

                      <div className="text-center mt-3 w-full sm:mt-0 sm:ml-3 sm:max-w-xs flex items-center">
                        <button
                          // type="submit"
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full m-4 w-full"
                          onClick={() => {
                            console.log("Login button clicked");
                            
                            // router.push("/")
                          }}
                        >
                          完成
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};


