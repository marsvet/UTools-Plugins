const path = require("path");
const fs = require("fs");

let indexes = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./indexes.json"), "utf-8").toString()
);

window.exports = {
  gitignore_generator: {
    mode: "list",
    args: {
      enter: (action, callbackSetList) => {
        callbackSetList(indexes);
      },
      search: (action, searchWord, callbackSetList) => {
        if (!searchWord) return callbackSetList();
        searchWord = searchWord.toLowerCase();
        return callbackSetList(
          indexes.filter((x) => x.title.toLowerCase().indexOf(searchWord) != -1)
        );
      },
      select: (action, itemData) => {
        window.utools.hideMainWindow();

        let currentFolderPath = utools.getCurrentFolderPath();
        let savedPath;
        if (currentFolderPath)
          savedPath = path.join(currentFolderPath, ".gitignore");
        else
          savedPath = utools.showSaveDialog({
            defaultPath: ".gitignore",
            title: "保存文件",
          });

        if (savedPath) {
          let source = path.join(
            __dirname,
            "gitignore",
            itemData.title + ".gitignore"
          );
          let readStream = fs.createReadStream(source);
          let writeStream = fs.createWriteStream(savedPath);
          readStream.on("error", (err) => {
            utools.showNotification(err);
          });
          writeStream.on("error", (err) => {
            utools.showNotification(err);
          });
          readStream.pipe(writeStream); // 直接拷贝文件会把权限信息也拷贝过来，所以改为这样写，新文件会使用默认权限
        }

        utools.outPlugin();
      },
    },
  },
};
