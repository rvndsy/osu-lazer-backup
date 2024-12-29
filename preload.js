const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("backupAPI", {
  openFileDialog: () => ipcRenderer.invoke("open-file-dialog"),
  readRealmFile: (filePath) => ipcRenderer.invoke("read-realm-file", filePath),
  showSaveDialog: (options) => ipcRenderer.invoke("show-save-dialog", options),
  saveFile: (filePath, content) =>
    ipcRenderer.invoke("save-file", filePath, content),
  getDefaultPath: () => ipcRenderer.invoke("get-default-path"),
});
