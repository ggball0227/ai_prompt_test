import { useEffect, useRef, useState } from "react";
import { SendOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useRouter } from "next/router";
import { retrievePrompts } from "../../utils/store";
import { Toaster, toast } from "react-hot-toast";
import { reqCount } from "../api/backend";
import getIp from "../../utils/ipUtil";
import { marked } from "marked";

const { TextArea } = Input;

const Home = () => {
  const router = useRouter();
  const { index }: any = router.query;
  if (index == undefined) {
    return <></>;
  }
  let data = {};
  if (index.indexOf(".") > 0) {
    let key = index.split(".")[0];
    let subKey = index.split(".")[1];
    data = retrievePrompts()[key][subKey];
  } else {
    return <></>;
  }

  const value = useRef<any>(null);
  const [textarea, setTextarea] = useState("");
  // const [loading, setLoading] = useState(false);
  // const [chat, setChat] = useState("");
  const [generatedChat, setGeneratedChat] = useState<string>("");
  const [list, setList] = useState<any>([
    {
      GPT: data["placeholder"],
      textarea: "",
    },
  ]);

  const prompt = data["prompt"] + `${textarea}`;

  const generateChat = async () => {
    // console.log("kaishi1");
    // e.preventDefault();
    setGeneratedChat("");
    // setLoading(true);
    if (textarea === "") {
      toast.error("内容不能为空");
      // setLoading(false);
      return;
    }

    let countRes: any = await reqCount(getIp());
    console.log("countRes", countRes, countRes.body);
    if (countRes.status != 200) {
      toast.error(countRes.message);
      // setLoading(false);
      throw new Error(countRes.message);
    }
    setList([...list, {
      GPT: generatedChat,
      textarea: textarea
    }])
    setTextarea("");
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      toast.error("服务繁忙，请稍后再试");
      // setLoading(false);
      return;
    }

    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value).replace("<|im_end|>", "");
      setGeneratedChat((prev) => prev + chunkValue);
    }
    // setLoading(false);
  };

  // 按钮按下事件
  const onKeyDown = (e) => {
    // console.log("e", e, e.keyCode);
    if(e.keyCode === 13) {
      generateChat()
    }
  };
  const onKeyUp = (e) => {
    // console.log("e", e, e.keyCode);
  };
  // 输入框改变事件
  const onChange = (e) => {
    setTextarea(e.target.value);
  };

  useEffect(() => {
    value.current.scrollTop = value.current.scrollHeight;
  }, [generatedChat]);

  return (
    <div className="home">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 2000 }}
      />
      <div className="home_container__Myqoy">
        {/* 右侧 */}
        <div className="home_window-content__RRVow">
          <div className="home_chat__7Bh_I">
            {/* 聊天标题 */}
            <div className="home_window-header__248BE">
              <div className="home_window-header-title__bJCkO">
                <div className="home_window-header-main-title__Y16Es home_chat-body-title__5S8w4">
                  {data["title"]}
                </div>
                <div className="home_window-header-sub-title__9rZM1">
                  {data["slogan"]}  { list.length - 1 ? `--共${ list.length - 1 }条对话` : '' }
                </div>
              </div>
            </div>
            {/* 聊天内容 */}
            <div ref={value} className="home_chat-body__mbaM8">
              {list.map((item: any, index) => {
                return (
                  <div key={index}>
                    { item.GPT && <div className="home_chat-message__rdH_g">
                      <div className="home_chat-message-container__plj_e u-flex">
                        <div className="home_chat-message-avatar__611lI">
                          {/* GPT头像 */}
                          <div className="home_user-avtar__3QksJ">
                            <img
                              src="/logo.png"
                              alt="smiley"
                              className="__EmojiPicker__ epr-emoji-img"
                            ></img>
                          </div>
                        </div>
                        <div className="home_chat-message-item__hDEOq">
                          <div className="home_chat-message-top-actions__PfOzb">
                            <div className="home_chat-message-top-action__wXKmA">
                              重试
                            </div>
                            <div className="home_chat-message-top-action__wXKmA">
                              重试
                            </div>
                          </div>
                          <div className="markdown-body">
                            {
                              <p
                                className="sty1 markdown-body"
                                dangerouslySetInnerHTML={{
                                  __html: marked(item.GPT.toString(), {
                                    gfm: true,
                                    breaks: true,
                                    smartypants: true,
                                  }),
                                }}
                              ></p>
                            }
                            {/* <p>{item.GPT}</p> */}
                          </div>
                        </div>
                      </div>
                    </div> }
                    { item.textarea && <div className="home_chat-message-user__WsuiB">
                      <div className="home_chat-message-container__plj_e u-flex">
                        <div className="home_chat-message-item__hDEOq">
                          <div className="markdown-body">
                            <p>{item.textarea}</p>
                          </div>
                        </div>
                        {/* <div className="home_chat-message-status__EsVNi">正在输入…</div> */}
                        <div className="home_chat-message-avatar__611lI">
                          <div className="home_user-avtar__3QksJ">
                            <img
                              src={arr[0]}
                              alt="smiley"
                              className="__EmojiPicker__ epr-emoji-img"
                            ></img>
                          </div>
                        </div>
                      </div>
                    </div> }
                  </div>
                );
              })}
              
              {generatedChat && (
                <div className="home_chat-message__rdH_g">
                  <div className="home_chat-message-container__plj_e u-flex">
                    <div className="home_chat-message-avatar__611lI">
                      {/* GPT头像 */}
                      <div className="home_user-avtar__3QksJ">
                        <img
                          src="/logo.png"
                          alt="smiley"
                          className="__EmojiPicker__ epr-emoji-img"
                        ></img>
                      </div>
                    </div>
                    <div className="home_chat-message-item__hDEOq">
                      <div className="home_chat-message-top-actions__PfOzb">
                        <div className="home_chat-message-top-action__wXKmA">
                          重试
                        </div>
                        <div className="home_chat-message-top-action__wXKmA">
                          重试
                        </div>
                      </div>
                      <div className="markdown-body">
                        {
                          <p
                            className="sty1 markdown-body"
                            dangerouslySetInnerHTML={{
                              __html: marked(generatedChat.toString(), {
                                gfm: true,
                                breaks: true,
                                smartypants: true,
                              }),
                            }}
                          ></p>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* 聊天发送 */}
            <div className="home_chat-input-panel__kmhBn">
              <div className="home_chat-input-panel-inner__8J59p">
                <TextArea
                  value={textarea}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  onKeyUp={onKeyUp}
                  rows={4}
                  placeholder="输入消息，Enter 发送"
                />
                {/* <textarea className="home_chat-input__qM_hd" placeholder="输入消息，Ctrl + Enter 发送" rows="2"></textarea> */}
                <div
                  className="button_icon-button__BC_Ca undefined undefined home_chat-input-send__rsJfH clickable"
                  onClick={generateChat}
                >
                  <div className="button_icon-button-icon__qlUH3 no-dark">
                    <SendOutlined />
                  </div>
                  <div className="button_icon-button-text__k3vob">发送</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const arr = [
  "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202008%2F12%2F20200812105950_4WFTF.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1683189793&t=9796630a3da67fa586d51b0c9e8b1992",
  "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202104%2F22%2F20210422220415_2e4bd.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1683189793&t=72c643e64cf372f07a4016c219f8f3ba",
  "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202105%2F19%2F20210519212438_ced7e.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1683189793&t=65840ae04b604ed18f8edcc4ed100beb",
  "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F4893c456-4d98-47ca-a57a-34d28b068e01%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1683189872&t=390d536981fa3b238f52e0b936e8b20d",
];

export default Home;
