import Link from "next/link";
import { useState } from "react";
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="text-center h-16 sm:h-20 w-full sm:pt-2 pt-4 border-t mt-5 flex sm:flex-row flex-col justify-center items-center px-3 space-y-3 sm:mb-0 mb-3 bottom-0">
      
      <div>
      <ContactLink />
        <span className="text-black text-opacity-25">Powered by{" "}</span>
        <a
          href="https://openai.com/"
          target="_blank"
          rel="noreferrer"
          className="text-black text-opacity-25 hover:underline transition underline-offset-2"
        >
          OpenAI{" "}
        </a>
        <span className="text-black text-opacity-25">and{" "}</span>
        
        <a
          href="https://vercel.com/"
          target="_blank"
          rel="noreferrer"
          className="text-black text-opacity-25 hover:underline transition underline-offset-2"
        >
          Vercel Edge Functions.
        </a>
        <span className="text-black text-opacity-25" id="busuanzi_container_site_pv"> | 本站总访问量<span id="busuanzi_value_site_pv" className="text-black text-opacity-25"></span>次</span>
        <span className="text-black text-opacity-25" id="busuanzi_container_site_uv">
         | 本站访客数<span className="text-black text-opacity-25" id="busuanzi_value_site_uv"></span>人次
      </span>
        
      </div>

    </footer>
  );
}

const ContactLink = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
     <a
      target="_blank"
          rel="noreferrer"
        className="font-bold hover:cursor-pointer hover:outline-black transition underline-offset-2 block"
        onClick={() => setShowModal(true)}
      >
        欢迎进交流反馈群，解锁更多prompt玩法
      </a>
       <div className="fixed bottom-5 right-2 bg-opacity-1  rounded-lg hover:cursor-pointer" onClick={() => setShowModal(true)}>
        <Image src="/wechat.svg" width={50} height={50} alt="floating icon" className='m-0 items-center w-10 h-10 sm:w-15 sm:h-15 lg:w-23 lg:h-23' />
      </div>
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-2 w-3/5  sm:w-2/5 lg:w-300 h-auto flex flex-col items-center justify-center">
          <h3 className="text-gray-700 text-md text-center ">关注公众号【toolkit百宝箱】</h3>
            <Image src="/wx_qrcode.jpg" width={400} height={400} alt="popup image" className="object-contain m-0"/>
            <h3 className="text-black font-bold text-md text-center ">免费领取chatgpt共享账号，解锁更多prompt玩法!</h3>
            <button className="bg-black text-white px-4 py-2 rounded-lg mt-4" onClick={() => setShowModal(false)}>关闭</button>
          </div>
        </div>
      )}
    </>
  );
};
