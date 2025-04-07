document.addEventListener('DOMContentLoaded', function() {
  // Load saved settings
  chrome.storage.sync.get(['refreshList', 'refreshInterval'], function(data) {
    const refreshInterval = document.getElementById('refreshInterval');
    const urlEntries = document.getElementById('urlEntries');
    
    // Set refresh interval
    if (data.refreshInterval) {
      refreshInterval.value = data.refreshInterval;
    }
    
    // Load URLs
    if (data.refreshList && data.refreshList.length > 0) {
      data.refreshList.forEach(url => addUrlToList(url));
    } else {
      // Default URLs from the original script
      const defaultUrls = [
        'example.com',
      ];
      defaultUrls.forEach(url => addUrlToList(url));
    }
  });
  
  // Add URL button
  document.getElementById('addUrl').addEventListener('click', function() {
    const newUrl = document.getElementById('newUrl').value;
    if (newUrl.trim() !== '') {
      addUrlToList(newUrl.trim());
      document.getElementById('newUrl').value = '';
    }
  });
  
  // Save settings button
  document.getElementById('saveSettings').addEventListener('click', function() {
    saveSettings();
  });
  
  // Function to add URL to the list
  function addUrlToList(url) {
    const urlEntries = document.getElementById('urlEntries');
    const urlEntry = document.createElement('div');
    urlEntry.className = 'url-entry';
    
    const urlText = document.createElement('span');
    urlText.textContent = url;
    
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', function() {
      urlEntries.removeChild(urlEntry);
    });
    
    urlEntry.appendChild(urlText);
    urlEntry.appendChild(removeButton);
    urlEntries.appendChild(urlEntry);
  }
  
  // Function to save settings
  function saveSettings() {
    const refreshInterval = parseInt(document.getElementById('refreshInterval').value, 10) || 180;
    const urlElements = document.querySelectorAll('.url-entry span');
    const refreshList = Array.from(urlElements).map(element => element.textContent);
    
    chrome.storage.sync.set({ 
      refreshList: refreshList,
      refreshInterval: refreshInterval
    }, function() {
      const status = document.getElementById('status');
      status.textContent = 'Settings saved!';
      setTimeout(function() {
        status.textContent = '';
      }, 3000);
      
      // Update the background process
      chrome.runtime.sendMessage({ action: 'updateSettings' });
    });
  }
});
