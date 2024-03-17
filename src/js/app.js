import {
  handleClickTodoForm,
  deleteOneTodo,
  handleClickEditTodoForm,
  handleClickEditTodo,
  handleClickChangePanel,
  handleClickDeleteAll,
  handleClickCancel,
} from './handlers.js';
import 'bootstrap/js/dist/modal';

const todoFormElement = document.querySelector('#todoForm');
export const cardContainer = document.querySelector('.trello__card-container');
export const cardContainerInProgress = document.querySelector('.trello__card-container-inprogress');
export const cardContainerDone = document.querySelector('.trello__card-container-done');
const todoCounter = document.querySelector('.trello__todo-counter');
export const inProgressCounter = document.querySelector('.trello__inprogress-counter');
const doneCounter = document.querySelector('.trello__done-counter');
const trelloContainerElement = document.querySelector('.trello__container');

// установка таймера в верхней части сайта
const timeElement = document.querySelector('.trello__time');
timeElement.textContent = getTime();

function getTime(date = new Date()) {
  let seconds = date.getSeconds();
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  return `${hours}:${minutes}`;
}

setInterval(() => (timeElement.textContent = getTime()), 1000);

// массивы в которых хранятся задания в разных состояниях
export const todos = [];
export const inprogress = [];
export const done = [];

// массивы для использования в функциях помощниках
export const progressionTabs = [todos, inprogress, done];
export const localStorageKeys = ['todoList', 'inProgressList', 'doneList'];

// проверка содержимого всех LS
if (localStorage.getItem('todoList')) {
  const dataFromLS = JSON.parse(localStorage.getItem('todoList'));
  for (let i = 0; i < dataFromLS.length; i++) {
    todos[i] = dataFromLS[i];
  }
  renderTodo();
}

if (localStorage.getItem('inProgressList')) {
  const dataFromLS = JSON.parse(localStorage.getItem('inProgressList'));
  for (let i = 0; i < dataFromLS.length; i++) {
    inprogress[i] = dataFromLS[i];
  }
  renderTodoInProgress();
}

if (localStorage.getItem('doneList')) {
  const dataFromLS = JSON.parse(localStorage.getItem('doneList'));
  for (let i = 0; i < dataFromLS.length; i++) {
    done[i] = dataFromLS[i];
  }
  renderTodoDone();
}

// добавление todo после нажатия кнопки confirm
todoFormElement.addEventListener('click', handleClickTodoForm);

// класс содержащий структуру таска
class todoItemClass {
  id = Date.now();
  constructor(title, description, user) {
    this.title = title;
    this.description = description;
    this.user = user;
  }
  createdAt = new Date();
  whichPanel = 'todo';
}

// функция добавляющая данные в todo и в local storage
export function addTodo() {
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const user = document.querySelector('.select-add-users').value;

  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  document.querySelector('.select-add-users').value = 'user';

  const todoItem = new todoItemClass(title, description, user);
  todos.push(todoItem);
  saveDataToLocalStorage('todoList', todos);
  renderTodo();
}

// функция создает шаблон todo
function createTemplate({id, createdAt, whichPanel, title, description, user}) {
  const time = new Date(createdAt);
  let selectedValueTodo;
  let selectedValueInProgress;
  let selectedValueDone;
  switch (whichPanel) {
    case 'todo':
      selectedValueTodo = 'selected';
      break;
    case 'inprogress':
      selectedValueInProgress = 'selected';
      break;
    case 'done':
      selectedValueDone = 'selected';
      break;

    default:
      break;
  }
  return `
    <div class="card" id="${id}">
      <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">${description}</p>
        <div class="card-bottom">
          <p class="card-user">${user}</p>
          <p class="card-time">${getTime(time)}</p>
        </div>
        <div class="card-management">
          <button
            class="card-management-button edit-todo"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#editModal"
          >
            <a href="#" class="btn card-btn-edit edit-todo"
              ><i class="fa-solid fa-pen edit-todo"></i
            ></a>
          </button>
          <select
            id="selectPanel"
            class="form-select"
          >
            <option ${selectedValueTodo} value="todo">todo</option>
            <option ${selectedValueInProgress} value="inprogress">
              in progress
            </option>
            <option ${selectedValueDone} value="done">done</option>
          </select>
          <button class="card-management-button delete-task-button">
            <a id="deleteOneTodoButton" href="#" class="btn card-btn-delete"
              ><i id="deleteOneTodoIcon" class="fa-solid fa-trash"></i
            ></a>
          </button>
        </div>
      </div>
    </div>
    `;
}

