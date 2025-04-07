// Initialize settings
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['refreshList', 'refreshInterval'], function(data) {
    if (!data.refreshList) {
      // Default URLs
      const defaultUrls = [
        'example.com',
      ];
      chrome.storage.sync.set({ refreshList: defaultUrls });
    }
    
    if (!data.refreshInterval) {
      chrome.storage.sync.set({ refreshInterval: 180 });
    }
  });
});

// Check if a URL should be refreshed
function shouldRefresh(url, refreshList) {
  return refreshList.some(pattern => url.includes(pattern));
}

// Update badge for active tab
function updateBadge() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) return;
    
    const activeTab = tabs[0];
    
    chrome.storage.sync.get(['refreshList', 'refreshInterval', 'lastRefreshTimes'], function(data) {
      const refreshInterval = data.refreshInterval || 180;
      const refreshList = data.refreshList || [];
      const lastRefreshTimes = data.lastRefreshTimes || {};
      const currentTime = Date.now();
      
      // Check if this tab should be refreshed
      if (shouldRefresh(activeTab.url, refreshList)) {
        const lastRefresh = lastRefreshTimes[activeTab.id] || 0;
        const elapsedSeconds = Math.floor((currentTime - lastRefresh) / 1000);
        const remainingSeconds = refreshInterval - elapsedSeconds;
        
        if (remainingSeconds <= 0) {
          // Will refresh soon
          chrome.action.setBadgeText({ text: "0" });
          chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });
        } else {
          // Format remaining time
          let badgeText;
          if (remainingSeconds > 60) {
            const minutes = Math.floor(remainingSeconds / 60);
            badgeText = `${minutes}m`;
          } else {
            badgeText = `${remainingSeconds}`;
          }
          
          // Set color based on remaining time
          let color;
          const percentComplete = (elapsedSeconds / refreshInterval);
          if (percentComplete < 0.5) {
            color = "#4CAF50"; // Green
          } else if (percentComplete < 0.8) {
            color = "#FFC107"; // Yellow
          } else {
            color = "#F44336"; // Red
          }
          
          chrome.action.setBadgeText({ text: badgeText });
          chrome.action.setBadgeBackgroundColor({ color: color });
        }
      } else {
        // Clear badge for non-refreshed tabs
        chrome.action.setBadgeText({ text: "" });
      }
    });
  });
}

// Setup refresh check for active tabs
function setupRefreshCheck() {
  chrome.storage.sync.get(['refreshList', 'refreshInterval'], function(data) {
    const refreshInterval = data.refreshInterval || 180;
    const refreshList = data.refreshList || [];
    
    // Clear any existing alarm
    chrome.alarms.clear('refreshCheck');
    
    // Set up new alarm
    chrome.alarms.create('refreshCheck', { periodInMinutes: 0.5 }); // Check every 30 seconds
  });
  
  // Create countdown update alarm - runs every second
  chrome.alarms.create('badgeUpdate', { periodInMinutes: 1/60 });
}

// Handle alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'refreshCheck') {
    chrome.storage.sync.get(['refreshList', 'refreshInterval', 'lastRefreshTimes'], function(data) {
      const refreshInterval = data.refreshInterval || 180;
      const refreshList = data.refreshList || [];
      const lastRefreshTimes = data.lastRefreshTimes || {};
      const currentTime = Date.now();
      
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          if (shouldRefresh(tab.url, refreshList)) {
            const lastRefresh = lastRefreshTimes[tab.id] || 0;
            
            // Check if it's time to refresh
            if ((currentTime - lastRefresh) / 1000 >= refreshInterval) {
              chrome.tabs.reload(tab.id);
              
              // Update last refresh time
              lastRefreshTimes[tab.id] = currentTime;
              chrome.storage.sync.set({ lastRefreshTimes: lastRefreshTimes });
              
              console.log(`Refreshed tab: ${tab.url}`);
            }
          }
        });
      });
    });
  } 
  else if (alarm.name === 'badgeUpdate') {
    updateBadge();
  }
});

// Handle tab changes to update badge
chrome.tabs.onActivated.addListener(function() {
  updateBadge();
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    updateBadge();
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateSettings') {
    setupRefreshCheck();
    updateBadge(); // Update badge immediately after settings change
  }
});

// Initialize on startup
setupRefreshCheck();
updateBadge(); // Initialize badge
