const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("node:path");
const Realm = require("realm");
const fs = require("fs").promises;
const os = require("os");
const axios = require("axios");

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

  ipcMain.handle("read-realm-file", async (_event, filePath) => {
    try {
      const appDir = path.join(__dirname, "app_data");
      const destinationPath = path.join(appDir, "client.realm");
      await fs.mkdir(appDir, { recursive: true });

      await fs.copyFile(filePath, destinationPath);
      const realm = await Realm.open({
        path: destinationPath,
      });
      const beatmapIds = realm
        .objects("Beatmap")
        .map((beatmap) => beatmap.OnlineID);

      realm.close();
      await fs.rm(appDir, { recursive: true, force: true });
      return { data: beatmapIds };
    } catch (err) {
      return { error: "Failed to read the Realm file." };
    }
  });

  ipcMain.handle("show-save-dialog", async (_event, options) => {
    const result = await dialog.showSaveDialog(options);
    return result;
  });

  ipcMain.handle("save-file", async (_event, filePath, content) => {
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
      readFilePath = path.join(process.env.APPDATA, "osu");
    } else if (platform === "darwin") {
      readFilePath = path.join(
        homeDir,
        "Library",
        "Application Support",
        "osu",
      );
    } else if (platform === "linux") {
      readFilePath = path.join(
        homeDir,
        ".local",
        "share",
        "osu",
        "client.realm",
      );
    } else {
      console.error("Unsupported platform");
    }

    return readFilePath;
  });

  ipcMain.handle("restore-open-file-dialog", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Json", extensions: ["json"] }],
    });

    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0];
    } else {
      return null;
    }
  });

  ipcMain.handle("read-json-file", async (_event, filePath) => {
    try {
      const fileContent = await fs.readFile(filePath, "utf8");
      return JSON.parse(fileContent);
    } catch (error) {
      throw new Error("Error reading or parsing the JSON file:", error);
    }
  });

  ipcMain.handle("open-folder-dialog", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });

    if (!result.canceled) {
      return result.filePaths[0];
    } else {
      return null;
    }
  });

  ipcMain.handle("download-beatmapset", async (_event, id) => {
    const response = await axios.get(`https://catboy.best/d/${id}`);
    return response;
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
