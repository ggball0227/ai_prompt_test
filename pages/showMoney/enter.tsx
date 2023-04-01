import { useState, useEffect } from "react";
import { Modal } from "antd";
import { LikeOutlined } from "@ant-design/icons";
import { api } from "../../pages/api/backend";
import c_fetch from "../../pages/api/fetch";
import toast, { Toaster } from "react-hot-toast";
import { retrieveUser } from '../../utils/store'
import QRCode from 'qrcode.react';
import { useRouter } from "next/router";
const Money = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [list, setList] = useState([]);
  const [id, setId] = useState(0);
  const [action, useAction] = useState<any>({})
  const [show, setShow] = useState(false)
  const [url, setUrl] = useState('')
  const [width, setWidth] = useState(500)
  const router = useRouter()
  let inter

  const showModal = () => {
    if(list && list.length >= 2) {
      setWidth(800)
    }
    setShow(false)
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
    setWidth(300)
    // 订单号：生成规则就是 dg+ 时间戳 + 后四位随机
    const orderNum = 'dg' + new Date().getTime() + parseInt((Math.random() * 10000).toString())
    console.log('order', orderNum)
    try {
      c_fetch(`${api.baseURL}/api/pay/ali/qrcode`, {
        method: "POST",
        body: JSON.stringify({ orderNum: orderNum, packageId: action.id}),
        headers: new Headers({
          "Content-Type": "application/json; charset=UTF-8",
        }),
      }).then((res: any) => {
        if (res.status != 200) {
          toast.error("购买异常！！！");
          return;
        }
        setUrl(res.data.qrCode)
        clearInterval(inter)
        if(res.data.qrCode && !inter) {
          inter = setInterval(() => {
            notifyAll(orderNum)
          }, 1000)
        }
      });
    } catch (error) {
      toast.error("购买异常！！！");
      throw new Error("购买异常！！！");
    }
    
  }

  // 支付回调
  const notifyAll = (orderNum: string) => {
    try {
      c_fetch(`${api.baseURL}/api/pay/order/pay/status?orderNum=${orderNum}`, {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json; charset=UTF-8",
        }),
      }).then((res: any) => {
        if (res.status != 200) {
          return;
        }
        if(res.data === 1) {
          setShow(true)
          clearInterval(inter)
          toast.success("支付成功");
          router.reload();
        }
      });
    } catch (error) {
      toast.error("支付失败！！！");
      throw new Error("支付失败！！！");
    }

  }

  // 下载二维码
  const downClick = () => {
    const canvasImg: any = document.getElementById('qrCode'); // 获取canvas类型的二维码
    const img = new Image();
    img.src = canvasImg.toDataURL('image/png'); // 将canvas对象转换为图片的data url
    const downLink: any = document.getElementById('down_link');
    downLink.href = img.src;
    downLink.download = '二维码'; // 图片name
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
        if (res.data.length >= 2) {
          setWidth(800)
        } 
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
        width={width}
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
                      <span>/元</span>
                    </div>
                    <div className="m_list">
                      <LikeOutlined />
                      <span style={{ marginLeft: 5 }}>
                        免费使用{item.nums}次
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
        </> : <div style={{marginTop: 20}}>
        <QRCode
          id="qrCode"
          value={url}
          size={200} // 二维码的大小
          fgColor="#000000" // 二维码的颜色
          style={{ margin: 'auto' }}
          // imageSettings={{ // 二维码中间的logo图片
          //     src: 'https://i1.hdslb.com/bfs/archive/c3545ba0b0ef759ca09548d7dd147e05e11b5b80.png',
          //     height: 100,
          //     width: 100,
          //     excavate: true, // 中间图片所在的位置是否镂空
          // }}
        />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4px 0' }}>
          <span>请打开支付宝扫一扫或</span>
          <a id="down_link" style={{ color: '#4ea1db' }} onClick={downClick}>
              点击下载
          </a>
        </div>
          
        </div> }
      </Modal>
    </>
  );
};

export default Money;
