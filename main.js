const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("node:path");
const Realm = require("realm");
const fs = require("fs").promises;
const os = require("os");

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
      return null;
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

  ipcMain.handle("show-save-dialog", async (event, options) => {
    const result = await dialog.showSaveDialog(options);
    return result;
  });

  ipcMain.handle("save-file", async (event, filePath, content) => {
    try {
      await fs.writeFile(filePath, content, "utf8");
      return { success: true };
    } catch (error) {
      throw new Error("Failed to save the file.");
    }
  });

  ipcMain.handle("get-default-path", async () => {
    const platform = os.platform();
    const homeDir = os.homedir();
    let readFilePath = "";

    if (platform === "win32") {
      readFilePath = path.join(process.env.APPDATA, "osu", "files");
    } else if (platform === "darwin") {
      readFilePath = path.join(
        homeDir,
        "Library",
        "Application Support",
        "osu",
        "files",
      );
    } else if (platform === "linux") {
      readFilePath = path.join(homeDir, ".local", "share", "osu", "files");
    } else {
      console.error("Unsupported platform");
    }

    return readFilePath;
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
