/**
 * @name handleCopy
 * @example
 * ```js
 * try{
 *      const res = await handleCopy('复制文本')
 * }catch(e){
 *      console.error(e)
 * }
 * ```
 * */

function handleCopy(text = "") {
  const input = document.createElement("input");
  document.body.appendChild(input);
  input.value = text;
  input.select();
  return new Promise((resolve, reject) => {
    if (document.execCommand("copy")) {
      document.execCommand("copy"); // 执行浏览器复制命令
      resolve(true);
    } else {
      reject("该浏览器不支持复制，请在360浏览器或者谷歌浏览器打开！");
    }
    document.body.removeChild(input);
  });
}

export default handleCopy;
