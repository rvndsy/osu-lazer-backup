class Organizer {
  constructor() {
    this.backupData = null;
    this.skipData = null;
    this.savePath = null;
  }

  setBackupData(data) {
    this.backupData = data;
    document.getElementById("select-save-folder-btn").disabled = false;

    document.getElementById("backup-label").innerText =
      `Found ${data.length} beatmapIds`;
  }

  setSkipData(data) {
    this.skipData = data;
    document.getElementById("skip-label").innerText =
      `Found ${data.length} beatmapIds`;
  }

  setSavePath(path) {
    this.savePath = path;
    document.getElementById("download-btn").disabled = false;
    document.getElementById("save-folder-label").innerText =
      `Beatmaps will be downloaded to ${path}`;
  }

  getFinalData() {
    if (this.skipData) {
      return this.backupData.filter((item) => !this.skipData.includes(item));
    }
    return this.backupData;
  }
}
