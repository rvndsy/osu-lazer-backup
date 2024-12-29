class Organizer {
  constructor() {
    this.readFilePath = null;
    this.data = null;
    this.setDefaultPath();
  }

  async setDefaultPath() {
    try {
      const defaultPath = await window.backupAPI.getDefaultPath();
      console.log(defaultPath);
    } catch (error) {
      console.error("Failed to get platform info:", error);
    }
  }

  getReadFilePath() {
    return this.readFilePath;
  }

  setReadFilePath(filePath) {
    this.readFilePath = filePath;
    document.getElementById("selected-file-path").innerText = filePath;
  }

  getData() {
    return this.data;
  }

  setData(data) {
    this.data = data;
    document.getElementById("download-button").disabled = false;
  }
}
