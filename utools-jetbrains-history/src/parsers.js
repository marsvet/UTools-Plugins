let parsers = [];

parsers[0] = (data) => {
  let history = data.application.component[0].option[0].map[0].entry.map(
    (item) => {
      return {
        projectPath: item.$.key.replace("$USER_HOME$", utools.getPath("home")),
        openTimestamp: item.value[0].RecentProjectMetaInfo[0].option[4].$.value,
      };
    }
  );
  return history;
};

parsers[1] = (data) => {
  let history = data.application.component[0].option[4].map[0].entry.map(
    (item) => {
      return {
        projectPath: item.$.key.replace("$USER_HOME$", utools.getPath("home")),
        openTimestamp: item.value[0].RecentProjectMetaInfo[0].option[4].$.value,
      };
    }
  );
  return history;
};

module.exports = {
  getParsers() {
    return parsers;
  },
};
