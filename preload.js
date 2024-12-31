const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("backupAPI", {
  openFileDialog: () => ipcRenderer.invoke("open-file-dialog"),
  readRealmFile: (filePath) => ipcRenderer.invoke("read-realm-file", filePath),
  showSaveDialog: (options) => ipcRenderer.invoke("show-save-dialog", options),
  saveFile: (filePath, content) =>
    ipcRenderer.invoke("save-file", filePath, content),
  getDefaultPath: () => ipcRenderer.invoke("get-default-path"),
});

contextBridge.exposeInMainWorld("restoreAPI", {
  openFileDialog: () => ipcRenderer.invoke("restore-open-file-dialog"),
  readJsonFile: (filePath) => ipcRenderer.invoke("read-json-file", filePath),
  openFolderDialog: () => ipcRenderer.invoke("open-folder-dialog"),
  downloadBeatmapset: (id, savePath) =>
    ipcRenderer.invoke("download-beatmapset", id, savePath),
  getRateLimits: () => ipcRenderer.invoke("get-rate-limits"),
});
