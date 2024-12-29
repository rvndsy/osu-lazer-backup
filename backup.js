document.getElementById("back-to-main").addEventListener("click", function () {
  window.location.href = "index.html";
});

document
  .getElementById("read-backup")
  .addEventListener("click", async function () {
    try {
      const filePath = await window.backupAPI.openFileDialog();
      const { data, error } = await window.backupAPI.readRealmFile(filePath);
      if (error) {
        throw new Error(error);
      }

      console.log("Fetched data:", data);
    } catch (err) {
      console.error("Error reading the backup file:", err);
      alert("Failed to load backup data.");
    }
  });
