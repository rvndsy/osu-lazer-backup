class Organizer {
  constructor() {
    this.readFilePath = null;
    this.data = null;
    this.setDefaultPath();
  }

  async setDefaultPath() {
    try {
      const defaultPath = await window.backupAPI.getDefaultPath();
      this.setReadFilePath(defaultPath);
    } catch (error) {
      console.error("Failed to get platform info:", error);
    }
  }

  getReadFilePath() {
    return this.readFilePath;
  }

  setReadFilePath(filePath) {
    if (!filePath) return;
    this.readFilePath = filePath;
    document.getElementById("selected-file-path").innerText = filePath;
    document.getElementById("fetch-data-btn").disabled = false;
  }

  getData() {
    return this.data;
  }

  setData(data) {
    if (!data) return;
    this.data = data;
    document.getElementById("download-button").disabled = false;
    document.getElementById("fetch-data-msg").innerText = "Backup file ready.";
  }
}
