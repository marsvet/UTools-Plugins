let notifier = new Notifier({
  default_time: 2000,
});
let converters = {};

utools.onPluginEnter(({ code, type, payload }) => {
  if (type != "files") return;

  for (let file of payload) {
    let trId = genTr(window.getPathBasename(file.path)); // 生成一行，并返回其 id
    let converter = new window.Converter();
    converters[trId] = converter;

    converter
      .initCookies()
      .then(() => {
        modifyConverterStatus(trId, "正在上传：0%");
        modifyOpButton(trId, "上传中...");

        uploadFile(trId, file.path);
      })
      .catch((err) => {
        modifyConverterStatus(trId, "错误", "text-danger");
        deleteOpButton(trId);

        notifier.notify("error", "网络错误");
      });
  }
});

function uploadFile(trId, filePath) {
  let converter = converters[trId];

  converter
    .upload(filePath, (percent) => {
      modifyConverterStatus(trId, `正在上传：${percent}%`);
    })
    .then((outputTypeOptions) => {
      modifyConverterStatus(trId, "上传完成", "text-success");
      modifyOpButton(trId, "开始转换", false);

      let dropdownHtml = `<button type="button" class="btn btn-light dropdown-toggle" data-toggle="dropdown">请选择</button>
                            <div class="dropdown-menu">`;
      for (let outputType of outputTypeOptions)
        dropdownHtml += `<a class="dropdown-item" onclick="document.querySelector('#${trId} .output-type button').innerHTML = '${outputType}'">${outputType}</a>`;
      dropdownHtml += `</div>`;
      document.querySelector(`#${trId} .output-type`).innerHTML = dropdownHtml;
    })
    .catch((err) => {
      modifyConverterStatus(trId, "错误", "text-danger");
      deleteOpButton(trId);

      notifier.notify("error", "网络错误");
    });
}

function startConvert(trId) {
  if (
    document.querySelector(`#${trId} .output-type button`).innerHTML == "请选择"
  ) {
    notifier.notify("error", "请先选择目标格式");
    return;
  }

  modifyOpButton(trId, "转换中...", true);
  modifyConverterStatus(trId, "正在转换：0%", "text-info");

  let outputTypeObj = document.querySelector(`#${trId} .output-type`);
  let outputTypeButtonObj = outputTypeObj.querySelector("button");
  outputTypeObj.innerHTML = outputTypeButtonObj.innerHTML;
  let outputType = outputTypeButtonObj.innerHTML;

  let converter = converters[trId];
  converter
    .convert(outputType, (percent) => {
      modifyConverterStatus(trId, `正在转换：${percent}%`);
    })
    .then(() => {
      modifyConverterStatus(trId, "转换完成", "text-success");

      modifyOpButton(trId, "下载", false);
      document
        .querySelector(`#${trId} .operations button`)
        .setAttribute("onclick", `downloadFile('${trId}')`);
    })
    .catch((err) => {
      modifyConverterStatus(trId, "错误", "text-danger");
      deleteOpButton(trId);

      notifier.notify("error", "网络错误");
    });
}

function downloadFile(trId) {
  let converter = converters[trId];

  let savePath = utools.showSaveDialog({
    title: "保存",
    defaultPath: converter.outputName,
  });
  if (!savePath) return;

  modifyConverterStatus(trId, "正在下载", "text-info");
  modifyOpButton(trId, "下载中...", true);

  converter.download(savePath).then(() => {
    modifyConverterStatus(trId, "下载完成", "text-success");
    deleteOpButton(trId);
  });
}

function genTr(filename) {
  let trId = randomId();
  let currentDate = new Date().format("MM月dd日 HH:mm");

  let trHtml = `<tr id="${trId}">
                  <td class="filename">${filename}</td>
                  <td class="upload-date">${currentDate}</td>
                  <td class="converter-status text-info">准备中</td>
                  <td class="output-type">--</td>
                  <td class="operations">
                    <button type="button" class="btn btn-light" disabled onclick="startConvert('${trId}')">准备中...</button>
                  </td>
                </tr>`;
  let tbodyObj = document.querySelector(".table tbody");
  tbodyObj.innerHTML = trHtml + tbodyObj.innerHTML;

  return trId;
}

function modifyConverterStatus(trId, html, colorClass) {
  if (!trId) return;
  let converterStatusObj = document.querySelector(`#${trId} .converter-status`);
  if (html) converterStatusObj.innerHTML = html;
  if (colorClass) {
    converterStatusObj.classList.remove("text-info", "text-success");
    converterStatusObj.classList.add(colorClass);
  }
}

function modifyOpButton(trId, html, disabled) {
  if (!trId) return;
  let opButtonObj = document.querySelector(`#${trId} .operations button`);
  if (html) opButtonObj.innerHTML = html;
  if (disabled) opButtonObj.setAttribute("disabled", "");
  else opButtonObj.removeAttribute("disabled");
}

function deleteOpButton(trId) {
  document.querySelector(`#${trId} .operations`).innerHTML = "";
}

/**
 * 生成随机 id
 */
function randomId() {
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
}

/**
 * 日期格式化
 */
Date.prototype.format = function (fmt) {
  let o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "H+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};
