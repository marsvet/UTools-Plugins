const path = require("path");
const fs = require("fs");
const originalFs = require("original-fs");
const xml2js = require("xml2js");
const { exec } = require("child_process");
const util = require("./util");
const db = require("./db");
const parsers = require("./parsers").getParsers();

/**
 * 插件载入完成后调用
 */
utools.onPluginReady(() => {
  // 第一次安装时
  if (!db.dbExisted()) {
    db.initDB();
    util.displayReadme();
  }

  // 插件更新时
  if (db.pluginUpdated()) {
    db.updatePluginVersion();
    db.fixDB();
    util.displayChangeLog();
  }
});

/*******************
 * 打开历史项目的功能 *
 *******************/
let allHistory = [];

function getHistory() {
  allHistory = [];

  db.getSoftwareSettings().forEach((sf, index) => {
    if (sf.recent == "未设置") return; // 未设置路径的直接跳过
    try {
      let stat = originalFs.statSync(sf.recent);
      if (stat.isDirectory()) throw new Error();
    } catch (err) {
      utools.showNotification(`${sf.name} 的 recentProjects.xml 文件路径错误`);
      return;
    }

    let content = fs.readFileSync(sf.recent); // 读取 recentProjects.xml 文件
    xml2js.parseString(content, { async: false }, (err, data) => {
      let history = [];
      // 循环尝试解析函数
      parsers.forEach((parser, parserIndex) => {
        if (history.length != 0) return;
        try {
          history = parser(data);
          history.map((item) => {
            item.icon = sf.icon;
            item.index = index; // 用哪个软件打开
          });
          allHistory.push(...history);
        } catch (err) {
          // 如果最后一个解析函数也解析失败，提示错误并返回
          if (parserIndex == parsers.length - 1)
            utools.showNotification(`${sf.name} 的 recentProjects.xml 文件解析错误`);
          else return;
        }
      });
    });
  });

  allHistory = allHistory
    .sort((item1, item2) => item2.openTimestamp - item1.openTimestamp)
    .map((item) => {
      item.title = path.basename(item.projectPath);
      item.description = item.projectPath;
      return item;
    });
}

let JetHistory = {
  mode: "list",
  args: {
    enter: (action, callbackSetList) => {
      getHistory();
      callbackSetList(allHistory);
    },

    search: (action, searchWord, callbackSetList) => {
      if (!searchWord) return callbackSetList();
      return callbackSetList(allHistory.filter((x) => x.title.toLowerCase().indexOf(searchWord.toLowerCase()) !== -1
          || x.description.toLowerCase().indexOf(searchWord.toLowerCase()) !== -1));
    },

    select: (action, itemData) => {
      let cmd = db.getSoftwareSettings()[itemData.index].startup;
      if (cmd == "未设置") {
        utools.showNotification("未设置可执行程序路径");
        return;
      }
      try {
        let stat = originalFs.statSync(cmd);
        if (stat.isDirectory()) throw new Error();
      } catch (err) {
        utools.showNotification("可执行程序路径错误");
        return;
      }

      let args = itemData.description;
      try {
        originalFs.statSync(args);
      } catch (err) {
        utools.showNotification("该项目不存在");
        return;
      }

      let command = `"${cmd}" "${args}"`;
      exec(command, (err) => {
        if (err) utools.showNotification("不是有效的可执行程序");
      }); // 这种命令必须异步执行

      utools.outPlugin();
      utools.hideMainWindow();
    },
  },
};
/*******************
 * 打开历史项目的功能 *
 *******************/

/***********
 * 设置功能 *
 ***********/
let inputedPath = ""; // 设置路径时，暂存用户的输入
let pathSettingList = [];

let JetSettings = {
  mode: "list",
  args: {
    enter: (action, callbackSetList) => {
      pathSettingList = [];

      if (action.type == "files") {
        setTimeout(() => {
          utools.setSubInputValue(action.payload[0].path);
        }, 300);
      }

      db.getSoftwareSettings().forEach((sf, index) => {
        let item1 = {
          title: `设置为 ${sf.name} 的 recentProjects.xml 文件路径`,
          description: sf.recent,
          icon: sf.icon,
          type: "recent",
          index,
        };
        let item2 = {
          title: `设置为 ${sf.name} 的可执行程序路径`,
          description: sf.startup,
          icon: sf.icon,
          type: "startup",
          index,
        };
        pathSettingList.push(item1);
        pathSettingList.push(item2);
      });

      callbackSetList(pathSettingList);
    },

    search: (action, searchWord, callbackSetList) => {
      inputedPath = searchWord;
      return callbackSetList(pathSettingList.filter((x) => true));
    },

    select: (action, itemData) => {
      if (!inputedPath) return;
      try {
        let stat = originalFs.statSync(inputedPath);
        if (stat.isDirectory()) {
          utools.showNotification("不能是目录路径");
          return;
        }
      } catch (err) {
        utools.showNotification("无效路径");
        return;
      }

      utools.setSubInputValue("");
      db.updateSoftwareSettings(inputedPath, itemData.index, itemData.type);

      // 如果修改的是第一项，手动修改界面
      if (itemData.index == 0 && itemData.type == "recent") {
        document.querySelector(".list-item-description").innerHTML = inputedPath;
      }

      if (itemData.type === "recent") pathSettingList[itemData.index * 2].description = inputedPath;
      else pathSettingList[itemData.index * 2 + 1].description = inputedPath;
    },

    placeholder: "输入文件路径，选择设置项，按回车或鼠标左键进行设置",
  },
};
/***********
 * 设置功能 *
 ***********/

/**
 * 导出
 */
window.exports = {
  JetHistory,
  JetSettings,
};
