describe("integration tests", () => {
  beforeEach(() => {
    chrome.storage.local.data = {
      activeTabId: 1,
      tabStartTimes: { 1: Date.now() - 5000 },
    };
  });

  it("should track elapsed time across tab activations", () => {
    // Simulate tab activation
    chrome.tabs.onActivated.call({ tabId: 2 });

    // Assert the changes in storage
    expect(chrome.storage.local.data.activeTabId).toBe(2);
    expect(chrome.storage.local.data.tabStartTimes[2]).toBeDefined();
  });

  it("should clean up tab data when a tab is removed", () => {
    // Simulate tab removal
    chrome.tabs.onRemoved.call(1);

    // Assert the tab is removed from storage
    expect(chrome.storage.local.data.tabStartTimes[1]).toBeUndefined();
  });

  it("should reset the timer on tab reload", () => {
    const mockNow = 1735172014777; // Fixed mock timestamp
  
    // Mock Date.now to always return mockNow
    jest.spyOn(global.Date, "now").mockImplementation(() => mockNow);
  
    // Simulate tab reload
    chrome.tabs.reload(1);
  
    // Assert the tab start time is reset
    expect(chrome.storage.local.data.tabStartTimes[1]).toBe(mockNow);
  
    // Restore original Date.now
    global.Date.now.mockRestore();
  });   
});
