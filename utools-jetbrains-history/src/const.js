const fs = require("fs");
const path = require("path");

module.exports = {
  /**
   * pluginInfo.json 文件的内容
   */
  pluginInfo: JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "plugin.json"))
  ),

  /**
   * 软件列表。初始化数据库时使用
   */
  softwares: [
    { name: "IntelliJ IDEA", icon: "icons/intellij-idea.png" },
    { name: "Android Studio", icon: "icons/android-studio.png" },
    { name: "PyCharm", icon: "icons/pycharm.png" },
    { name: "PyCharm Edu", icon: "icons/pycharm-edu.png" },
    { name: "WebStorm", icon: "icons/webstorm.png" },
    { name: "PhpStorm", icon: "icons/phpstorm.png" },
    { name: "GoLand", icon: "icons/goland.png" },
    { name: "AppCode", icon: "icons/AppCode.png" },
    { name: "CLion", icon: "icons/CLion.png" },
    { name: "RubyMine", icon: "icons/rubymine.png" },
  ],
};
