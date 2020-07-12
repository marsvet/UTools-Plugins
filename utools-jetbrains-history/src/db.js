const cst = require("./const");

module.exports = {
  /**
   * 判断数据库中是否有数据（是否第一次安装该插件）
   */
  dbExisted() {
    let versionInDBObj = utools.db.get("pluginVersion");
    if (versionInDBObj) return true;
    else return false;
  },

  /**
   * 初始化数据库
   */
  initDB() {
    utools.db.put({
      _id: "pluginVersion",
      pluginVersion: "0.0.0",
    });

    let softwares = cst.softwares;
    softwares.forEach((sf) => {
      sf["recent"] = "未设置";
      sf["startup"] = "未设置";
    });

    utools.db.put({
      _id: "pluginSettings",
      softwares,
    });
  },

  /**
   * 判断插件是否更新了
   */
  pluginUpdated() {
    let versionInDB = utools.db.get("pluginVersion").pluginVersion;
    let versionInPluginInfo = cst.pluginInfo.version;
    if (versionInDB === versionInPluginInfo) return false;
    else return true;
  },

  /**
   * 更新数据库中插件的版本号
   */
  updatePluginVersion() {
    let doc = utools.db.get("pluginVersion");
    doc.pluginVersion = cst.pluginInfo.version;
    utools.db.put(doc);
  },

  /**
   * 获取数据库中所有软件配置
   */
  getSoftwareSettings() {
    let pluginSettings = utools.db.get("pluginSettings");
    return pluginSettings.softwares;
  },

  /**
   * 更新数据库中的软件配置
   */
  updateSoftwareSettings(newPath, index, type) {
    let pluginSettings = utools.db.get("pluginSettings");
    if (type === "recent") pluginSettings.softwares[index].recent = newPath;
    else pluginSettings.softwares[index].startup = newPath;
    utools.db.put(pluginSettings);
  },

  /**
   * 清空数据库（调试时使用）
   */
  clearDB() {
    utools.db.remove("pluginVersion");
    utools.db.remove("pluginSettings");
  },

  /**
   * 插件更新后用来修正数据库的代码
   */
  fixDB() {
    let softwares = cst.softwares;
    let dbSfNames = this.getSoftwareSettings().map((item) => item.name);
    let newSfs = [];
    softwares.forEach((sf) => {
      if (dbSfNames.indexOf(sf.name) == -1) {
        sf.recent = "未设置";
        sf.startup = "未设置";
        newSfs.push(sf);
      }
    });
    let pluginSettings = utools.db.get("pluginSettings");
    pluginSettings.softwares.push(...newSfs);
    utools.db.put(pluginSettings);
  },
};
