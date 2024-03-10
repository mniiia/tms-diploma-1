import * as bootstrap from 'bootstrap';

const modalWindowElement = document.querySelector('.modal');
const todoFormElement = document.querySelector('#todoForm');
const cardContainer = document.querySelector('.card__container');

const todos = [];

//проверка содержимого LS
if (localStorage.getItem('todoList')) {
  const dataFromLS = JSON.parse(localStorage.getItem('todoList'));
  for (let i = 0; i < dataFromLS.length; i++) {
    todos[i] = dataFromLS[i];
    console.log(todos[i]);
  }
  renderTodo();
}

//добавление todo после нажатия кнопки confirm
todoFormElement.addEventListener('click', handleClickTodoForm);
function handleClickTodoForm(event) {
  if (event.target.id === 'confirm') {
    addTodo();
  }
}

//функция добавляющая данные в todo и в LC
function addTodo() {
  const date = new Date();

  const todoObj = {
    id: Date.now(),
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    user: document.querySelector('.select-add-users').value,
    time: date,
  };
  console.log(document.querySelector('.select-add-users').value);

  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  todos.push(todoObj);
  saveDataToLocalStorage(todos);
  renderTodo();
}

//функция создает шаблон todo
function createTemplate(todoList) {
  const time = new Date(todoList.time);
  return `
    <div class="card" id="${todoList.id}">
        <div class="card-body">
            <h5 class="card-title">${todoList.title}</h5>
            <p class="card-text">${todoList.description}</p>
            <div class="card-bottom">
                <p class="card-user">${todoList.user}</p>
                <p class="card-time">${time.getHours()}:${time.getMinutes()}</p>
            </div>
            <div class="card-management">
                <button
                  class="card-management-button edit-todo"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
                >
                <a href="#" class="btn card-btn-edit edit-todo"><i class="fa-solid fa-pen edit-todo"></i></a>
                </button>
                <select class="form-select" aria-label="Disabled select example">
                <option selected value="1">todo</option>
                <option value="2">in progress</option>
                <option value="3">done</option>
                </select>
                <button class="card-management-button delete-task-button">
                <a id="deleteOneTodoButton" href="#" class="btn card-btn-delete"><i id="deleteOneTodoIcon" class="fa-solid fa-trash"></i></a>
                </button>
              
            </div>
        </div>
    </div>
    `;
}

//функция рендерит список todo
function renderTodo() {
  let html = '';
  for (let i = 0; i < todos.length; i++) {
    html += createTemplate(todos[i]);
  }
  cardContainer.innerHTML = html;
}

//тут все понятно
function saveDataToLocalStorage(todoList) {
  console.log(JSON.stringify(todoList));
  localStorage.setItem('todoList', JSON.stringify(todoList));
}

//функция удаляет одно todo

cardContainer.addEventListener('click', deleteOneTodo);

function deleteOneTodo(event) {
  if (
    event.target.id === 'deleteOneTodoButton' ||
    event.target.id === 'deleteOneTodoIcon' ||
    event.target.classList.contains('card-btn-delete')
  ) {
    const cardId = event.target.closest('.card').id;
    console.log(cardId);
    for (let i = 0; i < todos.length; i++) {
      console.log(typeof cardId, typeof todos[i].id);
      if (cardId === `${todos[i].id}`) {
        console.log(todos);
        const slicedTodos = todos.splice(i, 1);
        console.log(todos);
        saveDataToLocalStorage(todos);
        renderTodo();
      }
    }
  }
}

//редактирование todo

const editFormElement = document.querySelector('#todoFormEdit');

cardContainer.addEventListener('click', handleClickEditTodoForm);
let saveId;

function handleClickEditTodoForm(event) {
  if (event.target.classList.contains('edit-todo')) {
    const cardId = event.target.closest('.card').id;
    saveId = cardId;
    console.log(saveId, '----------------');
    for (let i = 0; i < todos.length; i++) {
      if (cardId === `${todos[i].id}`) {
        document.getElementById('titleEdit').value = todos[i].title;
        document.getElementById('descriptionEdit').value = todos[i].description;
        document.querySelector('.select-edit-users').value = todos[i].user;
      }
    }
  }
}

editFormElement.addEventListener('click', editTodo);

function editTodo(event) {
  if (event.target.id === 'confirmEdit') {
    for (let i = 0; i < todos.length; i++) {
      if (saveId === `${todos[i].id}`) {
        todos[i].title = document.getElementById('titleEdit').value;
        todos[i].description = document.getElementById('descriptionEdit').value;
        todos[i].user = document.querySelector('.select-edit-users').value;
        saveDataToLocalStorage(todos);
        renderTodo();
      }
    }
  }
}

//пользователи

async function foo() {
  const users = await fetch('https://jsonplaceholder.typicode.com/users');
  const usersList = await users.json();
  console.log(usersList);
  addUsers(usersList);
  editUser(usersList);
}

foo();

const selectElementAddTodo = document.querySelector('.select-add-users');
const selectElementEditTodo = document.querySelector('.select-edit-users');
console.log(selectElementEditTodo);

function addUsers(usersList) {
  for (let i = 0; i < usersList.length; i++) {
    const newUser = document.createElement('option');
    newUser.value = usersList[i].username;
    newUser.innerHTML = usersList[i].username;
    console.log(newUser);
    selectElementAddTodo.append(newUser);
  }
}

function editUser(usersList) {
  for (let i = 0; i < usersList.length; i++) {
    const newUser = document.createElement('option');
    newUser.value = usersList[i].username;
    newUser.innerHTML = usersList[i].username;
    console.log(newUser);
    selectElementEditTodo.append(newUser);
  }
}
