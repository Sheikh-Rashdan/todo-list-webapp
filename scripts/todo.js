class Todo {
  constructor(task, color) {
    this.task = task;
    this.color = color;
  }

  task;
  color;
}

const todos = [];

function updateColorInput() {
  const { value: color } = colorInputElement
  colorInputElement.style.backgroundColor = `var(--option-${color})`;
}

function addTask() {
  const { value: task } = taskInputElement;
  const { value: color } = colorInputElement;
  if (task) {
    for (let i = 0; i < todos.length; i++) {
      if (todos[i].task == task) return;
    }
    todos.push(new Todo(task, color))
    updateTodoDisplay();
  }
  taskInputElement.value = '';
}

function updateTodoDisplay() {
  let innerHTML = '';
  todos.forEach((todoItem, index) => {
    innerHTML += `
      <div class="todo-display-card todo-display-${todoItem.color} ${index == todos.length - 1 ? 'todo-display-card-popup' : ''}">
            ${todoItem.task}
            <button class="todo-display-delete" data-todo-task="${todoItem.task}">
                <i class='bx  bxs-trash-x bx-sm'></i>
            </button>
      </div>
      `;
  })
  todoDisplayContainer.innerHTML = innerHTML;
  todoDisplayContainer.scrollTop = todoDisplayContainer.scrollHeight;
}

const taskInputElement = document.getElementById('todo-task-input');
const colorInputElement = document.getElementById('todo-color-input');
const todoAddButtonElement = document.querySelector('.js-todo-add-button');
const todoDisplayContainer = document.querySelector('.js-todo-display-container');

colorInputElement.addEventListener('change', updateColorInput);
todoAddButtonElement.addEventListener('click', addTask);

updateTodoDisplay();