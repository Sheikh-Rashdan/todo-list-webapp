// todo class
class Todo {
  constructor(task, color) {
    this.task = task;
    this.color = color;
  }

  task;
  color;
}

function handleTaskInputKeyDown({ key }) {
  /* Add task if user presses enter in taskInput */
  if (key === 'Enter') {
    addTask();
  }
}

function updateColorInput() {
  /* Update colorInput backgroundColor when user selects new color */
  const { value: color } = colorInputElement
  colorInputElement.style.backgroundColor = `var(--option-${color})`;
}

function addTask() {
  /* Get input and add new todo object into todos */
  const { value: task } = taskInputElement;
  const { value: color } = colorInputElement;
  if (task) {
    // check for duplicate task entry
    for (let i = 0; i < todos.length; i++) {
      if (todos[i].task === task) return;
    }
    todos.push(new Todo(task, color))
    updateTodoDisplay(1);
  }
  // clear taskInput
  taskInputElement.value = '';
}

function updateTodoDisplay(animateLast) {
  /* Generate card HTML for every todo and display */
  let innerHTML = '';
  todos.forEach((todoItem, index) => {
    // animate last N cards
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
  // only scroll if adding new cards
  if (animateLast) todoDisplayContainer.scrollTop = todoDisplayContainer.scrollHeight;

  bindDeleteButtons();
  saveTodos();
}

function bindDeleteButtons() {
  /* Set function for every delete button and handle animations */
  const todoDisplayDeleteElements = document.querySelectorAll('.js-todo-display-delete');
  todoDisplayDeleteElements.forEach((todoDisplayDeleteElement) => {
    todoDisplayDeleteElement.addEventListener('click', () => {
      // remove deleted task
      const deletedTask = todoDisplayDeleteElement.dataset.todoTask;
      todos = todos.filter((todoItem) => todoItem.task !== deletedTask);
      // animate all cards under deleted card and deleted card
      let found = false, animationDuration;
      document.querySelectorAll('.todo-display-card').forEach((todoCard, index) => {
        if (found) {
          todoCard.style.translate = "0px -130%";
        }
        if ((todoCard.innerText === deletedTask)) {
          todoCard.style.scale = 0;
          found = true;
          const styleTransitionDuration = window.getComputedStyle(todoCard).transitionDuration;
          animationDuration = Number(styleTransitionDuration.slice(0, styleTransitionDuration.length - 1)) * 1000;
        }
      })
      // update display after animation ends
      setTimeout(() => {
        updateTodoDisplay(0)
      }, animationDuration);
    })
  })
}

function saveTodos() {
  /* Save todos in localStorage */
  localStorage.setItem(TODO_KEY, JSON.stringify(todos));
}

function loadTodos() {
  /* Get todos from localStorage and handle failures */
  try {
    let loadedTodos = JSON.parse(localStorage.getItem(TODO_KEY));
    return loadedTodos && Array.isArray(loadedTodos) ? loadedTodos : defaultTodos;
  } catch (error) {
    console.log(`Error loading todos: ${error}`);
    return defaultTodos;
  }
}

const defaultTodos = [
  { task: 'Wash the Dishes', color: 'blue' },
  { task: 'Dance to a Song', color: 'green' },
  { task: 'Do Math Homework', color: 'red' },
  { task: 'Commit Arson', color: 'white' },
  { task: 'Sleep 8 Hours', color: 'orange' }
]

const TODO_KEY = 'todoKey';
let todos = loadTodos();

// elements
const taskInputElement = document.getElementById('todo-task-input');
const colorInputElement = document.getElementById('todo-color-input');
const todoAddButtonElement = document.querySelector('.js-todo-add-button');
const todoDisplayContainer = document.querySelector('.js-todo-display-container');

// event listeners
taskInputElement.addEventListener('keydown', handleTaskInputKeyDown)
colorInputElement.addEventListener('change', updateColorInput);
todoAddButtonElement.addEventListener('click', addTask);

// first render
updateTodoDisplay(todos.length);