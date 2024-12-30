const organizer = new Organizer();

document.getElementById("back-to-main").addEventListener("click", function () {
  window.location.href = "../../index.html";
});

document
  .getElementById("select-file-btn")
  .addEventListener("click", async function () {
    try {
      const filePath = await window.backupAPI.openFileDialog();

      if (!filePath) return;

      organizer.setReadFilePath(filePath);
    } catch (err) {
      alert("Failed to load backup data.");
    }
  });

document
  .getElementById("fetch-data-btn")
  .addEventListener("click", async function () {
    try {
      const filePath = organizer.getReadFilePath();

      document.getElementById("fetch-data-msg").innerText =
        "Preparing Backup File";

      const { data, error } = await window.backupAPI.readRealmFile(filePath);
      if (error) {
        throw new Error(error);
      }

      organizer.setData(data);
    } catch (err) {
      document.getElementById("fetch-data-msg").innerText =
        err +
        "\nCheck the given path and make sure provided file is not corrupted.";
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
