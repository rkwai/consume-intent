let isActive = false;

document.addEventListener('DOMContentLoaded', function() {
  var toggleIntentButton = document.getElementById('toggleIntent');
  var contentArea = document.getElementById('contentArea');

  toggleIntentButton.addEventListener('click', function() {
    // Disable the button and add visual indication
    toggleIntentButton.disabled = true;
    toggleIntentButton.classList.add('disabled');

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
          enableButton(toggleIntentButton);
        })
        .catch(error => {
          contentArea.value = 'Error fetching data.';
          console.error('Error:', error);
          enableButton(toggleIntentButton);
        });
      } else {
        // Existing functionality when integration is disabled
        isActive = !isActive;
        if (isActive) {
          toggleIntentButton.textContent = 'Clear Intent';
          findIntent(settings.activeCriteria, settings.criteriaList);
        } else {
          toggleIntentButton.textContent = 'Find Intent';
          contentArea.value = '';
          enableButton(toggleIntentButton);
        }
      }
    });
  });
});

function getActiveCriteria(activeCriteriaName, criteriaList) {
  const activeCriteria = criteriaList.find(criteria => criteria.name === activeCriteriaName);
  return activeCriteria ? activeCriteria.criteria : '';
}

function findIntent(activeCriteriaName, criteriaList) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(tabs[0].id, { file: 'content.js' }, function() {
      if (chrome.runtime.lastError) {
        updateContentArea("Error injecting script: " + chrome.runtime.lastError.message);
        enableButton(document.getElementById('toggleIntent'));
        return;
      }
      
      // Add a small delay before sending the message
      setTimeout(() => {
        chrome.tabs.sendMessage(tabs[0].id, {action: "getPageContent"}, function(response) {
          if (chrome.runtime.lastError) {
            updateContentArea("Error: " + chrome.runtime.lastError.message);
          } else if (response && response.content) {
            const intentCriteria = getActiveCriteria(activeCriteriaName, criteriaList);
            var pageContent = response.content;
            
            var tempPrompt = "<context>" + pageContent + "</context>"
              + "<intent-criteria>" + intentCriteria + "</intent-criteria>";

            updateContentArea("Intent Criteria:\n" + intentCriteria + "\n\nPage Content:\n" + pageContent);
            
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
          enableButton(document.getElementById('toggleIntent'));
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
