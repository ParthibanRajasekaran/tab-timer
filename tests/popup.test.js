const { updatePopup } = require("../src/popup.js");

describe("popup.js integration with chrome API", () => {
  beforeEach(() => {
    // Reset chrome storage mock before each test
    chrome.storage.local.data = {
      activeTabId: 1,
      tabStartTimes: { 1: Date.now() - 1000 }, // 1 second ago
    };
    document.body.innerHTML = `<div id="activeTabInfo"></div>`; // Set up DOM for testing
  });

  it("should display elapsed time for the active tab", (done) => {
    // Mock Date.now to control elapsed time
    const mockNow = Date.now();
    jest.spyOn(global.Date, "now").mockImplementation(() => mockNow);
  
    // Run updatePopup
    updatePopup();
  
    // Wait for the DOM to update
    setTimeout(() => {
      const info = document.getElementById("activeTabInfo").textContent;
      expect(info).toContain("Elapsed Time: 00:00:01");
  
      // Restore original Date.now
      global.Date.now.mockRestore();
      done();
    }, 1000); // Wait 1 second to allow the timer to update
  });
  

  it("should prompt to refresh if no start time is found", (done) => {
    // Simulate missing start time
    chrome.storage.local.data.tabStartTimes = {};
  
    // Mock chrome.tabs.reload
    const reloadMock = jest.fn();
    chrome.tabs.reload = reloadMock;
  
    // Run updatePopup
    updatePopup();
  
    // Wait for the DOM to render
    setTimeout(() => {
      const refreshButton = document.getElementById("refreshButton");
      expect(refreshButton).not.toBeNull();
      expect(refreshButton.textContent).toBe("Refresh Tab");
  
      // Simulate click on the refresh button
      refreshButton.click();
  
      // Verify the reload function was called
      expect(reloadMock).toHaveBeenCalledWith(1);
  
      done();
    }, 100); // Wait 100ms for the DOM to render
  });  
});