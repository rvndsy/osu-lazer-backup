const organizer = new Organizer();

document.getElementById("back-to-main").addEventListener("click", function () {
  window.location.href = "../../index.html";
});

document
  .getElementById("read-backup")
  .addEventListener("click", async function () {
    try {
      const filePath = await window.backupAPI.openFileDialog();

      if (!filePath) return;

      const { data, error } = await window.backupAPI.readRealmFile(filePath);
      if (error) {
        throw new Error(error);
      }

      organizer.setReadFilePath(filePath);
      organizer.setData(data);
    } catch (err) {
      alert("Failed to load backup data.");
    }
  });

document
  .getElementById("download-button")
  .addEventListener("click", async function () {
    try {
      const { filePath, canceled } = await window.backupAPI.showSaveDialog({
        title: "Save Backup Data",
        defaultPath: "backup-data.json",
        filters: [{ name: "JSON Files", extensions: ["json"] }],
      });

      if (canceled || !filePath) return;

      await window.backupAPI.saveFile(
        filePath,
        JSON.stringify(organizer.getData(), null, 2),
      );

      document.getElementById("message").innerText =
        `Backup file has been downloaded to ${filePath}`;
    } catch (err) {
      alert("Failed to save backup data.");
    }
  });
