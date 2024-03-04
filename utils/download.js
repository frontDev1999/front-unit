/**
 * 这里是ajax的通用访问接口处理
 */
import axios from "axios";
import Qs from "qs";

export default {
  /**
   * 封装导出Excal文件post请求
   * @param url  下载接口url
   * @param data 参数
   * @returns {Promise}
   */
  download(url, options = {}) {
    this.filterEmptyKey(options, false);
    return new Promise((resolve, reject) => {
      axios.defaults.headers["Content-Type"] = "application/json;charset=UTF-8";
      axios({
        method: "post",
        url: url, // 请求地址
        data: options, // 参数
        responseType: "blob", // 表明返回服务器返回的数据类型
      }).then(
        (response) => {
          let blob = new Blob([response.data], {
            type: "application/vnd.ms-excel",
          });
          //判断类型是否返回json，返回json时报错
          if (response.data.type !== "application/vnd.ms-excel") {
            let reader = new FileReader();
            reader.onload = (e) => {
              let result = JSON.parse(e.target.result);
              if (result) {
                return reject(result);
              }
            };
            reader.readAsText(blob);
          } else {
            resolve(response.data);
            let now = new Date();
            let fileName = now.getTime() + ".xlsx";
            if (window.navigator.msSaveOrOpenBlob) {
              navigator.msSaveBlob(blob, fileName);
            } else {
              let link = document.createElement("a");
              link.href = window.URL.createObjectURL(blob);
              link.download = fileName;
              link.click();
              //释放内存
              window.URL.revokeObjectURL(link.href);
            }
          }
        },
        (err) => {
          reject(err);
        }
      );
    });
  },

  /**
   * 服务端接口empty字符串跟null返回的结果不同，过滤掉empty字符串
   * @param params
   * @param emptyString 是否过滤空字符串
   */
  filterEmptyKey(params, emptyString) {
    Object.keys(params).forEach((key) => {
      if (params[key] === null || (emptyString && params[key] === "")) {
        delete params[key];
      }
    });
  },

  /**
   * 封装导出Excal文件get请求
   * @param url  下载接口url
   * @param data 参数
   * @returns {Promise}
   */
  getDownload(url, options = {}) {
    this.filterEmptyKey(options, true);
    options = Qs.stringify(options, { arrayFormat: "repeat" });
    return new Promise((resolve, reject) => {
      axios.defaults.headers["Content-Type"] = "application/json;charset=UTF-8";
      axios({
        method: "get",
        url: url + "?" + options, // 请求地址
        responseType: "blob", // 表明返回服务器返回的数据类型
      }).then(
        (response) => {
          let blob = new Blob([response.data], {
            type: "application/vnd.ms-excel",
          });
          //判断类型是否返回json，返回json时报错
          if (response.data.type !== "application/vnd.ms-excel") {
            let reader = new FileReader();
            reader.onload = (e) => {
              let result = JSON.parse(e.target.result);
              if (result) {
                return reject(result);
              }
            };
            reader.readAsText(blob);
          } else {
            //正确时导出文件
            resolve(response.data);
            let now = new Date();
            let fileName = now.getTime() + ".xlsx";
            if (window.navigator.msSaveOrOpenBlob) {
              navigator.msSaveBlob(blob, fileName);
            } else {
              let link = document.createElement("a");
              link.href = window.URL.createObjectURL(blob);
              link.download = fileName;
              link.click();
              //释放内存
              window.URL.revokeObjectURL(link.href);
            }
          }
        },
        (err) => {
          reject(err);
        }
      );
    });
  },
};
