const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const clearAllButton = document.getElementById('clear-all');
const notification = document.getElementById('notification');

const apiUrl = 'http://localhost:3000/todos'; // URL de tu API REST

// Load todos from the API
document.addEventListener('DOMContentLoaded', loadTodos);

// Add new todo
todoForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const todoText = todoInput.value;
  const todoObj = { text: todoText };

  // Send a POST request to add a new todo
  await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todoObj),
  });

  todoInput.value = '';
  displayTodos();
  showNotification('Tarea agregada con éxito');
});

// Display todos
async function loadTodos() {
  const response = await fetch(apiUrl);
  const todos = await response.json();
  todos.forEach(todo => {
    createTodoElement(todo);
  });
}

async function displayTodos() {
  todoList.innerHTML = '';
  await loadTodos(); // Re-fetch todos to display
}

// Create todo element
function createTodoElement(todo) {
  const todoItem = document.createElement('div');
  todoItem.className = 'card';
  todoItem.innerHTML = `
        <span>${todo.text}</span>
        <div>
            <button class="edit-btn" data-id="${todo.id}">Editar</button>
            <button class="delete-btn" data-id="${todo.id}">Eliminar</button>
        </div>
    `;
  todoList.appendChild(todoItem);

  // Edit button event
  todoItem.querySelector('.edit-btn').addEventListener('click', async () => {
    const newText = prompt('Editar tarea:', todo.text);
    if (newText) {
      // Send a PUT request to update the todo
      await fetch(`${apiUrl}/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newText }),
      });
      displayTodos();
      showNotification('Tarea editada con éxito');
    }
  });

  // Delete button event
  todoItem.querySelector('.delete-btn').addEventListener('click', async () => {
    // Send a DELETE request to remove the todo
    await fetch(`${apiUrl}/${todo.id}`, {
      method: 'DELETE',
    });
    displayTodos();
    showNotification('Tarea eliminada con éxito');
  });
}

// Clear all todos
clearAllButton.addEventListener('click', async () => {
  // Send a request to delete all todos
  const response = await fetch(apiUrl);
  const todos = await response.json();
  await Promise.all(todos.map(todo => fetch(`${apiUrl}/${todo.id}`, { method: 'DELETE' })));
  displayTodos();
  showNotification('Todas las tareas han sido eliminadas');
});

// Show notification
function showNotification(message) {
  notification.innerText = message;
  notification.style.display = 'block';
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}