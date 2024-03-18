// запрос за пользователями
export async function getUsers() {
  const users = await fetch('https://jsonplaceholder.typicode.com/users');
  const usersList = await users.json();
  addUsers(usersList);
  editUser(usersList);
}

const selectElementAddTodo = document.querySelector('.select-add-users');
const selectElementEditTodo = document.querySelector('.select-edit-users');

// добавление пользователей в select
function addUsers(usersList) {
  for (let i = 0; i < usersList.length; i++) {
    const newUser = document.createElement('option');
    newUser.value = usersList[i].name;
    newUser.innerHTML = usersList[i].name;
    selectElementAddTodo.append(newUser);
  }
}
// изменение пользователя в select
function editUser(usersList) {
  for (let i = 0; i < usersList.length; i++) {
    const newUser = document.createElement('option');
    newUser.value = usersList[i].name;
    newUser.innerHTML = usersList[i].name;
    selectElementEditTodo.append(newUser);
  }
}
