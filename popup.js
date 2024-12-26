// Utility function to format milliseconds into HH:MM:SS
function formatDuration(ms) {
  if (!ms) return "00:00:00";

  let seconds = Math.floor(ms / 1000);
  let minutes = Math.floor(seconds / 60);
  seconds %= 60;
  let hours = Math.floor(minutes / 60);
  minutes %= 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// Dynamically update the popup
function updatePopup() {
  const activeTabInfoDiv = document.getElementById("activeTabInfo");

  // Get the active tab ID and start times
  chrome.storage.local.get(["activeTabId", "tabStartTimes"], (data) => {
    const activeTabId = data.activeTabId;
    const tabStartTimes = data.tabStartTimes || {};

    // Handle cases where no active tab or start time is missing
    if (!activeTabId) {
      activeTabInfoDiv.innerHTML =
        "<p class='info'>No active tab or timer not started yet.</p>";
      return;
    }

    if (!tabStartTimes[activeTabId]) {
      activeTabInfoDiv.innerHTML = `
        <p class='info'>This tab was opened before the extension was enabled.</p>
        <button id="refreshButton">Refresh Tab</button>
      `;

      // Add event listener for the refresh button
      document.getElementById("refreshButton").addEventListener("click", () => {
        chrome.tabs.reload(activeTabId);
      });

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
  // Update the timer every second
  setInterval(updatePopup, 1000);
});

// Add this at the end of popup.js
module.exports = {
  updatePopup,
  formatDuration, 
};