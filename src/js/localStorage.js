import {renderAll, renderTodo, renderTodoDone, renderTodoInProgress} from './render.js';
import {todos, inprogress, done, progressionTabs, localStorageKeys} from './app.js';

// проверка содержимого всех LS
export function getDataFromLocalStorage() {
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
