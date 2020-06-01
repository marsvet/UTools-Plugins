/**
 * 生成工具列表的 html 代码
 */
function genToolLists() {
  let allTools = utools.db.allDocs("tool:");
  let toolListsObj = document.querySelector(".tool-lists");

  toolListsObj.innerHTML = ""; // 清空

  let innerTable = `
    <tr>
      <th></th>
      <th>关键字</th>
      <th>说明</th>
      <th>启用</th>
    </tr>`;
  for (let tool of allTools) {
    innerTable += `
      <tr>
        <td>
          <img src="./assets/logo/${tool.logo}" class="logo">
        </td>
        <td>
          <ul class="keyword-lists">
            <li>${tool.cmds.join("</li><li>")}</li>
          </ul>
        </td>
        <td>
          ${tool.explain}
        </td>
        <td>
          <label class="switch">
            <input type="checkbox" onchange="toggleTool(this)" ${
              tool.enabled ? "checked" : ""
            } name="${tool.code}">
            <div class="slider round"></div>
          </label>
        </td>
      </tr>`;
  }

  toolListsObj.innerHTML = innerTable;
}

/**
 * 点击开关时调用
 */
function toggleTool(el) {
  if (el.checked) window.enableTool(el.name);
  else window.disableTool(el.name);
}

utools.onPluginEnter(({ code }) => {
  let keywordInPluginInfo = window.pluginInfo.features[0].code;

  if (code == keywordInPluginInfo) {
    utools.setExpendHeight(543);
    genToolLists();
  } else {
    utools.setExpendHeight(0);

    let tool = utools.db.get("tool:" + code);
    const display = utools.getPrimaryDisplay();
    let initialWidth = tool.windowWidth
      ? tool.windowWidth
      : Math.round(display.workAreaSize.width / 1.1); // 窗口的初始宽度
    let initialHeight = tool.windowHeight
      ? tool.windowHeight
      : Math.round(display.workAreaSize.height / 1.1); // 窗口的初始高度

    let cssCode = window.getCssCode(code);
    let jsCode = window.getJsCode(code);
    let genericJsCode = window.getGenericJsCode();
    let renderedJsCode = window.renderJsCode(genericJsCode, {
      title: tool.title,
    });

    utools.ubrowser
      .goto(tool.url)
      .css(cssCode)
      .evaluate(
        (renderedJsCode, jsCode) => {
          eval(renderedJsCode);
          eval(jsCode);
        },
        renderedJsCode,
        jsCode
      )
      .run({
        width: initialWidth,
        height: initialHeight,
      });

    utools.outPlugin();
  }
});
