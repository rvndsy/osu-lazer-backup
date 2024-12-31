const organizer = new Organizer();

document.getElementById("back-to-main").addEventListener("click", function () {
  window.location.href = "../../index.html";
});

async function openJsonFileAndSetData(action) {
  try {
    const filePath = await window.restoreAPI.openFileDialog();
    if (!filePath) return;
    try {
      const data = await window.restoreAPI.readJsonFile(filePath);
      action(data);
    } catch (error) {
      addDownloadInfo(`Failed to read JSON file: ${error.message}`, true);
    }
  } catch (err) {
    addDownloadInfo(`Failed to load data: ${err.message}`, true);
  }
}

addClickEvent("backup-file-btn", () =>
  openJsonFileAndSetData((data) => organizer.setBackupData(data)),
);

addClickEvent("skip-file-btn", () =>
  openJsonFileAndSetData((data) => organizer.setSkipData(data)),
);

addClickEvent("save-folder-btn", async function () {
  try {
    const folderPath = await window.restoreAPI.openFolderDialog();
    if (!folderPath) return;
    organizer.setSavePath(folderPath);
  } catch (err) {
    alert(err);
  }
});

addClickEvent("stop-btn", function () {
  organizer.stop("Stopped.");
});

addClickEvent("download-file-btn", async function () {
  try {
    const { filePath, canceled } = await window.backupAPI.showSaveDialog({
      title: "Save Remaining Data",
      defaultPath: "remaining-data.json",
      filters: [{ name: "JSON Files", extensions: ["json"] }],
    });

    if (canceled || !filePath) return;

    await window.backupAPI.saveFile(
      filePath,
      JSON.stringify(organizer.getRemainings(), null, 2),
    );

    addDownloadInfo(`Remaining file has been downloaded to ${filePath}`);
  } catch (err) {
    alert("Failed to save backup data.");
  }
});

addClickEvent("download-btn", async function () {
  organizer.start();
  const { data, totalNum } = organizer.getFinalData();
  const savePath = organizer.getSavePath();
  let rateLimit = 120;

  for (const [index, id] of data.entries()) {
    organizer.setCursor(index);
    if (!organizer.isStarted()) {
      return;
    }
    if (!(index % 200)) {
      const stop = await checkDailyLimit();
      if (stop) return;
    }
    if (rateLimit <= 0) {
      addDownloadInfo("Reached the api limit. Waiting for 60 seconds.", true);
      await sleep(60);
    }
    const res = await window.restoreAPI.downloadBeatmapset(id, savePath);
    if (res.status == 200) {
      rateLimit = res.rateLimitRemaining;
    }
    handleApiResponse(res, id, index, totalNum);

    await sleep(1);
  }
  organizer.stop("Completed", false);
});

function sleep(s) {
  return new Promise((resolve) => setTimeout(resolve, 1000 * s));
}

function addDownloadInfo(text, isError = false) {
  const container = document.getElementById("download-info-container");
  const p = document.createElement("p");
  p.innerText = text;
  isError && p.classList.add("err-text");
  container.appendChild(p);
  container.scrollTop = container.scrollHeight;
}

async function checkDailyLimit() {
  const { status, downloadCount } = await window.restoreAPI.getRateLimits();
  if (status !== 200) {
    const stopMsg = `Unable to reach the server. Save your remaining beatmaps and try later.`;

    organizer.stop(stopMsg);
    return true;
  }
  document.getElementById("rate-limit-day-label").innerText =
    `${downloadCount} / 2000 (/day)`;
  if (downloadCount > 1600) {
    const stopMsg =
      "You are about to exceed daily api limit. Save your remaining beatmaps and continue tomorrow.";

    organizer.stop(stopMsg);
    return true;
  }
  return false;
}

function addClickEvent(id, func) {
  document.getElementById(id).addEventListener("click", func);
}

function handleApiResponse(response, id, index, totalData) {
  if (response.status === 200) {
    addDownloadInfo(
      `Id ${id} successfully downloaded. ${index + 1}/${totalData}`,
    );
  } else if (response.status === 404) {
    addDownloadInfo(`Skipping id ${id}. No beatmapset found.`, true);
  } else {
    organizer.stop(
      "Unable to reach the server. Save your remaining beatmaps and try later.",
    );
    throw new Error("Server unreachable");
  }
}
