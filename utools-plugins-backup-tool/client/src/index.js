let $$ = mdui.JQ;
let localPluginsInfo = [];
let pluginsInfoInDB = [];

function initData() {
  for (let i = 0; i < localPluginsInfo.length; i++) {
    $$("#local-plugins-list tbody").append(
      `<tr><td>${i + 1}</td><td>${localPluginsInfo[i].name}</td><td>${
        localPluginsInfo[i].version
      }</td></tr>`
    );
  }
  for (let i = 0; i < pluginsInfoInDB.length; i++) {
    $$("#db-plugins-list tbody").append(
      `<tr><td>${i + 1}</td><td>${pluginsInfoInDB[i].name}</td><td>${
        pluginsInfoInDB[i].version
      }</td></tr>`
    );
  }
  mdui.updateTables();
}

utools.onPluginReady(() => {
  setTimeout(() => {
    localPluginsInfo = window.getLocalPluginsInfo();
    pluginsInfoInDB = window.getPluginsInfoFromDB();
    initData();
  }, 500);

  $$("#backup-button").on("click", () => {
    $$("#backup-spinner").removeClass("mdui-invisible");
    window.backupPlugins(localPluginsInfo, (percentage) => {
      $$("#backup-progress").css("width", percentage + "%");
      if (percentage == 100) {
        $$("#backup-spinner").addClass("mdui-invisible");
      }
    });
  });

  $$("#restore-button").on("click", () => {
    $$("#restore-spinner").removeClass("mdui-invisible");
    window.restorePlugins(pluginsInfoInDB, (percentage) => {
      $$("#restore-progress").css("width", percentage + "%");
      if (percentage == 100) {
        $$("#restore-spinner").addClass("mdui-invisible");
      }
    });
  });
});
