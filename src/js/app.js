import {
  handleClickTodoForm,
  deleteOneTodo,
  handleClickEditTodoForm,
  handleClickEditTodo,
  handleClickChangePanel,
  handleClickDeleteAll,
} from './handlers.js';
import * as bootstrap from 'bootstrap';

const modalWindowElement = document.querySelector('.modal');
const todoFormElement = document.querySelector('#todoForm');
export const cardContainer = document.querySelector('.trello__card-container');
export const cardContainerInProgress = document.querySelector('.trello__card-container-inprogress');
export const cardContainerDone = document.querySelector('.trello__card-container-done');
const todoCounter = document.querySelector('.trello__todo-counter');
export const inProgressCounter = document.querySelector('.trello__inprogress-counter');
const doneCounter = document.querySelector('.trello__done-counter');
const trelloContainerElement = document.querySelector('.trello__container');

//time
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

//колонки
export const todos = [];
export const inprogress = [];
export const done = [];

export const progressionTabs = [todos, inprogress, done];
export const localStorageKeys = ['todoList', 'inprogressList', 'doneList'];

//проверка содержимого LS
if (localStorage.getItem('todoList')) {
  const dataFromLS = JSON.parse(localStorage.getItem('todoList'));
  for (let i = 0; i < dataFromLS.length; i++) {
    todos[i] = dataFromLS[i];
  }
  renderTodo();
}

