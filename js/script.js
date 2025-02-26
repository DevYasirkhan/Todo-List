'use strict';

//////////////////////////////////////////
// Select Elements
const form = document.querySelector('.crud-form');
const inputName = document.querySelector('.input-name');
const inputDescription = document.querySelector('.input-description');
const btnSubmit = document.querySelector('.btn-submit');
const itemsList = document.querySelector('.items-list');

//////////////////////////////////////////
// Api Practice
let API_URL = 'https://crudcrud.com/api/dd2a7a233af04138ba488a750487f774/items';

document.addEventListener('DOMContentLoaded', fetchItems);

let isEdit = false;
let itemId;

// Handle form submission
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = inputName.value.trim();
  const description = inputDescription.value.trim();

  if (!isEdit) {
    createItem({ name, description });
  } else {
    updateItem(itemId, { name, description });
    btnSubmit.textContent = 'Add Item';
    isEdit = false;
  }
  inputName.value = inputDescription.value = '';
});

// Create a new item
async function createItem(data) {
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    fetchItems();
  } catch (error) {
    console.error('Error creating items', error);
  }
}

// Fetch and display items
async function fetchItems() {
  itemsList.innerHTML = '';
  try {
    const response = await fetch(API_URL);
    const items = await response.json();

    if (!response.ok) throw new Error('Failed to fetch items');

    RenderItem(items);
  } catch (error) {
    console.error('Error Fetching items', error);
  }
}

// Render items
function RenderItem(items) {
  items.forEach(item => {
    const html = `
      <li class="item" data-id="${item._id}">
          <span>${item.name} - ${item.description}</span>
          <div>
          <button class="btn-edit">Edit</button>
          <button class="btn-delete">Delete</button>
          </div>
      </li>`;
    itemsList.insertAdjacentHTML('afterbegin', html);
  });
}

// Delete items
async function deleteItem(id) {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    fetchItems();
  } catch (error) {
    console.error('Error deleting item', error);
  }
}

// Update items
async function updateItem(id, updateData) {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    fetchItems();
  } catch (error) {
    console.log('Error updating item', error);
  }
}

////////////////////////////////////////////
// add Event listener
itemsList.addEventListener('click', function (e) {
  if (e.target.classList.contains('btn-delete')) {
    const itemId = e.target.closest('.item').dataset.id;
    deleteItem(itemId);
  }

  if (e.target.classList.contains('btn-edit')) {
    const itemElement = e.target.closest('.item');
    itemId = itemElement.dataset.id;

    const oldText = itemElement.querySelector('span').textContent;
    const [oldName, oldDescription] = oldText.split(' - ');
    inputName.value = oldName;
    inputDescription.value = oldDescription;
    btnSubmit.textContent = 'Edit Item';
    isEdit = true;
    inputName.focus();
  }
});
