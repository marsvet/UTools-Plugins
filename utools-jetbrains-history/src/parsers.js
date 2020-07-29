let parsers = [];

parsers[0] = (data) => {
  let root = data.application;
  // let component =
  //   root.component[
  //     root.component.findIndex((item) => item.$.name == "RecentProjectsManager") // 获取 name="RecentProjectsManager" 的 component 元素
  //   ];
  let component = root.component[0];
  let option =
    component.option[
      component.option.findIndex((item) => item.$.name == "additionalInfo") // 获取 name="additionalInfo" 的 option 元素
    ];
  let history = option.map[0].entry.map((item) => {
    let options = item.value[0].RecentProjectMetaInfo[0].option;
    return {
      projectPath: item.$.key.replace("$USER_HOME$", utools.getPath("home")), // "$USER_HOME$" 得替换成用户的家目录
      openTimestamp: options[options.findIndex((item) => item.$.name == "projectOpenTimestamp")].$.value, // 获取 name="projectOpenTimestamp" 的 option 元素的 value 值
    };
  });
  return history;
};

module.exports = {
  getParsers() {
    return parsers;
  },
};
