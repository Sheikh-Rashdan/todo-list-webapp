class Todo {
  constructor(task, color) {
    this.task = task;
    this.color = color;
  }

  task;
  color;
}

function handleTaskInputKeyDown({ key }) {
  if (key === 'Enter') {
    addTask();
  }
}

function updateColorInput() {
  const { value: color } = colorInputElement
  colorInputElement.style.backgroundColor = `var(--option-${color})`;
}

function addTask() {
  const { value: task } = taskInputElement;
  const { value: color } = colorInputElement;
  if (task) {
    for (let i = 0; i < todos.length; i++) {
      if (todos[i].task === task) return;
    }
    todos.push(new Todo(task, color))
    updateTodoDisplay(1);
  }
  taskInputElement.value = '';
}

function updateTodoDisplay(animateLast) {
  let innerHTML = '';
  todos.forEach((todoItem, index) => {
    const doAnimate = index >= todos.length - animateLast;
    innerHTML += `
      <div class="todo-display-card todo-display-${todoItem.color} ${doAnimate ? 'todo-display-card-popup' : ''}">
            ${todoItem.task}
            <button class="todo-display-delete js-todo-display-delete" data-todo-task="${todoItem.task}">
                <i class='bx bxs-trash-x bx-sm'></i>
            </button>
      </div>
      `;
  })

  todoDisplayContainer.innerHTML = innerHTML;
  if (animateLast) todoDisplayContainer.scrollTop = todoDisplayContainer.scrollHeight;

  bindDeleteButtons();
  saveTodos();
}

function bindDeleteButtons() {
  const todoDisplayDeleteElements = document.querySelectorAll('.js-todo-display-delete');
  todoDisplayDeleteElements.forEach((todoDisplayDeleteElement) => {
    todoDisplayDeleteElement.addEventListener('click', () => {
      const deletedTask = todoDisplayDeleteElement.dataset.todoTask;
      todos = todos.filter((todoItem) => todoItem.task !== deletedTask);
      let found = false;
      document.querySelectorAll('.todo-display-card').forEach((todoCard, index) => {
        if (found) {
          todoCard.style.translate = "0px -130%";
        }
        if ((todoCard.innerText === deletedTask)) {
          todoCard.style.scale = 0;
          found = true;
        }
      })
      setTimeout(() => {
        updateTodoDisplay(0)
      }, 250);
    })
  })
}

function saveTodos() {
  localStorage.setItem(TODO_KEY, JSON.stringify(todos));
}

function loadTodos() {
  try {
    loadedTodos = JSON.parse(localStorage.getItem(TODO_KEY));
    return loadTodos && Array.isArray(loadTodos) ? loadTodos : defaultTodos;
  } catch (error) {
    console.log(`Error loading todos: ${error}`);
    return defaultTodos;
  }
}

const defaultTodos = [
  { task: 'Wash the Dishes', color: 'blue' },
  { task: 'Dance to a Song', color: 'green' },
  { task: 'Do Math Homework', color: 'red' },
  { task: 'Commit Arson', color: 'blue' },
  { task: 'Sleep 8 Hours', color: 'orange' }
]

const TODO_KEY = 'todoKey';
let todos = loadTodos();

const taskInputElement = document.getElementById('todo-task-input');
const colorInputElement = document.getElementById('todo-color-input');
const todoAddButtonElement = document.querySelector('.js-todo-add-button');
const todoDisplayContainer = document.querySelector('.js-todo-display-container');

taskInputElement.addEventListener('keydown', handleTaskInputKeyDown)
colorInputElement.addEventListener('change', updateColorInput);
todoAddButtonElement.addEventListener('click', addTask);

updateTodoDisplay(todos.length);