const $$ = mdui.JQ;
const colorClasses = {
  ready: "mdui-text-color-pink-a200",
  process: "mdui-text-color-orange-900",
  success: "mdui-text-color-pink-a200",
  error: "mdui-text-color-red-900",
};

let converters = {};

utools.onPluginEnter(({ code, type, payload }) => {
  if (type != "files") return;

  for (let file of payload) {
    init(file.path);
  }
});

$$(document).on({
  dragenter: (e) => {
    e.preventDefault();
    $$.showOverlay();
  },
  dragleave: (e) => {
    e.preventDefault();
    $$.hideOverlay();
  },
  dragover: (e) => {
    e.preventDefault(); // 清除默认事件
  },
  drop: (e) => {
    e.preventDefault();
    $$.hideOverlay();

    let fileList = e.dataTransfer.files;
    console.log(fileList);
    if (fileList.length == 0) return;
    for (let file of fileList) {
      init(file.path);
    }
  },
});

function init(filePath) {
  let filename = window.getPathBasename(filePath);

  if (!window.checkFileSize(filePath)) {
    mdui.snackbar({
      message: `文件  ${filename}  超出大小限制！`,
      timeout: 2000,
      position: "left-top",
    });
    return;
  }

  let trId = genTr(window.getPathBasename(filePath)); // 生成一行，并返回其 id
  let converter = new window.Converter();
  converters[trId] = converter;

  converter
    .initCookies()
    .then(() => {
      modifyConverterStatus(trId, "正在上传：0%", colorClasses["process"]);
      modifyOpButton(trId, "上传中...");

      uploadFile(trId, filePath);
    })
    .catch((err) => {
      modifyConverterStatus(trId, "错误", colorClasses["error"]);
      deleteOpButton(trId);

      mdui.snackbar({
        message: "网络错误！",
        timeout: 2000,
        position: "left-top",
      });
    });
}

function uploadFile(trId, filePath) {
  let converter = converters[trId];

  converter
    .upload(filePath, (percent) => {
      modifyConverterStatus(trId, `正在上传：${percent}%`);
    })
    .then((outputTypeOptions) => {
      modifyConverterStatus(trId, "上传完成", colorClasses["success"]);
      modifyOpButton(trId, "开始转换", false);

      let dropdownHtml = `<select class="mdui-select select-outputType" mdui-select>`;
      for (let outputType of outputTypeOptions)
        dropdownHtml += `<option value="${outputType}">${outputType}</option>`;
      dropdownHtml += `</select>`;
      $$(`#${trId} .output-type`).html(dropdownHtml);
      mdui.mutation();
    })
    .catch((err) => {
      modifyConverterStatus(trId, "错误", colorClasses["error"]);
      deleteOpButton(trId);

      mdui.snackbar({
        message: "网络错误！",
        timeout: 2000,
        position: "left-top",
      });
    });
}

function startConvert(trId) {
  modifyOpButton(trId, "转换中...", true);
  modifyConverterStatus(trId, "正在转换：0%", colorClasses["process"]);

  let outputTypeObj = $$(`#${trId} .output-type`);
  let outputTypeSelectObj = $$(`#${trId} .output-type select`);
  let outputType = outputTypeSelectObj.val();
  outputTypeObj.html(outputType);

  let converter = converters[trId];
  converter
    .convert(outputType, (percent) => {
      modifyConverterStatus(trId, `正在转换：${percent}%`);
    })
    .then(() => {
      modifyConverterStatus(trId, "转换完成", colorClasses["success"]);

      modifyOpButton(trId, "下载", false);
      $$(`#${trId} .operations button`).attr(
        "onclick",
        `downloadFile('${trId}')`
      );
    })
    .catch((err) => {
      modifyConverterStatus(trId, "错误", colorClasses["error"]);
      deleteOpButton(trId);

      mdui.snackbar({
        message: "网络错误！",
        timeout: 2000,
        position: "left-top",
      });
    });
}

function downloadFile(trId) {
  let converter = converters[trId];

  let savePath = utools.showSaveDialog({
    title: "保存",
    defaultPath: converter.outputName,
  });
  if (!savePath) return;

  modifyConverterStatus(trId, "正在下载", colorClasses["process"]);
  modifyOpButton(trId, "下载中...", true);

  converter
    .download(savePath, (percent) => {
      modifyConverterStatus(trId, `正在下载：${percent}%`);
    })
    .then(() => {
      modifyConverterStatus(trId, "下载完成", colorClasses["success"]);
      deleteOpButton(trId);
    })
    .catch((err) => {
      modifyConverterStatus(trId, "错误", colorClasses["error"]);
      deleteOpButton(trId);

      mdui.snackbar({
        message: "网络错误！",
        timeout: 2000,
        position: "left-top",
      });
    });
}

function genTr(filename) {
  let trId = window.randomId();
  let currentDate = new Date().format("MM月dd日 HH:mm");

  $$("#file-table tbody").prepend(
    `<tr id="${trId}">
      <td class="filename">${filename}</td>
      <td class="upload-date">${currentDate}</td>
      <td class="converter-status ${colorClasses["ready"]}">准备中</td>
      <td class="output-type">--</td>
      <td class="operations">
        <button type="button" class="mdui-btn mdui-btn-raised mdui-ripple" disabled onclick="startConvert('${trId}')">准备中...</button>
      </td>
    </tr>`
  );
  mdui.updateTables();

  return trId;
}

function modifyConverterStatus(trId, html, colorClass) {
  if (!trId) return;
  let converterStatusObj = $$(`#${trId} .converter-status`);
  if (html) converterStatusObj.html(html);

  if (colorClass) {
    let allColorClasses = converterStatusObj
      .attr("class")
      .split(" ")
      .filter((val) => {
        if (/mdui-text-color/.test(val)) return true;
      });
    converterStatusObj.removeClass(...allColorClasses);
    converterStatusObj.addClass(colorClass);
  }
}

function modifyOpButton(trId, html, disabled) {
  if (!trId) return;
  let opButtonObj = $$(`#${trId} .operations button`);
  if (html) opButtonObj.html(html);
  if (disabled == undefined) return;
  else opButtonObj.prop("disabled", disabled);
}

function deleteOpButton(trId) {
  $$(`#${trId} .operations`).empty();
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
