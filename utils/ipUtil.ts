


// 获取ip
export default function getIp(): string {

    let ip = localStorage.getItem("ip") == null ? "" : localStorage.getItem("ip");
    if (ip != null && ip != 'null' && ip != "") {
      return ip;
    }
  
    fetch('https://api.ipify.org/?format=json',{
        method: 'GET'
    })
  .then(response => {
     // 检查响应状态码
     if (response.ok) {
        // 返回响应结果的 JSON 格式
        return response.json();
      } else {
        console.log("https://api.ipify.org/?format=json Network response was not ok.");
      }
  }).then(data => {
    ip = data.ip;
    localStorage.setItem("ip", ip == null ? "" : ip)
  })
  
    return ip == null ? "" : ip
  
  }