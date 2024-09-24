let isActive = false;

document.addEventListener('DOMContentLoaded', function() {
  var toggleDemandButton = document.getElementById('toggleDemand');
  var contentArea = document.getElementById('contentArea');

  toggleDemandButton.addEventListener('click', function() {
    isActive = !isActive;
    if (isActive) {
      toggleDemandButton.textContent = 'Deactivate Demand Finder';
      findDemand();
    } else {
      toggleDemandButton.textContent = 'Activate Demand Finder';
      contentArea.value = '';
    }
  });
});

function findDemand() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(tabs[0].id, { file: 'content.js' }, function() {
      if (chrome.runtime.lastError) {
        updateContentArea("Error injecting script: " + chrome.runtime.lastError.message);
        return;
      }
      
      chrome.tabs.sendMessage(tabs[0].id, {action: "getPageContent"}, function(response) {
        if (chrome.runtime.lastError) {
          updateContentArea("Error: " + chrome.runtime.lastError.message);
        } else if (response && response.content) {
          chrome.storage.sync.get({DEMAND_CRITERIA: ''}, function(items) {
            var demandCriteria = items.DEMAND_CRITERIA;
            var pageContent = response.content;
            
            var tempPrompt = "<context>" + pageContent + "</context>"
              + "<demand-criteria>" + demandCriteria + "</demand-criteria>";

            updateContentArea("Demand Criteria:\n" + demandCriteria + "\n\nPage Content:\n" + pageContent);
            
            navigator.clipboard.writeText(tempPrompt).then(function() {
              console.log('Content copied to clipboard');
              updateContentArea(contentArea.value + "\n\nPrompt copied to clipboard!");
            }).catch(function(err) {
              console.error('Failed to copy: ', err);
              updateContentArea("Failed to copy to clipboard.\n\n" + contentArea.value);
            });
          });
        } else {
          updateContentArea("No content received");
        }
      });
    });
  });
}

function updateContentArea(text) {
  var contentArea = document.getElementById('contentArea');
  contentArea.value = text;
}