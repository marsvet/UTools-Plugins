const fs = require("fs");
const path = require("path");

module.exports = {
  /**
   * 弹出 ubrowser 显示 README
   */
  displayReadme() {
    let mdText = fs.readFileSync(path.join(__dirname, "..", "README.md")).toString();
    utools.ubrowser.goto(mdText, "README").run();
  },

  /**
   * 弹出 ubrowser 显示 CHANGELOG
   */
  displayChangeLog() {
    let mdText = fs.readFileSync(path.join(__dirname, "..", "CHANGELOG.md")).toString();
    utools.ubrowser.goto(mdText, "更新日志").run();
  }
};
