const photoInput = document.getElementById('photoInput');
const detectBtn = document.getElementById('detectBtn');
const closetItemsContainer = document.getElementById('closetItems');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const addModal = document.getElementById('addModal');
const addForm = document.getElementById('addForm');
const addItemBtn = document.getElementById('addItemBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const cancelAddBtn = document.getElementById('cancelAddBtn');

let model;
let closetItems = [];

// Load closet items from localStorage
function loadCloset() {
  const data = localStorage.getItem('closetItems');
  if (data) {
    closetItems = JSON.parse(data);
  } else {
    closetItems = [];
  }
}

// Save closet items to localStorage
function saveCloset() {
  localStorage.setItem('closetItems', JSON.stringify(closetItems));
}

// Render closet items in the UI grouped by type (shelves)
function renderCloset() {
  closetItemsContainer.innerHTML = '';

  // Group items by type
  const shelves = {};
  closetItems.forEach(item => {
    if (!shelves[item.type]) {
      shelves[item.type] = [];
    }
    shelves[item.type].push(item);
  });

  // For each shelf (type), create a section
  for (const [type, items] of Object.entries(shelves)) {
    const shelfSection = document.createElement('section');
    shelfSection.className = 'mb-8 w-full';

    const shelfTitle = document.createElement('h2');
    shelfTitle.className = 'text-xl font-bold mb-4 text-center text-pink-700';
    shelfTitle.textContent = type + ' 🧺';
    shelfSection.appendChild(shelfTitle);

    const shelfGrid = document.createElement('div');
    shelfGrid.className = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4';

    items.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'bg-white rounded shadow p-4 flex flex-col items-center';
      itemDiv.innerHTML = `
        <img src="${item.photo}" alt="${item.name}" class="w-32 h-32 object-cover rounded mb-2" />
        <h3 class="font-semibold text-lg">${item.name}</h3>
        <p class="text-sm text-gray-600">Color: ${item.color}</p>
        <p class="text-sm text-gray-600">Season: ${item.season}</p>
        <div class="mt-2 flex space-x-2">
          <button class="editBtn bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700" data-id="${item.id}">Edit</button>
          <button class="deleteBtn bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700" data-id="${item.id}">Delete</button>
        </div>
      `;
      shelfGrid.appendChild(itemDiv);
    });

    shelfSection.appendChild(shelfGrid);
    closetItemsContainer.appendChild(shelfSection);
  }

  // Attach event listeners for edit and delete buttons
  document.querySelectorAll('.editBtn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = e.target.getAttribute('data-id');
      openEditModal(id);
    });
  });
  document.querySelectorAll('.deleteBtn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = e.target.getAttribute('data-id');
      deleteItem(id);
    });
  });
}

// Open edit modal with item data
function openEditModal(id) {
  const item = closetItems.find(i => i.id === id);
  if (!item) return;
  document.getElementById('editItemId').value = item.id;
  document.getElementById('editName').value = item.name;
  document.getElementById('editType').value = item.type;
  document.getElementById('editSeason').value = item.season;
  document.getElementById('editColor').value = item.color;
  document.getElementById('editTexture').value = item.texture;
  editModal.classList.remove('hidden');
}

// Close edit modal
function closeEditModal() {
  editModal.classList.add('hidden');
}

// Open add modal
function openAddModal() {
  addForm.reset();
  addModal.classList.remove('hidden');
}

// Close add modal
function closeAddModal() {
  addModal.classList.add('hidden');
}

// Delete item by id
function deleteItem(id) {
  closetItems = closetItems.filter(i => i.id !== id);
  saveCloset();
  renderCloset();
}

// Generate unique id
function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// Detect items in photos using TensorFlow.js coco-ssd model
async function detectItemsInPhotos(files) {
  if (!model) {
    console.log('Loading model...');
    model = await cocoSsd.load();
    console.log('Model loaded');
  }
  for (const file of files) {
    console.log('Processing file:', file.name);
    const img = await loadImageFromFile(file);
    console.log('Image loaded:', img.src);
    const predictions = await model.detect(img);
    console.log('Predictions:', predictions);
    // Filter predictions for clothing items and map to desired types
    for (const pred of predictions) {
      if (pred.class === 'person' || pred.class === 'tie' || pred.class === 'backpack' || pred.class === 'handbag') {
        continue;
      }
      let type = pred.class.charAt(0).toUpperCase() + pred.class.slice(1);
      if (type.toLowerCase() === 'shirt') {
        type = 'Top';
      }
      const item = {
        id: generateId(),
        name: type,
        type: type,
        color: 'Unknown',
        season: 'All',
        photo: img.src
      };
      closetItems.push(item);
      console.log('Item added:', item);
    }
  }
  saveCloset();
  renderCloset();
}

// Load image element from file
function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

// Event listeners
detectBtn.addEventListener('click', async () => {
  if (photoInput.files.length === 0) {
    alert('Por favor, selecciona una o más fotos.');
    return;
  }
  detectBtn.disabled = true;
  detectBtn.textContent = 'Detectando...';
  await detectItemsInPhotos(photoInput.files);
  detectBtn.disabled = false;
  detectBtn.textContent = 'Detectar artículos';
});

editForm.addEventListener('submit', e => {
  e.preventDefault();
  const id = document.getElementById('editItemId').value;
  const item = closetItems.find(i => i.id === id);
  if (!item) return;
  item.name = document.getElementById('editName').value;
  item.type = document.getElementById('editType').value;
  item.season = document.getElementById('editSeason').value;
  item.color = document.getElementById('editColor').value;
  item.texture = document.getElementById('editTexture').value;
  saveCloset();
  renderCloset();
  closeEditModal();
});

// Remove texture references since texture field was removed from UI
addForm.addEventListener('submit', e => {
  e.preventDefault();
  const newItem = {
    id: generateId(),
    name: document.getElementById('addName').value,
    type: document.getElementById('addType').value,
    season: document.getElementById('addSeason').value,
    color: document.getElementById('addColor').value,
    photo: '' // No photo for manual add
  };
  closetItems.push(newItem);
  saveCloset();
  renderCloset();
  closeAddModal();
});

cancelEditBtn.addEventListener('click', () => {
  closeEditModal();
});

addItemBtn.addEventListener('click', () => {
  openAddModal();
});

addForm.addEventListener('submit', e => {
  e.preventDefault();
  const newItem = {
    id: generateId(),
    name: document.getElementById('addName').value,
    type: document.getElementById('addType').value,
    season: document.getElementById('addSeason').value,
    color: document.getElementById('addColor').value,
    texture: document.getElementById('addTexture').value,
    photo: '' // No photo for manual add
  };
  closetItems.push(newItem);
  saveCloset();
  renderCloset();
  closeAddModal();
});

cancelAddBtn.addEventListener('click', () => {
  closeAddModal();
});

detectBtn.addEventListener('click', async () => {
  if (photoInput.files.length === 0) {
    alert('Por favor, selecciona una o más fotos.');
    return;
  }
  detectBtn.disabled = true;
  detectBtn.textContent = 'Detectando...';
  await detectItemsInPhotos(photoInput.files);
  detectBtn.disabled = false;
  detectBtn.textContent = 'Detectar artículos';
});

// Initialize app
loadCloset();
renderCloset();
