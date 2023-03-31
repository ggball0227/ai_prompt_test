import CryptoJS from 'crypto-js';


const encryptData = (data,secretKey) => {
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  return ciphertext;
};

// const decryptData = (ciphertext,secretKey) => {
//     debugger
//   const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
//   const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
//   return decryptedData;
// };


function decryptData(word: any,secretKey:string,iv:string) {
    // debugger
    // word = (word + '').replace(/\n*$/g, '').replace(/\n/g, ''); //增加这一行，将换行符替换为空
    let base64 = CryptoJS.enc.Base64.parse(word);
    let src = CryptoJS.enc.Base64.stringify(base64);
 
    let decrypt = CryptoJS.AES.decrypt(src, secretKey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    });
 
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}

export { encryptData, decryptData };
