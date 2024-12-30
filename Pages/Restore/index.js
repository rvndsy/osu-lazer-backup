const organizer = new Organizer();

document.getElementById("back-to-main").addEventListener("click", function () {
  window.location.href = "../../index.html";
});

document
  .getElementById("select-backup-file-btn")
  .addEventListener("click", async function () {
    try {
      const filePath = await window.restoreAPI.openFileDialog();

      if (!filePath) return;
      try {
        const data = await window.restoreAPI.readJsonFile(filePath);
        organizer.setBackupData(data);
      } catch (error) {
        alert("Failed to read JSON file:", error);
      }
    } catch (err) {
      alert("Failed to load backup data.");
    }
  });

document
  .getElementById("select-skip-file-btn")
  .addEventListener("click", async function () {
    try {
      const filePath = await window.restoreAPI.openFileDialog();

      if (!filePath) return;
      try {
        const data = await window.restoreAPI.readJsonFile(filePath);
        organizer.setSkipData(data);
      } catch (error) {
        alert("Failed to read JSON file:", error);
      }
    } catch (err) {
      alert("Failed to load backup data.");
    }
  });

document
  .getElementById("select-save-folder-btn")
  .addEventListener("click", async function () {
    try {
      const folderPath = await window.restoreAPI.openFolderDialog();
      if (!folderPath) return;
      organizer.setSavePath(folderPath);
    } catch (err) {
      alert("Failed to load backup data.");
    }
  });

document
  .getElementById("download-btn")
  .addEventListener("click", async function () {
    const data = organizer.getFinalData();

    data.slice(10, 12).forEach(async (beatmapsetId) => {
      const response = await window.restoreAPI.downloadBeatmapset(beatmapsetId);
    });
  });
