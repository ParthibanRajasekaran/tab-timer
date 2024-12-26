// Utility function to format milliseconds into HH:MM:SS
function formatDuration(ms) {
  if (!ms) return "00:00:00";

  const seconds = Math.floor(ms / 1000) % 60;
  const minutes = Math.floor(ms / (1000 * 60)) % 60;
  const hours = Math.floor(ms / (1000 * 60 * 60));

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// Dynamically update the popup
function updatePopup() {
  const activeTabInfoDiv = document.getElementById("activeTabInfo");

  // Fetch data from chrome.storage.local
  chrome.storage.local.get(["activeTabId", "tabStartTimes"], (data) => {
    const activeTabId = data.activeTabId;
    const tabStartTimes = data.tabStartTimes || {};

    // Handle cases where no active tab is detected
    if (!activeTabId) {
      activeTabInfoDiv.innerHTML =
        "<p class='info'>No active tab or timer not started yet.</p>";
      return;
    }

    // Handle case where the tab was opened before the extension was enabled
    if (!tabStartTimes[activeTabId]) {
      activeTabInfoDiv.innerHTML = `
        <p class='info'>This tab was opened before the extension was enabled.</p>
        <button id="refreshButton" class="btn">Refresh Tab</button>
      `;

      // Add event listener to the refresh button (ensure no duplicate listeners)
      const refreshButton = document.getElementById("refreshButton");
      if (refreshButton && !refreshButton.dataset.listenerAttached) {
        refreshButton.addEventListener("click", () => {
          chrome.tabs.reload(activeTabId);
        });
        refreshButton.dataset.listenerAttached = "true"; // Mark listener as attached
      }
      return;
    }

    // Calculate elapsed time
    const startTime = tabStartTimes[activeTabId];
    const elapsedMs = Date.now() - startTime;

    // Display the elapsed time
    activeTabInfoDiv.innerHTML = `
      <p class="info"><strong>Active Tab Timer</strong></p>
      <p class="info">Tab ID: ${activeTabId}</p>
      <p class="time">Elapsed Time: ${formatDuration(elapsedMs)}</p>
    `;
  });
}

// Set up the dynamic timer
document.addEventListener("DOMContentLoaded", () => {
  // Update the popup UI every second
  setInterval(updatePopup, 1000);
});

// Export for testing
module.exports = {
  updatePopup,
  formatDuration,
};