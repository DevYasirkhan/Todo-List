'use strict';

//////////////////////////////////////////
// Select Elements
const form = document.querySelector('.crud-form');
const inputName = document.querySelector('.input-name');
const inputDescription = document.querySelector('.input-description');
const itemsList = document.querySelector('.items-list');

//////////////////////////////////////////
// Api Practice
// let API_URL = 'https://crudcrud.com/api/';
// let ID = '508cfe454cb4485098ca7b5bb8e8b41d';

document.addEventListener('DOMContentLoaded', fetchItems);

// Handle form submission
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = inputName.value.trim();
  const description = inputDescription.value.trim();

  createItem({ name, description });
  inputName.value = inputDescription.value = '';
});

// Create a new item
async function createItem(data) {
  try {
    await fetch(
      'https://crudcrud.com/api/508cfe454cb4485098ca7b5bb8e8b41d/items',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    );

    fetchItems();
  } catch (error) {
    console.error('Error creating items', error);
  }
}

// Fetch and display items
async function fetchItems() {
  itemsList.innerHTML = '';
  try {
    const response = await fetch(
      'https://crudcrud.com/api/508cfe454cb4485098ca7b5bb8e8b41d/items'
    );
    const items = await response.json();
    console.log(response);
    console.log(items);

    if (!response.ok) throw new Error('Failed to fetch items');

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
  } catch (error) {
    console.error('Error Fetching items', error);
  }
}

// Delete items
async function deleteItem(id) {
  try {
    await fetch(
      `https://crudcrud.com/api/508cfe454cb4485098ca7b5bb8e8b41d/items/${id}`,
      {
        method: 'DELETE',
      }
    );
    fetchItems();
  } catch (error) {
    console.error('Error deleting item', error);
  }
}

// Update items
async function updateItem(id, updateData) {
  try {
    await fetch(
      `https://crudcrud.com/api/508cfe454cb4485098ca7b5bb8e8b41d/items/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      }
    );
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
    const itemId = itemElement.dataset.id;

    const oldText = itemElement.querySelector('span').textContent;
    const [oldName, oldDescription] = oldText.split(' - ');

    const newName = prompt('Enter new name', oldName);
    const newDescription = prompt('Enter new description', oldDescription);

    updateItem(itemId, { newName, newDescription });
  }
});
