const chrome = {
  storage: {
    local: {
      data: {},
      get(keys, callback) {
        setTimeout(() => {
          let result;
          if (Array.isArray(keys)) {
            result = keys.reduce((acc, key) => {
              acc[key] = this.data[key];
              return acc;
            }, {});
          } else if (typeof keys === "object") {
            result = Object.keys(keys).reduce((acc, key) => {
              acc[key] = this.data[key] || keys[key];
              return acc;
            }, {});
          } else {
            result = { [keys]: this.data[keys] };
          }
          callback(result);
        }, 0);
      },
      set(items, callback) {
        setTimeout(() => {
          this.data = { ...this.data, ...items };
          if (callback) callback();
        }, 0);
      },
    },
  },
  tabs: {
    onActivated: {
      listeners: [],
      addListener(listener) {
        this.listeners.push(listener);
      },
      call(info) {
        this.listeners.forEach((listener) => listener(info));
        chrome.storage.local.data.activeTabId = info.tabId;
        if (!chrome.storage.local.data.tabStartTimes[info.tabId]) {
          chrome.storage.local.data.tabStartTimes[info.tabId] = Date.now();
        }
      },
    },
    onRemoved: {
      listeners: [],
      addListener(listener) {
        this.listeners.push(listener);
      },
      call(tabId) {
        this.listeners.forEach((listener) => listener(tabId));
        delete chrome.storage.local.data.tabStartTimes[tabId];
      },
    },
    reload: jest.fn((tabId) => {
      console.log(`Tab ${tabId} reloaded`);
      chrome.storage.local.data.tabStartTimes[tabId] = Date.now(); // Reset start time on reload
    }),
  },
};

global.chrome = chrome;
module.exports = chrome;
