// Saves options to chrome.storage
function save_options() {
  var webhookUrl = document.getElementById('webhook-url').value;
  var demandCriteria = document.getElementById('demand-criteria').value;
  chrome.storage.sync.set({
    WEBHOOK_URL: webhookUrl,
    DEMAND_CRITERIA: demandCriteria
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    WEBHOOK_URL: 'https://your-default-webhook-url.com/endpoint',
    DEMAND_CRITERIA: ''
  }, function(items) {
    document.getElementById('webhook-url').value = items.WEBHOOK_URL;
    document.getElementById('demand-criteria').value = items.DEMAND_CRITERIA;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);