// Initialize storage when the extension is loaded
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ tabStartTimes: {}, activeTabId: null });
});

// Track tab creation and set the start time
chrome.tabs.onCreated.addListener((tab) => {
  const now = Date.now();

  chrome.storage.local.get({ tabStartTimes: {} }, (data) => {
    const tabStartTimes = data.tabStartTimes || {};
    tabStartTimes[tab.id] = now;

    chrome.storage.local.set({ tabStartTimes }, () => {
      if (chrome.runtime.lastError) {
        console.error("Failed to save tab start time:", chrome.runtime.lastError);
      }
    });
  });
});

// Update the active tab when the user switches tabs
chrome.tabs.onActivated.addListener((activeInfo) => {
  const now = Date.now();

  chrome.storage.local.get({ tabStartTimes: {}, activeTabId: null }, (data) => {
    const tabStartTimes = data.tabStartTimes || {};
    const activeTabId = activeInfo.tabId;

    // Set the start time for the new active tab if not already set
    if (!tabStartTimes[activeTabId]) {
      tabStartTimes[activeTabId] = now;
    }

    chrome.storage.local.set({ activeTabId, tabStartTimes }, () => {
      if (chrome.runtime.lastError) {
        console.error("Failed to update active tab ID or start times:", chrome.runtime.lastError);
      }
    });
  });
});

// Handle tab updates (e.g., reload)
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "loading") {
    const now = Date.now();

    chrome.storage.local.get({ tabStartTimes: {} }, (data) => {
      const tabStartTimes = data.tabStartTimes || {};
      tabStartTimes[tabId] = now;

      chrome.storage.local.set({ tabStartTimes }, () => {
        if (chrome.runtime.lastError) {
          console.error("Failed to update tab start time on reload:", chrome.runtime.lastError);
        }
      });
    });
  }
});

// Remove tab data when the tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.get({ tabStartTimes: {} }, (data) => {
    const tabStartTimes = data.tabStartTimes || {};

    // Delete the tab's start time
    if (tabStartTimes[tabId]) {
      delete tabStartTimes[tabId];
      chrome.storage.local.set({ tabStartTimes }, () => {
        if (chrome.runtime.lastError) {
          console.error("Failed to remove tab start time:", chrome.runtime.lastError);
        }
      });
    }
  });
});
