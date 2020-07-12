module.exports = {
  /**
   * 解析 JetBrains 软件 recentProjects.xml 文件的函数
   */
  jetParser(data) {
    let history = data.application.component[0].option[0].map[0].entry.map(
      (item) => {
        return {
          projectPath: item.$.key.replace(
            "$USER_HOME$",
            utools.getPath("home")
          ),
          openTimestamp:
            item.value[0].RecentProjectMetaInfo[0].option[4].$.value,
        };
      }
    );
    return history;
  },

  /**
   * 解析 Android Studio 软件的 recentProjects.xml 文件的函数
   */
  asParser(data) {
    let history = data.application.component[0].option[4].map[0].entry.map(
      (item) => {
        return {
          projectPath: item.$.key.replace(
            "$USER_HOME$",
            utools.getPath("home")
          ),
          openTimestamp:
            item.value[0].RecentProjectMetaInfo[0].option[4].$.value,
        };
      }
    );
    return history;
  },
};
