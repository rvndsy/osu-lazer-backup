class Organizer {
  constructor() {
    this.started = false;
    this.backupData = null;
    this.skipData = null;
    this.savePath = null;
    this.remainings = [];
    this.cursor = 0;
  }

  start() {
    this.started = true;
    document.getElementById("stop-btn").disabled = false;
    this.disableAll();
  }

  disableAll() {
    const ids = [
      "select-backup-file-btn",
      "select-skip-file-btn",
      "select-save-folder-btn",
      "download-btn",
    ];

    ids.forEach((id) => (document.getElementById(id).disabled = true));
  }

  enableAll() {
    const ids = [
      "select-backup-file-btn",
      "select-skip-file-btn",
      "select-save-folder-btn",
      "download-btn",
    ];

    ids.forEach((id) => (document.getElementById(id).disabled = false));
  }

  stop(stopMsg, err = true) {
    organizer.generateRemainingsFile();
    this.started = false;
    addDownloadInfo(stopMsg, err);
    document.getElementById("stop-btn").disabled = true;
    document.getElementById("download-file-btn").disabled = false;
    this.enableAll();
  }

  isStarted() {
    return this.started;
  }

  setCursor(data) {
    this.cursor = data;
  }

  generateRemainingsFile() {
    const { data } = this.getFinalData();
    this.remainings = data.slice(this.cursor);
    document.getElementById("remaining-label").innerText =
      `Found ${this.remainings.length} beatmapIds.`;
  }

  getRemainings() {
    return this.remainings;
  }

  setBackupData(data) {
    this.backupData = [...new Set(data.filter((item) => item >= 0))];
    document.getElementById("select-save-folder-btn").disabled = false;

    document.getElementById("backup-label").innerText =
      `Found ${this.backupData.length} beatmapIds`;
  }

  setSkipData(data) {
    this.skipData = [...new Set(data.filter((item) => item >= 0))];
    document.getElementById("skip-label").innerText =
      `Found ${this.skipData.length} beatmapIds`;
  }

  setSavePath(path) {
    this.savePath = path;
    document.getElementById("download-btn").disabled = false;
    document.getElementById("save-folder-label").innerText =
      `Beatmaps will be downloaded to ${path}`;
  }

  getFinalData() {
    let result = this.backupData;
    if (this.skipData) {
      result = this.backupData.filter((item) => !this.skipData.includes(item));
    }
    return { data: result, totalNum: result.length };
  }

  getSavePath() {
    return this.savePath;
  }
}