// функции рендера
export function renderAll() {
  renderTodo();
  renderTodoDone();
  renderTodoInProgress();
}

export function renderTodo() {
  let html = '';
  for (let i = 0; i < todos.length; i++) {
    todos[i].whichPanel = 'todo';
    html += createTemplate(todos[i]);
  }
  cardContainer.innerHTML = html;
  todoCounter.innerHTML = todos.length;
}
export function renderTodoInProgress() {
  let html = '';
  for (let i = 0; i < inprogress.length; i++) {
    inprogress[i].whichPanel = 'inprogress';
    html += createTemplate(inprogress[i]);
  }
  cardContainerInProgress.innerHTML = html;
  inProgressCounter.innerHTML = inprogress.length;
}
export function renderTodoDone() {
  let html = '';
  for (let i = 0; i < done.length; i++) {
    done[i].whichPanel = 'done';
    html += createTemplate(done[i]);
  }
  cardContainerDone.innerHTML = html;
  doneCounter.innerHTML = done.length;
}

// сохранение данных в local storage по ключу
export function saveDataToLocalStorage(key, todoList) {
  localStorage.setItem(`${key}`, JSON.stringify(todoList));
}
// сохранение всех данных в LC
export function saveAllDataToLocalStorage() {
  for (let i = 0; i < progressionTabs.length; i++) {
    localStorage.setItem(`${localStorageKeys[i]}`, JSON.stringify(progressionTabs[i]));
  }
}

// функция удаляет одно todo
trelloContainerElement.addEventListener('click', deleteOneTodo);

// функция редактирования todo
const editFormElement = document.querySelector('#todoFormEdit');
trelloContainerElement.addEventListener('click', handleClickEditTodoForm);

//записывание сохраненного результата после редактирования в таск
editFormElement.addEventListener('click', handleClickEditTodo);

// запрос за пользователями
async function getUsers() {
  const users = await fetch('https://jsonplaceholder.typicode.com/users');
  const usersList = await users.json();
  addUsers(usersList);
  editUser(usersList);
}
getUsers();

const selectElementAddTodo = document.querySelector('.select-add-users');
const selectElementEditTodo = document.querySelector('.select-edit-users');

// добавлени пользователей в select
function addUsers(usersList) {
  for (let i = 0; i < usersList.length; i++) {
    const newUser = document.createElement('option');
    newUser.value = usersList[i].username;
    newUser.innerHTML = usersList[i].username;
    selectElementAddTodo.append(newUser);
  }
}
// изменение пользователя в select
function editUser(usersList) {
  for (let i = 0; i < usersList.length; i++) {
    const newUser = document.createElement('option');
    newUser.value = usersList[i].username;
    newUser.innerHTML = usersList[i].username;
    selectElementEditTodo.append(newUser);
  }
}

// перемещение карточек между столбцами
trelloContainerElement.addEventListener('click', handleClickChangePanel);

// удалить все сделанные (колонка done)
const deleteAllElement = document.querySelector('.trello__delete-all');
deleteAllElement.addEventListener('click', handleClickDeleteAll);

// удаление данных из модального окна при нажатии кнопки cancel
const cancelElement = document.querySelector('#exampleModal');
cancelElement.addEventListener('click', handleClickCancel);
console.log(123123);
