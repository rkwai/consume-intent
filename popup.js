let isActive = false;

document.addEventListener('DOMContentLoaded', function() {
  var toggleDemandButton = document.getElementById('toggleDemand');
  var contentArea = document.getElementById('contentArea');

  toggleDemandButton.addEventListener('click', function() {
    // Disable the button and add visual indication
    toggleDemandButton.disabled = true;
    toggleDemandButton.classList.add('disabled');

    // Fetch integration settings and active criteria
    chrome.storage.sync.get({
      enableIntegration: false,
      webhookUrl: '',
      activeCriteria: '',
      criteriaList: []
    }, function(settings) {
      if (settings.enableIntegration) {
        // Call the webhook
        fetch(settings.webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            criteria: getActiveCriteria(settings.activeCriteria, settings.criteriaList)
          })
        })
        .then(response => response.text())
        .then(data => {
          contentArea.value = data;
          enableButton(toggleDemandButton);
        })
        .catch(error => {
          contentArea.value = 'Error fetching data.';
          console.error('Error:', error);
          enableButton(toggleDemandButton);
        });
      } else {
        // Existing functionality when integration is disabled
        isActive = !isActive;
        if (isActive) {
          toggleDemandButton.textContent = 'Clear Demand';
          findDemand(settings.activeCriteria, settings.criteriaList);
        } else {
          toggleDemandButton.textContent = 'Find Demand';
          contentArea.value = '';
          enableButton(toggleDemandButton);
        }
      }
    });
  });
});

function getActiveCriteria(activeCriteriaName, criteriaList) {
  const activeCriteria = criteriaList.find(criteria => criteria.name === activeCriteriaName);
  return activeCriteria ? activeCriteria.criteria : '';
}

function findDemand(activeCriteriaName, criteriaList) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(tabs[0].id, { file: 'content.js' }, function() {
      if (chrome.runtime.lastError) {
        updateContentArea("Error injecting script: " + chrome.runtime.lastError.message);
        enableButton(document.getElementById('toggleDemand'));
        return;
      }
      
      // Add a small delay before sending the message
      setTimeout(() => {
        chrome.tabs.sendMessage(tabs[0].id, {action: "getPageContent"}, function(response) {
          if (chrome.runtime.lastError) {
            updateContentArea("Error: " + chrome.runtime.lastError.message);
          } else if (response && response.content) {
            const demandCriteria = getActiveCriteria(activeCriteriaName, criteriaList);
            var pageContent = response.content;
            
            var tempPrompt = "<context>" + pageContent + "</context>"
              + "<demand-criteria>" + demandCriteria + "</demand-criteria>";

            updateContentArea("Demand Criteria:\n" + demandCriteria + "\n\nPage Content:\n" + pageContent);
            
            navigator.clipboard.writeText(tempPrompt).then(function() {
              console.log('Content copied to clipboard');
              updateContentArea("Prompt copied to clipboard!\n\n" + contentArea.value);
            }).catch(function(err) {
              console.error('Failed to copy: ', err);
              updateContentArea("Failed to copy to clipboard.\n\n" + contentArea.value);
            });
          } else {
            updateContentArea("No content received");
          }
          enableButton(document.getElementById('toggleDemand'));
        });
      }, 100); // 100ms delay
    });
  });
}

function updateContentArea(text) {
  var contentArea = document.getElementById('contentArea');
  contentArea.value = text;
}

function enableButton(button) {
  button.disabled = false;
  button.classList.remove('disabled');
}

// Keep the popup open
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  return true;
});
