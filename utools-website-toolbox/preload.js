const fs = require("fs");
const path = require("path");

window.pluginInfo = JSON.parse(
  fs.readFileSync(path.join(__dirname, "plugin.json"))
);

/**
 * 判断插件是否更新了。如果更新了，就修改数据库中的 pluginVersion，并返回 true
 */
window.pluginUpdated = () => {
  let versionInDBObj = utools.db.get("pluginVersion");
  let versionInPluginInfo = pluginInfo.version;
  if (!versionInDBObj) {
    utools.db.put({
      _id: "pluginVersion",
      pluginVersion: versionInPluginInfo,
    });
    return true;
  }
  let versionInDB = versionInDBObj.pluginVersion;
  if (versionInDB === versionInPluginInfo) return false;
  else return true;
};

/**
 * 当插件更新后调用，目的是根据 tools.json 更新数据库中的 tools
 */
window.updateDB = () => {
  const toolsInJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, "tools.json"))
  );

  for (let toolInJson of toolsInJson) {
    let toolInDB = utools.db.get("tool:" + toolInJson.code);

    let newToolData = {};
    newToolData["_id"] = "tool:" + toolInJson.code; // 在 id 前加上 tool: 方便查询
    for (let key in toolInJson) newToolData[key] = toolInJson[key];
    if (toolInDB) {
      newToolData["enabled"] = toolInDB["enabled"];
      newToolData["_rev"] = toolInDB["_rev"];
      utools.db.put(newToolData);
    } else {
      newToolData["enabled"] = false; // 默认不开启
      utools.db.put(newToolData);
    }
  }
};

/**
 * 打开开关时调用
 */
window.enableTool = (code) => {
  let tool = utools.db.get("tool:" + code);
  utools.setFeature({
    code: tool.code,
    explain: tool.explain,
    icon: path.join("assets", "logo", tool.logo), // 这里不能是绝对路径，绝对路径不起作用
    cmds: tool.cmds,
  });
  tool["enabled"] = true;
  utools.db.put(tool);
};

/**
 * 关闭开关时调用
 */
window.disableTool = (code) => {
  let tool = utools.db.get("tool:" + code);
  utools.removeFeature(tool.code);
  tool["enabled"] = false;
  utools.db.put(tool);
};

/**
 * 根据 code 读取其对应的 css 文件并返回
 */
window.getCssCode = (code) => {
  let cssCodePath = path.join(__dirname, "website", code, "style.css");
  let cssCode;
  if (fs.existsSync(cssCodePath))
    cssCode = fs.readFileSync(cssCodePath, "utf-8");
  else cssCode = "";
  return cssCode;
};

/**
 * 根据 code 读取其对应的 js 文件并返回
 */
window.getJsCode = (code) => {
  let jsCodePath = path.join(__dirname, "website", code, "index.js");
  let jsCode;
  if (fs.existsSync(jsCodePath)) jsCode = fs.readFileSync(jsCodePath, "utf-8");
  else jsCode = "";
  return jsCode;
};

/**
 * 读取所有网站通用的 js 代码
 */
window.getGenericJsCode = () => {
  let genericJsCodePath = path.join(__dirname, "website", "index.js");
  let genericJsCode;
  if (fs.existsSync(genericJsCodePath))
    genericJsCode = fs.readFileSync(genericJsCodePath, "utf-8");
  else genericJsCode = "";
  return genericJsCode;
};

/**
 * 渲染 js 代码
 * varObj 是一个对象：{ key: value }。js 代码中的 {{ key }} 会被替换为 value
 */
window.renderJsCode = (jsCode, varObj) => {
  let renderedJsCode;
  for (let key in varObj) {
    let regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    renderedJsCode = jsCode.replace(regex, varObj[key]);
  }
  return renderedJsCode;
};

utools.onPluginReady(() => {
  if (window.pluginUpdated()) window.updateDB();
});
