import * as bootstrap from 'bootstrap';

const modalWindowElement = document.querySelector('.modal');
const todoFormElement = document.querySelector('#todoForm');
const cardContainer = document.querySelector('.card__container');
const cardContainerInProgress = document.querySelector('.card__container__inprogress');
const cardContainerDone = document.querySelector('.card__container__done');
const todoCounter = document.querySelector('.trello-todo-counter');
const inProgressCounter = document.querySelector('.trello-inprogress-counter');
const doneCounter = document.querySelector('.trello-done-counter');
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

const todos = [];
const inprogress = [];
const done = [];

//проверка содержимого LS
if (localStorage.getItem('todoList')) {
  const dataFromLS = JSON.parse(localStorage.getItem('todoList'));
  for (let i = 0; i < dataFromLS.length; i++) {
    todos[i] = dataFromLS[i];
    // console.log(todos[i]);
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
    createdAt: date,
    whichPanel: 'todo',
  };
  // console.log(document.querySelector('.select-add-users').value);

  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  todos.push(todoObj);
  saveDataToLocalStorage('todoList', todos);
  renderTodo();
}

//функция создает шаблон todo
function createTemplate(todoList) {
  const time = new Date(todoList.createdAt);
  let select1;
  let select2;
  let select3;
  switch (todoList.whichPanel) {
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
    <div class="card" id="${todoList.id}">
        <div class="card-body">
            <h5 class="card-title">${todoList.title}</h5>
            <p class="card-text">${todoList.description}</p>
            <div class="card-bottom">
                <p class="card-user">${todoList.user}</p>
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

//функция рендерит список todo
function renderTodo() {
  let html = '';
  for (let i = 0; i < todos.length; i++) {
    todos[i].whichPanel = 'todo';
    html += createTemplate(todos[i]);
  }
  cardContainer.innerHTML = html;
  todoCounter.innerHTML = todos.length;
}

function renderTodoInProgress() {
  let html = '';
  for (let i = 0; i < inprogress.length; i++) {
    inprogress[i].whichPanel = 'inprogress';
    html += createTemplate(inprogress[i]);
  }
  cardContainerInProgress.innerHTML = html;
  inProgressCounter.innerHTML = inprogress.length;
}

function renderTodoDone() {
  let html = '';
  for (let i = 0; i < done.length; i++) {
    done[i].whichPanel = 'done';
    html += createTemplate(done[i]);
  }
  cardContainerDone.innerHTML = html;
  doneCounter.innerHTML = done.length;
}

//тут все понятно
function saveDataToLocalStorage(key, todoList) {
  // console.log(JSON.stringify(todoList));
  localStorage.setItem(`${key}`, JSON.stringify(todoList));
}

//функция удаляет одно todo

trelloContainerElement.addEventListener('click', deleteOneTodo);

function deleteOneTodo(event) {
  if (
    event.target.id === 'deleteOneTodoButton' ||
    event.target.id === 'deleteOneTodoIcon' ||
    event.target.classList.contains('delete-task-button')
  ) {
    const cardId = event.target.closest('.card').id;
    // console.log(cardId);
    for (let i = 0; i < todos.length; i++) {
      // console.log(typeof cardId, typeof todos[i].id);
      if (cardId === `${todos[i].id}`) {
        // console.log(todos);
        const slicedTodos = todos.splice(i, 1);
        // console.log(todos);
        saveDataToLocalStorage('todoList', todos);
        renderTodo();
      }
    }
    for (let i = 0; i < inprogress.length; i++) {
      // console.log(typeof cardId, typeof todos[i].id);
      if (cardId === `${inprogress[i].id}`) {
        // console.log(todos);
        const slicedTodos = inprogress.splice(i, 1);
        // console.log(todos);
        saveDataToLocalStorage('inprogressList', inprogress);
        renderTodoInProgress();
      }
    }
    for (let i = 0; i < done.length; i++) {
      // console.log(typeof cardId, typeof todos[i].id);
      if (cardId === `${done[i].id}`) {
        // console.log(todos);
        const slicedTodos = done.splice(i, 1);
        // console.log(todos);
        saveDataToLocalStorage('doneList', done);
        renderTodoDone();
      }
    }
  }
}

//редактирование todo

const editFormElement = document.querySelector('#todoFormEdit');

trelloContainerElement.addEventListener('click', handleClickEditTodoForm);

let saveId;

function handleClickEditTodoForm(event) {
  if (event.target.classList.contains('edit-todo')) {
    const cardId = event.target.closest('.card').id;
    saveId = cardId;
    // console.log(saveId, '----------------');
    for (let i = 0; i < todos.length; i++) {
      if (cardId === `${todos[i].id}`) {
        document.getElementById('titleEdit').value = todos[i].title;
        document.getElementById('descriptionEdit').value = todos[i].description;
        document.querySelector('.select-edit-users').value = todos[i].user;
      }
    }
    for (let i = 0; i < inprogress.length; i++) {
      if (cardId === `${inprogress[i].id}`) {
        document.getElementById('titleEdit').value = inprogress[i].title;
        document.getElementById('descriptionEdit').value = inprogress[i].description;
        document.querySelector('.select-edit-users').value = inprogress[i].user;
      }
    }
    for (let i = 0; i < done.length; i++) {
      if (cardId === `${done[i].id}`) {
        document.getElementById('titleEdit').value = done[i].title;
        document.getElementById('descriptionEdit').value = done[i].description;
        document.querySelector('.select-edit-users').value = done[i].user;
      }
    }
  }
}

editFormElement.addEventListener('click', handleClickEditTodo);

function handleClickEditTodo(event) {
  if (event.target.id === 'confirmEdit') {
    const cardStatus = document.getElementById(`${saveId}`);
    switch (cardStatus.parentElement) {
      case cardContainerInProgress:
        writeEditedValue(inprogress);
        saveDataToLocalStorage('inprogressList', inprogress);
        renderTodoInProgress();
        break;
      case cardContainer:
        writeEditedValue(todos);
        saveDataToLocalStorage('todoList', todos);
        renderTodo();
        break;
      case cardContainerDone:
        writeEditedValue(done);
        saveDataToLocalStorage('doneList', done);
        renderTodoDone();
        break;
      default:
        break;
    }

    // for (let i = 0; i < todos.length; i++) {
    //   if (saveId === `${todos[i].id}`) {
    //     todos[i].title = document.getElementById('titleEdit').value;
    //     todos[i].description = document.getElementById('descriptionEdit').value;
    //     todos[i].user = document.querySelector('.select-edit-users').value;
    //     saveDataToLocalStorage('todoList', todos);
    //     renderTodo();
    //   }
    // }
    // for (let i = 0; i < inprogress.length; i++) {
    //   if (saveId === `${inprogress[i].id}`) {
    //     inprogress[i].title = document.getElementById('titleEdit').value;
    //     inprogress[i].description = document.getElementById('descriptionEdit').value;
    //     inprogress[i].user = document.querySelector('.select-edit-users').value;
    //     saveDataToLocalStorage('inprogressList', inprogress);
    //     renderTodoInProgress();
    //   }
    // }
    // for (let i = 0; i < done.length; i++) {
    //   if (saveId === `${done[i].id}`) {
    //     done[i].title = document.getElementById('titleEdit').value;
    //     done[i].description = document.getElementById('descriptionEdit').value;
    //     done[i].user = document.querySelector('.select-edit-users').value;
    //     saveDataToLocalStorage('doneList', done);
    //     renderTodoDone();
    //   }
    // }
  }
}

function writeEditedValue(list) {
  for (let i = 0; i < list.length; i++) {
    if (saveId === `${list[i].id}`) {
      list[i].title = document.getElementById('titleEdit').value;
      list[i].description = document.getElementById('descriptionEdit').value;
      list[i].user = document.querySelector('.select-edit-users').value;
    }
  }
}

//пользователи

async function foo() {
  const users = await fetch('https://jsonplaceholder.typicode.com/users');
  const usersList = await users.json();
  // console.log(usersList);
  addUsers(usersList);
  editUser(usersList);
}
foo();

const selectElementAddTodo = document.querySelector('.select-add-users');
const selectElementEditTodo = document.querySelector('.select-edit-users');
// console.log(selectElementEditTodo);

function addUsers(usersList) {
  for (let i = 0; i < usersList.length; i++) {
    const newUser = document.createElement('option');
    newUser.value = usersList[i].username;
    newUser.innerHTML = usersList[i].username;
    // console.log(newUser);
    selectElementAddTodo.append(newUser);
  }
}

function editUser(usersList) {
  for (let i = 0; i < usersList.length; i++) {
    const newUser = document.createElement('option');
    newUser.value = usersList[i].username;
    newUser.innerHTML = usersList[i].username;
    // console.log(newUser);
    selectElementEditTodo.append(newUser);
  }
}

//перемещение карточек

trelloContainerElement.addEventListener('click', handleClickChangePanel);

function handleClickChangePanel(event) {
  if (event.target.id === 'selectPanel') {
    if (event.target.value === 'inprogress') {
      const cardId = event.target.closest('.card').id;
      for (let i = 0; i < todos.length; i++) {
        if (`${todos[i].id}` === cardId) {
          inprogress.push(todos[i]);
          todos.splice(i, 1);
          saveDataToLocalStorage('todoList', todos);
          saveDataToLocalStorage('inprogressList', inprogress);
          renderTodo();
          renderTodoInProgress();
        }
      }
      for (let i = 0; i < done.length; i++) {
        if (`${done[i].id}` === cardId) {
          inprogress.push(done[i]);
          done.splice(i, 1);
          saveDataToLocalStorage('doneList', done);
          saveDataToLocalStorage('inprogressList', inprogress);
          renderTodoInProgress();
          renderTodoDone();
        }
      }
    }
    if (event.target.value === 'todo') {
      const cardId = event.target.closest('.card').id;
      for (let i = 0; i < inprogress.length; i++) {
        if (`${inprogress[i].id}` === cardId) {
          todos.push(inprogress[i]);
          inprogress.splice(i, 1);
          saveDataToLocalStorage('todoList', todos);
          saveDataToLocalStorage('inprogressList', inprogress);
          renderTodo();
          renderTodoInProgress();
        }
      }
      for (let i = 0; i < done.length; i++) {
        if (`${done[i].id}` === cardId) {
          todos.push(done[i]);
          done.splice(i, 1);
          saveDataToLocalStorage('todoList', todos);
          saveDataToLocalStorage('doneList', done);
          renderTodo();
          renderTodoDone();
        }
      }
    }
    if (event.target.value === 'done') {
      const cardId = event.target.closest('.card').id;
      for (let i = 0; i < inprogress.length; i++) {
        if (`${inprogress[i].id}` === cardId) {
          done.push(inprogress[i]);
          inprogress.splice(i, 1);
          saveDataToLocalStorage('doneList', done);
          saveDataToLocalStorage('inprogressList', inprogress);
          renderTodoInProgress();
          renderTodoDone();
        }
      }
      for (let i = 0; i < todos.length; i++) {
        if (`${todos[i].id}` === cardId) {
          done.push(todos[i]);
          todos.splice(i, 1);
          saveDataToLocalStorage('todoList', todos);
          saveDataToLocalStorage('doneList', done);
          renderTodo();
          renderTodoDone();
        }
      }
    }
  }
}
