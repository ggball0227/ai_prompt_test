import { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import { LikeOutlined } from "@ant-design/icons";
import { api } from "../../pages/api/backend";
import c_fetch from "../../pages/api/fetch";
import toast, { Toaster } from "react-hot-toast";
import { retrieveUser } from '../../utils/store'
const Money = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [list, setList] = useState([]);
  const [id, setId] = useState(0);
  const [action, useAction] = useState<any>({})
  const [show, setShow] = useState(false)

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // 选中
  const clickModal = (item: any) => {
    setId(item.id);
    useAction(item)
  };

  // 购买
  const actionClick = () => {
    setShow(true)
    try {
      c_fetch(`${api.baseURL}/api/pay/ali/qrcode`, {
        method: "POST",
        body: JSON.stringify({ orderNum: action.id, packageId: retrieveUser().mobile }),
        headers: new Headers({
          "Content-Type": "application/json; charset=UTF-8",
        }),
      }).then((res: any) => {
        if (res.status != 200) {
          return;
        }
        console.log('res', res)
      });
    } catch (error) {
      toast.error("购买异常！！！");
      throw new Error("购买异常！！！");
    }
    
  }

  useEffect(() => {
    try {
      c_fetch(`${api.baseURL}/api/pay/gpt/package/list`, {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json; charset=UTF-8",
        }),
      }).then((res: any) => {
        if (res.status != 200) {
          return;
        }
        setList(res.data);
      });
    } catch (error) {
      toast.error("获取套餐失败！！！");
      throw new Error("获取套餐失败！！！");
    }
  }, []);

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 2000 }}
      />
      <button
        className="bg-black text-white font-bold py-1 px-2 rounded-md my-4 mx-1 text-sm"
        onClick={showModal}
      >
        会员
      </button>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
        width={800}
      >
        { !show ? <>
          <div className="all">
            {list &&
              list.map((item: any) => (
                <div
                  className={id === item.id ? "modal action" : "modal"}
                  key={item.id}
                  onClick={() => clickModal(item)}
                >
                  <div className="m_name">{item.name}</div>
                  <div className="m_main">
                    <div className="m_top">
                      <span
                        className={
                          id === item.id ? "m_money action_color" : "m_money"
                        }
                      >
                        ¥{item.amount}
                      </span>
                      <span>/每月</span>
                    </div>
                    <div className="m_list">
                      <LikeOutlined />
                      <span style={{ marginLeft: 5 }}>
                        免费使用{item.nums}/月
                      </span>
                    </div>
                    <div className="m_list">
                      <LikeOutlined />
                      <span style={{ marginLeft: 5 }}>一次生成一个结果</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="m_btn">
            <button
              className="bg-black text-white font-bold py-1 px-2 rounded-md my-4 mx-1 text-sm btn"
              onClick={actionClick}
            >
              购买会员
            </button>
          </div>
        </> : <div>123</div> }
      </Modal>
    </>
  );
};

export default Money;
