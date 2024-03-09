import * as bootstrap from 'bootstrap';
console.log(1);

const modalWindowElement = document.querySelector('.modal');
const todoFormElement = document.querySelector('#todoForm');
const cardContainer = document.querySelector('.card__container');

const todos = [];

console.log(modalWindowElement);

todoFormElement.addEventListener('click', handleClickTodoForm);

function handleClickTodoForm(event) {
  if (event.target.id === 'confirm') {
    addTodo();
  }
}

function addTodo() {
  const titleElement = document.getElementById('title');
  const descriptionElement = document.getElementById('description');
  const date = new Date();
  console.log(date.getHours(), date.getMinutes());
  todos.push(createTemplate(titleElement.value, descriptionElement.value, date));
  render();
}

function createTemplate(title, description, time) {
  return `
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">${description}</p>
            <div class="card-bottom">
                <p class="card-user"></p>
                <p class="card-time">${time.getHours()}:${time.getMinutes()}</p>
            </div>
            <div class="card-management">
                <a href="#" class="btn card-btn-edit"><i class="fa-solid fa-pen"></i></a>
                <select class="form-select" aria-label="Disabled select example">
                <option selected value="1">todo</option>
                <option value="2">in progress</option>
                <option value="3">done</option>
                </select>
                <a href="#" class="btn card-btn-delete"><i class="fa-solid fa-trash"></i></a>
            </div>
        </div>
    </div>
    `;
}

function render() {
  let html = '';
  for (let i = 0; i < todos.length; i++) {
    html += todos[i];
    console.log(todos[i]);
  }
  cardContainer.innerHTML = html;
}
