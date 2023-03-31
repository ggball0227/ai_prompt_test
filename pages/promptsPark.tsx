import path from 'path'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Card, { CardUnavailable } from '../components/Card'
import Footer from '../components/Footer'
import Nav from '../components/Nav'
import { retrievePrompts, savePrompts } from '../utils/store'
import { getPromptList } from './api/backend'



function PromptsPark() {
  return (

    <>
    <script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>
      <div className="min-h-screen">
        <Nav />

        <div className='container mx-auto pb-10 pt-4'>
          <CardJson />
        </div>
        <Footer />
      </div>
    </>

  )
}

export default PromptsPark


const CardJson = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // const jsonData = require('../messages/zh.json');
    // setData(jsonData);
    getPromptList("-1")
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
      setData(data.data);
    })
    .catch(e => {
      toast.error(e);
    })


   
  }, []);

  return (
    <div className='class="flex w-full flex-col gap-y-4"'>
      {Object.keys(data).map((key) => (
        <>
          <div key={key + "text"} className="text-lg font-semibold text-black">{key}</div>
          <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 p-7'>
            {Object.keys(data[key]).map((subKey) => (
              <CardUnavailable key={subKey + "content"} index={key+"."+subKey} value={data[key][subKey]} />
            ))}
          </div>
        </>

      ))}
    </div>

  );
};
