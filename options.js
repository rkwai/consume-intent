// Saves options to chrome.storage
function saveOptions() {
  const enableIntegration = document.getElementById('enable-integration').checked;
  const webhookUrl = document.getElementById('webhook-url').value;
  const activeCriteria = document.getElementById('active-criteria').value;
  const criteriaList = JSON.parse(localStorage.getItem('criteriaList') || '[]');

  chrome.storage.sync.set({
    enableIntegration: enableIntegration,
    webhookUrl: webhookUrl,
    activeCriteria: activeCriteria,
    criteriaList: criteriaList
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
function restoreOptions() {
  chrome.storage.sync.get({
    enableIntegration: false,
    webhookUrl: '',
    activeCriteria: '',
    criteriaList: []
  }, function(items) {
    document.getElementById('enable-integration').checked = items.enableIntegration;
    document.getElementById('webhook-url').value = items.webhookUrl;
    
    // Restore criteria list
    localStorage.setItem('criteriaList', JSON.stringify(items.criteriaList));
    updateCriteriaList();
    
    // Set active criteria
    const activeCriteriaSelect = document.getElementById('active-criteria');
    activeCriteriaSelect.value = items.activeCriteria;
  });
}

let editingIndex = -1;

function addCriteria() {
  const criteriaName = document.getElementById('criteria-name').value;
  const demandCriteria = document.getElementById('demand-criteria').value;
  
  if (criteriaName && demandCriteria) {
    const criteriaList = JSON.parse(localStorage.getItem('criteriaList') || '[]');
    criteriaList.push({ name: criteriaName, criteria: demandCriteria });
    localStorage.setItem('criteriaList', JSON.stringify(criteriaList));
    
    clearInputs();
    updateCriteriaList();
  }
}

function updateCriteriaList() {
  const criteriaList = JSON.parse(localStorage.getItem('criteriaList') || '[]');
  const criteriaListElement = document.getElementById('criteria-list');
  const activeCriteriaSelect = document.getElementById('active-criteria');
  
  criteriaListElement.innerHTML = '';
  activeCriteriaSelect.innerHTML = '<option value="">Select active criteria</option>';
  
  criteriaList.forEach((criteria, index) => {
    const criteriaItem = document.createElement('div');
    criteriaItem.className = 'criteria-item';
    criteriaItem.innerHTML = `
      <span>${criteria.name}</span>
      <div>
        <button class="edit-button" data-index="${index}">Edit</button>
        <button class="delete-button" data-index="${index}">Delete</button>
      </div>
    `;
    criteriaListElement.appendChild(criteriaItem);
    
    const option = document.createElement('option');
    option.value = criteria.name;
    option.textContent = criteria.name;
    activeCriteriaSelect.appendChild(option);
  });
}

function editCriteria(index) {
  const criteriaList = JSON.parse(localStorage.getItem('criteriaList') || '[]');
  const criteria = criteriaList[index];
  
  document.getElementById('criteria-name').value = criteria.name;
  document.getElementById('demand-criteria').value = criteria.criteria;
  
  document.getElementById('add-criteria').style.display = 'none';
  document.getElementById('update-criteria').style.display = 'block';
  document.getElementById('cancel-edit').style.display = 'block';
  
  editingIndex = index;
  
  // Highlight the editing item
  const criteriaItems = document.querySelectorAll('.criteria-item');
  criteriaItems.forEach((item, i) => {
    if (i === index) {
      item.classList.add('edit-mode');
    } else {
      item.classList.remove('edit-mode');
    }
  });
}

function updateCriteria() {
  if (editingIndex === -1) return;
  
  const criteriaList = JSON.parse(localStorage.getItem('criteriaList') || '[]');
  const criteriaName = document.getElementById('criteria-name').value;
  const demandCriteria = document.getElementById('demand-criteria').value;
  
  if (criteriaName && demandCriteria) {
    criteriaList[editingIndex] = { name: criteriaName, criteria: demandCriteria };
    localStorage.setItem('criteriaList', JSON.stringify(criteriaList));
    
    clearInputs();
    updateCriteriaList();
    cancelEdit();
  }
}

function deleteCriteria(index) {
  if (confirm('Are you sure you want to delete this criteria?')) {
    const criteriaList = JSON.parse(localStorage.getItem('criteriaList') || '[]');
    criteriaList.splice(index, 1);
    localStorage.setItem('criteriaList', JSON.stringify(criteriaList));
    updateCriteriaList();
    
    if (editingIndex === index) {
      cancelEdit();
    }
  }
}

function cancelEdit() {
  clearInputs();
  document.getElementById('add-criteria').style.display = 'block';
  document.getElementById('update-criteria').style.display = 'none';
  document.getElementById('cancel-edit').style.display = 'none';
  editingIndex = -1;
  
  // Remove highlight from all items
  const criteriaItems = document.querySelectorAll('.criteria-item');
  criteriaItems.forEach(item => item.classList.remove('edit-mode'));
}

function clearInputs() {
  document.getElementById('criteria-name').value = '';
  document.getElementById('demand-criteria').value = '';
}

document.addEventListener('DOMContentLoaded', function() {
  restoreOptions();
  document.getElementById('save').addEventListener('click', saveOptions);
  document.getElementById('add-criteria').addEventListener('click', addCriteria);
  document.getElementById('update-criteria').addEventListener('click', updateCriteria);
  document.getElementById('cancel-edit').addEventListener('click', cancelEdit);
  
  // Event delegation for dynamically created buttons
  document.getElementById('criteria-list').addEventListener('click', function(e) {
    if (e.target.classList.contains('edit-button')) {
      editCriteria(parseInt(e.target.dataset.index));
    } else if (e.target.classList.contains('delete-button')) {
      deleteCriteria(parseInt(e.target.dataset.index));
    }
  });
});