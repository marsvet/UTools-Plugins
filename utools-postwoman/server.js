const http = require("http");
const express = require("express");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "./postwoman")));

const httpServer = http.createServer(app);

module.exports = {
  startServer: function (port) {
    return new Promise((resolve, reject) => {
      try {
        httpServer.listen(port).on("error", function (e) {
          reject(e);
        });
      } catch (e) {
        reject(e);
      }
      httpServer.on("listening", resolve);
    });
  },

  stopServer: function () {
    if (!this.isServerStarted()) {
      return;
    }
    return new Promise((resolve, reject) => {
      httpServer.close(function (error) {
        if (error !== undefined && error instanceof Error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  },

  isServerStarted: function () {
    return httpServer.listening;
  },
};
