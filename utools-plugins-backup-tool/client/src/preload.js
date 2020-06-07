const fs = require("original-fs");
const path = require("path");
const zlib = require("zlib");
const asar = require("asar");
const crypto = require("crypto");
const superagent = require("superagent");
const progressStream = require("progress-stream");

const githubFileBaseUrl =
  "https://cdn.jsdelivr.net/gh/marsvet/uTools-plugins-collection";
const myServerBaseUrl = "http://47.94.94.136:59999";
// const myServerBaseUrl = "http://127.0.0.1:59999";
const pluginsDir = path.join(utools.getPath("userData"), "plugins");
const tempDir = utools.getPath("temp");

/**
 * 包装 gzipSync
 */
function gzipPlugin(sourcePath, targetPath) {
  fs.writeFileSync(targetPath, zlib.gzipSync(fs.readFileSync(sourcePath)));
}

function getSavePath() {
  let savePath = path.join(utools.getPath("desktop"), "plugins");
  let num = 1;
  while (fs.existsSync(savePath)) {
    if (num == 1) savePath = savePath + `(${num})`;
    else savePath = savePath.replace(`(${num - 1})`, `(${num})`);
    num++;
  }
  fs.mkdirSync(savePath);
  return savePath;
}

/**
 * 获取 Github 上已存在的插件的信息
 */
function getPluginsInfoInGithub() {
  return new Promise((resolve, reject) => {
    superagent
      .get(encodeURI(`${githubFileBaseUrl}@latest/plugins-info.json`))
      .retry(2)
      .then((res) => {
        resolve(res.body);
      })
      .catch(reject);
  });
}

/**
 * 下载插件
 */
function downloadPluginFromGithub(filename, savePath, progressCallback) {
  let writeStream = fs.createWriteStream(path.join(savePath, filename));
  let progress = progressStream({ length: "0" });

  superagent
    .get(encodeURI(`${githubFileBaseUrl}/plugins/${filename}`))
    .retry(2)
    .pipe(progress) // 用于监听下载进度
    .pipe(writeStream);

  progress.on("progress", (obj) => {
    if (progressCallback) progressCallback(obj.percentage.toFixed(2));
  });

  return new Promise((resolve, reject) => {
    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });
}

/**
 * 上传插件到 server
 */
function uploadPluginToMyServer(filePath, progressCallback) {
  let upxPath = path.join(tempDir, path.basename(filePath, ".asar") + ".upx");
  gzipPlugin(filePath, upxPath);
  return new Promise((resolve, reject) => {
    superagent
      .post(`${myServerBaseUrl}/api/upload`)
      .attach("file", upxPath)
      .retry(2)
      .on("progress", (event) => {
        let percentage = ((event.loaded / event.total) * 100).toFixed(2);
        if (progressCallback) progressCallback(percentage);
      })
      .then((res) => {
        fs.unlinkSync(upxPath);
        resolve(res);
      })
      .catch(reject);
  });
}

/**
 * 清空数据库
 */
function clearDB() {
  if (utools.db.get("allPluginsId")) {
    let idsInDB = utools.db.get("allPluginsId")["ids"];
    utools.db.remove("allPluginsId");
    for (let id of idsInDB) utools.db.remove(id);
  }
}

/**
 * 将插件数据存入数据库
 */
function putPluginsInfoToDB(pluginsInfo) {
  let ids = [];
  for (info of pluginsInfo) {
    let id = `${info.name.replace(/[ /]+/g, "-")}-${info.version}`;
    info["_id"] = id;
    utools.db.put(info);
    ids.push(id);
  }
  utools.db.put({
    _id: "allPluginsId",
    ids,
  });
}

/**
 * 从数据库中获取所有插件数据
 */
window.getPluginsInfoFromDB = () => {
  let allData = utools.db.allDocs();
  if (!allData) return;
  let toDelete;
  for (let info of allData) {
    if (info["_id"] == "allPluginsId") toDelete = info;
    else delete info["_id"];
  }
  allData.splice(allData.indexOf(toDelete), 1);
  return allData;
};

/**
 * 获取本地所有插件数据
 */
window.getLocalPluginsInfo = () => {
  let pluginsInfo = [];

  fs.readdirSync(pluginsDir).forEach((filename) => {
    let filePath = path.join(pluginsDir, filename);
    let pluginJsonContent;

    if (!/.*\.asar$/.test(filename)) return; // 如果不是 .asar 文件，跳过
    if (fs.statSync(filePath).isDirectory()) return; // 如果是目录，跳过

    /* 计算插件 MD5 */
    let asarMd5 = crypto
      .createHash("md5")
      .update(fs.readFileSync(filePath))
      .digest("hex");

    /* 获取插件内的 plugin.json 文件的内容 */
    try {
      pluginJsonContent = JSON.parse(asar.extractFile(filePath, "plugin.json"));
    } catch (err) {
      return;
    }

    /* 提取有用的信息 */
    let pluginInfo = {
      name: pluginJsonContent.pluginName,
      version:
        pluginJsonContent.version[0].toLowerCase() == "v"
          ? pluginJsonContent.version.toLowerCase()
          : "v" + pluginJsonContent.version,
      asarMd5,
      filePath,
    };

    pluginsInfo.push(pluginInfo);
  });

  pluginsInfo = [...new Set(pluginsInfo)]; // 去重
  return pluginsInfo;
};

window.backupPlugins = (localPluginsInfo, progressCallback) => {
  getPluginsInfoInGithub().then((pluginsInfoInGithub) => {
    let toUpload = [];
    for (let localItem of localPluginsInfo) {
      let flag = false;
      for (let githubItem of pluginsInfoInGithub)
        if (githubItem.asarMd5 == localItem.asarMd5) {
          flag = true;
          break;
        }
      if (!flag) toUpload.push(localItem);
    }

    let uploadedNum = 0;
    for (let i = 0; i < toUpload.length; i++) {
      uploadPluginToMyServer(toUpload[i].filePath).then(() => {
        if (progressCallback) {
          uploadedNum++;
          progressCallback(((uploadedNum / toUpload.length) * 100).toFixed(2));
        }
      });
    }
  });

  clearDB();
  putPluginsInfoToDB(localPluginsInfo);
};

window.restorePlugins = (pluginsInfoInDB, progressCallback) => {
  let savePath = getSavePath();
  let downloadedNum = 0;
  for (let dbItem of pluginsInfoInDB) {
    let filename = `${dbItem.name.replace(/[ /]+/g, "-")}-${
      dbItem.version
    }.upx`;
    downloadPluginFromGithub(filename, savePath).then(() => {
      if (progressCallback) {
        downloadedNum++;
        progressCallback(
          ((downloadedNum / pluginsInfoInDB.length) * 100).toFixed(2)
        );
      }
    });
  }
};