if (localStorage.getItem('inprogressList')) {
  const dataFromLS = JSON.parse(localStorage.getItem('inprogressList'));
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

//добавление todo после нажатия кнопки confirm
todoFormElement.addEventListener('click', handleClickTodoForm);
// function handleClickTodoForm(event) {
//   if (event.target.id === 'confirm') {
//     addTodo();
//   }
// }

//функция добавляющая данные в todo и в LC
export function addTodo() {
  const date = new Date();
  class todoObj2 {
    id = Date.now();
    constructor(title, description, user) {
      this.title = title;
      this.description = description;
      this.user = user;
    }
    createdAt = date;
    whichPanel = 'todo';
  }

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const user = document.querySelector('.select-add-users').value;

  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  document.querySelector('.select-add-users').value = 'user';

  const todoItem = new todoObj2(title, description, user);
  todos.push(todoItem);
  saveDataToLocalStorage('todoList', todos);
  renderTodo();
}

//функция создает шаблон todo
function createTemplate({id, createdAt, whichPanel, title, description, user}) {
  const time = new Date(createdAt);
  let select1;
  let select2;
  let select3;
  switch (whichPanel) {
    case 'todo':
      select1 = 'selected';
      break;
    case 'inprogress':
      select2 = 'selected';
      break;
    case 'done':
      select3 = 'selected';
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
                <a href="#" class="btn card-btn-edit edit-todo"><i class="fa-solid fa-pen edit-todo"></i></a>
                </button>
                <select id="selectPanel" class="form-select" aria-label="Disabled select example">
                <option ${select1} value="todo">todo</option>
                <option ${select2} value="inprogress">in progress</option>
                <option ${select3} value="done">done</option>
                </select>
                <button class="card-management-button delete-task-button">
                <a id="deleteOneTodoButton" href="#" class="btn card-btn-delete"><i id="deleteOneTodoIcon" class="fa-solid fa-trash"></i></a>
                </button>
              
            </div>
        </div>
    </div>
    `;
}

//функции рендера
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

//тут все понятно
export function saveDataToLocalStorage(key, todoList) {
  localStorage.setItem(`${key}`, JSON.stringify(todoList));
}

export function saveAllDataToLocalStorage() {
  for (let i = 0; i < progressionTabs.length; i++) {
    localStorage.setItem(`${localStorageKeys[i]}`, JSON.stringify(progressionTabs[i]));
  }
}

//функция удаляет одно todo
trelloContainerElement.addEventListener('click', deleteOneTodo);

// function deleteOneTodo({target}) {
//   if (
//     target.id === 'deleteOneTodoButton' ||
//     target.id === 'deleteOneTodoIcon' ||
//     target.classList.contains('delete-task-button')
//   ) {
//     const cardId = target.closest('.card').id;
//     for (let i = 0; i < progressionTabs.length; i++) {
//       deleteOneTodoHelper(cardId, progressionTabs[i]);
//       saveDataToLocalStorage(localStorageKeys[i], progressionTabs[i]);
//     }
//   }
// }

// function deleteOneTodoHelper(cardId, array) {
//   for (let i = 0; i < array.length; i++) {
//     if (cardId === `${array[i].id}`) {
//       array.splice(i, 1);
//       renderAll();
//     }
//   }
// }

//редактирование todo
const editFormElement = document.querySelector('#todoFormEdit');
trelloContainerElement.addEventListener('click', handleClickEditTodoForm);
// let saveId;
// function handleClickEditTodoForm({target}) {
//   if (target.classList.contains('edit-todo')) {
//     const cardId = target.closest('.card').id;
//     saveId = cardId;
//     for (let i = 0; i < progressionTabs.length; i++) {
//       editTodoFormHelper(cardId, progressionTabs[i]);
//     }
//   }
// }

// function editTodoFormHelper(cardId, array) {
//   for (let i = 0; i < array.length; i++) {
//     if (cardId === `${array[i].id}`) {
//       document.getElementById('titleEdit').value = array[i].title;
//       document.getElementById('descriptionEdit').value = array[i].description;
//       document.querySelector('.select-edit-users').value = array[i].user;
//     }
//   }
// }

//записывание сохраненного результата в таск
editFormElement.addEventListener('click', handleClickEditTodo);
// function handleClickEditTodo(event) {
//   if (event.target.id === 'confirmEdit') {
//     const cardStatus = document.getElementById(`${saveId}`);
//     switch (cardStatus.parentElement) {
//       case cardContainerInProgress:
//         writeEditedValue(inprogress);
//         saveAllDataToLocalStorage();
//         renderAll();
//         break;
//       case cardContainer:
//         writeEditedValue(todos);
//         saveAllDataToLocalStorage();
//         renderAll();
//         break;
//       case cardContainerDone:
//         writeEditedValue(done);
//         saveAllDataToLocalStorage();
//         renderAll();
//         break;
//       default:
//         break;
//     }
//   }
// }
// function writeEditedValue(list) {
//   for (let i = 0; i < list.length; i++) {
//     if (saveId === `${list[i].id}`) {
//       list[i].title = document.getElementById('titleEdit').value;
//       list[i].description = document.getElementById('descriptionEdit').value;
//       list[i].user = document.querySelector('.select-edit-users').value;
//     }
//   }
// }

//пользователи
async function getUsers() {
  const users = await fetch('https://jsonplaceholder.typicode.com/users');
  const usersList = await users.json();
  addUsers(usersList);
  editUser(usersList);
}
getUsers();

const selectElementAddTodo = document.querySelector('.select-add-users');
const selectElementEditTodo = document.querySelector('.select-edit-users');

function addUsers(usersList) {
  for (let i = 0; i < usersList.length; i++) {
    const newUser = document.createElement('option');
    newUser.value = usersList[i].username;
    newUser.innerHTML = usersList[i].username;
    selectElementAddTodo.append(newUser);
  }
}

function editUser(usersList) {
  for (let i = 0; i < usersList.length; i++) {
    const newUser = document.createElement('option');
    newUser.value = usersList[i].username;
    newUser.innerHTML = usersList[i].username;
    selectElementEditTodo.append(newUser);
  }
}

//перемещение карточек
trelloContainerElement.addEventListener('click', handleClickChangePanel);

// function handleClickChangePanel(event) {
//   if (event.target.id === 'selectPanel') {
//     const cardId = event.target.closest('.card').id;
//     if (event.target.value === 'inprogress') {
//       if (inProgressCounter == 6) {
//         alert('слишком много in progress');
//         renderTodoInProgress();
//       } else {
//         const from = [done, todos];
//         changePanelFunction(from, inprogress, cardId);
//       }
//     }
//     if (event.target.value === 'todo') {
//       const from = [inprogress, done];
//       changePanelFunction(from, todos, cardId);
//     }
//     if (event.target.value === 'done') {
//       const from = [inprogress, todos];
//       changePanelFunction(from, done, cardId);
//     }
//   }
// }
//from это массив из колонок откуда может быть перенесена таска
// function changePanelFunction(from, to, cardId) {
//   for (let i = 0; i < from.length; i++) {
//     for (let j = 0; j < from[i].length; j++) {
//       if (`${from[i][j].id}` === cardId) {
//         to.push(from[i][j]);
//         from[i].splice(j, 1);
//         saveAllDataToLocalStorage();
//         renderAll();
//       }
//     }
//   }
// }

//удалить все сделанные
const deleteAllElement = document.querySelector('.trello__delete-all');
deleteAllElement.addEventListener('click', handleClickDeleteAll);

// function handleClickDeleteAll() {
//   const warning = confirm('delete all tasks from done list?');
//   if (warning) {
//     done.splice(0, done.length);
//     saveDataToLocalStorage('doneList', done);
//     renderTodoDone();
//   }
// }
