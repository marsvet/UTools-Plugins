const fs = require("fs");
const path = require("path");
const querystring = require("querystring");
const superagent = require("superagent");
const randomIp = require("chinese-random-ip");
const progressStream = require("progress-stream");

/**
 * 封装一个 sleep 函数
 */
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * 封装 path.basename()
 */
window.getPathBasename = (p) => {
  return path.basename(p);
};

/**
 * 生成随机 id
 */
window.randomId = () => {
  let letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let chars = letters + "0123456789-_";
  let minLength = 8;
  let maxLength = 32;
  let resultLength = Math.floor(
    Math.random() * (maxLength - minLength + 1) + minLength
  );

  let result = letters[Math.floor(Math.random() * letters.length)]; // id 的开头字符必须是字母
  for (let i = 0; i < resultLength; i++)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

/**
 * 验证文件大小是否小于 10MB
 */
window.checkFileSize = (filePath) => {
  let fileSize = fs.statSync(filePath).size;
  if (fileSize < 10 * 1024 * 1024) return true;
  else return false;
};

/**
 * 转换器类
 */
window.Converter = class {
  constructor() {
    this._baseUrl = "http://www.alltoall.net";
    this._uploadUrl =
      this._baseUrl +
      "/qfy-content/plugins/qfy-customize-cloudconvert/convert.php";
    this._headers = {
      referer: this._baseUrl,
      "x-forwarded-for": randomIp.getChineseIp(),
    };
    this._agent = superagent.agent().set(this._headers);
  }

  get outputName() {
    if (this._filePath && this._inputType && this._downloadUrl) {
      return (
        path.basename(this._filePath, this._inputType) +
        querystring.parse(this._downloadUrl)["filename"].split(".").slice(-1)[0]
      );
    }
  }

  /**
   * 初始化 Cookies
   */
  async initCookies() {
    await this._agent.get(this._baseUrl);
    await this._agent
      .post(this._baseUrl + "/FeiEditor/traffic/log")
      .type("form")
      .send({
        st_pid: "9754",
        st_pkey: "4c466bd2f484c05d401893691a674106",
      });
  }

  /**
   * 上传文件
   */
  async upload(filePath, progressCallback) {
    this._filePath = filePath;

    let rsp = await this._agent
      .post(this._uploadUrl)
      .field("action", "upload")
      .attach("files[]", filePath)
      .on("progress", (event) => {
        if (progressCallback) {
          let percent = ((event.loaded / event.total) * 100).toFixed(2);
          if (String(percent).split(".")[1] == "00")
            percent = String(percent).split(".")[0];
          progressCallback(percent);
        }
      });
    let rspData = JSON.parse(rsp.text);

    this._token = rspData["token"];
    this._filename = rspData["file_name"];
    this._inputType = rspData["ext"];

    return rspData["ext_output"];
  }

  /**
   * 转换
   */
  async convert(outputType, progressCallback) {
    let rsp = await this._agent.post(this._uploadUrl).type("form").send({
      file_name: this._filename,
      token: this._token,
      action: "create",
      input_type: this._inputType,
      output_type: outputType,
    });
    let rspData = JSON.parse(rsp.text);

    this._processUrl = rspData["process_url"];
    this._fileUrl =
      "http://www.alltoall.net/qfy-content/uploads/alltoall/upload/" +
      this._filename;

    await this._agent.post(this._uploadUrl).type("form").send({
      file_name: this._filename,
      token: this._token,
      action: "process",
      process_url: this._processUrl,
      file_url: this._fileUrl,
      output_type: outputType,
    });

    while (true) {
      await sleep(2000); // 每两秒获取一次转换进度

      let rsp = await this._agent.post(this._uploadUrl).type("form").send({
        file_name: this._filename,
        token: this._token,
        action: "status",
        process_url: this._processUrl,
      });
      let rspData = JSON.parse(rsp.text);

      let percent = rspData["percent"].toFixed(2);
      if (String(percent).split(".")[1] == "00")
        percent = String(percent).split(".")[0];
      if (progressCallback) progressCallback(percent);

      if (
        rspData["percent"] == 100 &&
        Object.keys(rspData).includes("output") &&
        Object.keys(rspData["output"]).includes("url")
      ) {
        this._downloadUrl = this._baseUrl + "/" + rspData["output"]["url"];
        return;
      }
    }
  }

  /**
   * 下载
   */
  download(savePath, progressCallback) {
    let writeStream = fs.createWriteStream(savePath);
    let progress = progressStream({ length: "0" });

    this._agent.get(this._downloadUrl).pipe(progress).pipe(writeStream);

    progress.on("progress", (obj) => {
      let percent = obj.percentage.toFixed(2);
      if (String(percent).split(".")[1] == "00")
        percent = String(percent).split(".")[0];
      if (progressCallback) progressCallback(percent);
    });

    return new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });
  }
};
