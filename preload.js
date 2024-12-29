const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("backupAPI", {
  openFileDialog: () => ipcRenderer.invoke("open-file-dialog"),
  readRealmFile: (filePath) => ipcRenderer.invoke("read-realm-file", filePath),
});
