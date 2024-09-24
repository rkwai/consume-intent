// Saves options to chrome.storage
function save_options() {
  const enableIntegration = document.getElementById('enable-integration').checked;
  const webhookUrl = document.getElementById('webhook-url').value;
  const anthropicApi = document.getElementById('anthropic-api').value;
  const projectsId = document.getElementById('projects-id').value;
  const demandCriteria = document.getElementById('demand-criteria').value;

  chrome.storage.sync.set({
    enableIntegration,
    webhookUrl,
    anthropicApi,
    projectsId,
    demandCriteria
  }, () => {
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(() => {
      status.textContent = '';
    }, 3000);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    enableIntegration: false,
    webhookUrl: 'https://your-default-webhook-url.com/endpoint',
    anthropicApi: '',
    projectsId: '',
    demandCriteria: 'Top 3 items on their todo list, Top 3 things they are accountable for, Top 3 things they care about'
  }, (items) => {
    document.getElementById('enable-integration').checked = items.enableIntegration;
    document.getElementById('webhook-url').value = items.webhookUrl;
    document.getElementById('anthropic-api').value = items.anthropicApi;
    document.getElementById('projects-id').value = items.projectsId;
    document.getElementById('demand-criteria').value = items.demandCriteria;
    
    // Initialize the disabled state of integration fields
    toggleIntegrationFields();
  });
}

// Toggle visibility of integration options based on checkbox
function toggleIntegrationFields() {
  const enableIntegration = document.getElementById('enable-integration').checked;
  const integrationFields = document.querySelectorAll('#webhook-url, #anthropic-api, #projects-id');
  integrationFields.forEach(field => {
    field.disabled = !enableIntegration;
  });
}

// Event listeners
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('enable-integration').addEventListener('change', toggleIntegrationFields);