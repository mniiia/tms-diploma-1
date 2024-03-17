import {
  addTodo,
  todos,
  inprogress,
  done,
  progressionTabs,
  localStorageKeys,
  inProgressCounter,
  cardContainerInProgress,
  cardContainer,
  cardContainerDone,
  renderTodo,
} from './app.js';
import {renderAll, renderTodo, renderTodoDone} from './render.js';
import {saveAllDataToLocalStorage, saveDataToLocalStorage} from './localStorage.js';

// добавление todo после нажатия кнопки confirm
export function handleClickTodoForm(event) {
  if (event.target.id === 'confirm') {
    addTodo();
  }
}

// функция удаляет одно todo
export function deleteOneTodo({target}) {
  if (
    target.id === 'deleteOneTodoButton' ||
    target.id === 'deleteOneTodoIcon' ||
    target.classList.contains('delete-task-button')
  ) {
    const cardId = target.closest('.card').id;
    for (let i = 0; i < progressionTabs.length; i++) {
      deleteOneTodoHelper(cardId, progressionTabs[i]);
      saveDataToLocalStorage(localStorageKeys[i], progressionTabs[i]);
    }
  }
}

function deleteOneTodoHelper(cardId, array) {
  for (let i = 0; i < array.length; i++) {
    if (cardId === `${array[i].id}`) {
      array.splice(i, 1);

      renderAll();
    }
  }
}

// редактирование todo
let saveId;
export function handleClickEditTodoForm({target}) {
  if (target.classList.contains('edit-todo')) {
    const cardId = target.closest('.card').id;
    saveId = cardId;
    for (let i = 0; i < progressionTabs.length; i++) {
      editTodoFormHelper(cardId, progressionTabs[i]);
    }
  }
}

function editTodoFormHelper(cardId, array) {
  for (let i = 0; i < array.length; i++) {
    if (cardId === `${array[i].id}`) {
      document.getElementById('titleEdit').value = array[i].title;
      document.getElementById('descriptionEdit').value = array[i].description;
      document.querySelector('.select-edit-users').value = array[i].user;
    }
  }
}

//записывание сохраненного результата в таск
export function handleClickEditTodo(event) {
  if (event.target.id === 'confirmEdit') {
    const cardStatus = document.getElementById(`${saveId}`);
    switch (cardStatus.parentElement) {
      case cardContainerInProgress:
        writeEditedValue(inprogress);
        saveAllDataToLocalStorage();
        renderAll();
        break;
      case cardContainer:
        writeEditedValue(todos);
        saveAllDataToLocalStorage();
        renderAll();
        break;
      case cardContainerDone:
        writeEditedValue(done);
        saveAllDataToLocalStorage();
        renderAll();
        break;
      default:
        break;
    }
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

// перемещение карточек по столбцам
export function handleClickChangePanel(event) {
  if (event.target.id === 'selectPanel') {
    const cardId = event.target.closest('.card').id;
    const childs = [];
    for (const child of event.target.children) {
      childs.push(child);
    }
    if (event.target.value === 'inprogress' && !childs[1].hasAttribute('selected')) {
      if (+inProgressCounter.innerHTML != 6) {
        const from = [done, todos];
        changePanelFunction(from, inprogress, cardId);
      } else {
        alert('слишком много in progress');
        renderTodo();
        renderTodoDone();
      }
    }
    if (event.target.value === 'todo') {
      const from = [inprogress, done];
      changePanelFunction(from, todos, cardId);
    }
    if (event.target.value === 'done') {
      const from = [inprogress, todos];
      changePanelFunction(from, done, cardId);
    }
  }
}
// from это массив из колонок откуда может быть перенесена таска
function changePanelFunction(from, to, cardId) {
  for (let i = 0; i < from.length; i++) {
    for (let j = 0; j < from[i].length; j++) {
      if (`${from[i][j].id}` === cardId) {
        to.push(from[i][j]);
        from[i].splice(j, 1);
        saveAllDataToLocalStorage();
        renderAll();
      }
    }
  }
}

// удалить все сделанные таски
export function handleClickDeleteAll() {
  const warning = confirm('delete all tasks from done list?');
  if (warning) {
    done.splice(0, done.length);
    saveDataToLocalStorage('doneList', done);
    renderTodoDone();
  }
}

// удаление данных из модального окна при нажатии кнопки cancel
export function handleClickCancel(event) {
  if (event.target.id === 'exampleModal' || event.target.id === 'cancel') {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.querySelector('.select-add-users').value = 'user';
  }
}
