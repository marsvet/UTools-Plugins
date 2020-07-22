const server = require("./server");

const port = 6420;
const display = utools.getPrimaryDisplay();

window.exports = {
  postwoman: {
    mode: "none",
    args: {
      enter: () => {
        if (!server.isServerStarted()) {
          server.startServer(port);

          let timer = setInterval(() => {
            let ubrowsers = utools.getIdleUBrowsers();
            if (ubrowsers.length == 0 && server.isServerStarted()) {
              server.stopServer();
              clearInterval(timer);
            }
          }, 5000);
        }

        utools.ubrowser.goto(`http://localhost:${port}`).run({
          width: Math.round(display.workAreaSize.width / 1.1),
          height: Math.round(display.workAreaSize.height / 1.1),
        });

        utools.hideMainWindow();
        utools.outPlugin();
      },
    },
  },
};
