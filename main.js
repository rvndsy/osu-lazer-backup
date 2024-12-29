const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("node:path");
const Realm = require("realm");

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("index.html");

  ipcMain.handle("open-file-dialog", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Realm Files", extensions: ["realm"] }],
    });

    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0];
    } else {
      throw new Error("No file selected");
    }
  });

  ipcMain.handle("read-realm-file", async (event, filePath) => {
    try {
      const realm = await Realm.open({
        path: filePath,
      });
      const beatmapIds = realm
        .objects("Beatmap")
        .map((beatmap) => beatmap.OnlineID);
      return { data: beatmapIds };
    } catch (err) {
      return { error: "Failed to read the Realm file." };
    }
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
