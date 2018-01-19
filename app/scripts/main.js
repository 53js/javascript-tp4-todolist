'use strict';
const BASE_URL = 'http://localhost:9000/'
const ENTER_KEY = 13;


const todolist = [];

const todolistUL = document.querySelector('ul.todo-list');
const modelLI = document.querySelector('.model li');
const newTodoInput = document.querySelector('#new-todo-input');

newTodoInput.addEventListener('keyup', onKeyUp);

// creer le todo (JS) quand l'utilisateur appuye sur enter dans l'input
function onKeyUp(event) {
	let value = this.value.trim();
	if (!value || event.which !== ENTER_KEY ) {
		return;
	}
	let newTodo = new Todo(value);
	this.value = '';
	createTodo(newTodo);
}


// CREATE

function createTodo(newTodo) {
	let xhr = new XMLHttpRequest();
	xhr.onload = function handleCreateTodoRequest() {
		let response = JSON.parse(this.responseText);
		if (response.error) {
		}
		if (response.insertId) {
			newTodo.id = response.insertId;
			insertTodoInHTML(newTodo);
		}
	};
	xhr.open('POST', BASE_URL + 'todos');
	xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
	xhr.send(JSON.stringify(newTodo));
}


// inserer un todo dans le HTML
function insertTodoInHTML(todo) {
	let newTodo = createHTMLTodo(todo);
	todolistUL.appendChild(newTodo);
}

// Creer le HTML d'un todo
function createHTMLTodo(todo) {
	/*
		// méthode 1
		let li = document.createElement('li');
		let span = document.createElement('span');
		span.textContent = todo.title;
		li.appendChild(span);
		return li;
	*/
	let cloneLI = modelLI.cloneNode(true);
	cloneLI.querySelector('span').textContent = todo.title;
	cloneLI.id = 'todo-' + todo.id;
	// active = 1 = A FAIRE
	// active = 0 = FAIT
	if (todo.active === 0 ) {
		cloneLI.querySelector('.todo-active').checked = true;
		cloneLI.querySelector('span').style.textDecoration =  'line-through';
		cloneLI.querySelector('span').style.opacity =  0.5;
	} else {
		cloneLI.querySelector('.todo-active').checked = false;
		cloneLI.querySelector('span').style.textDecoration =  'normal';
		cloneLI.querySelector('span').style.opacity =  1;
	}
	return cloneLI;
}

// READ

function readTodoList() {
	let xhr = new XMLHttpRequest();
	xhr.onload = handleReadTodoListRequest;
	xhr.open('GET', BASE_URL + 'todos');
	xhr.send();
}

function handleReadTodoListRequest() {
	// ici this <=> xhr
	let response = this.responseText;
	let todolist = JSON.parse(response);
	renderTodoList(todolist);
}

function renderTodoList(todolist) {
	// suppression de tous les fils de UL (donc tous les <li>)
	while(todolistUL.firstChild) {
		todolistUL.removeChild(todolistUL.firstChild);
	}
	// todolistUL.innerHTML = ''; // non standard

	todolist.forEach(function(todo) {
		insertTodoInHTML(todo);
	});
}


// DELETE

document.querySelector('.todo-list').addEventListener('click', clickOnUl);

function clickOnUl(event) {
	let target = event.target;
	let btn;
	// clique direct sur le bouton
	if (target.classList.contains('delete-btn')) {
		btn = target;
	}
	// clique sur l'icon du bouton
	else if (target.parentNode.classList.contains('delete-btn')) {
		btn = target.parentNode;
	}
	// btn n'est pas null donc j'ai cliqué soit sur le btn soit sur l'icon
	if (btn) {
		let id = (btn.parentNode.id).split('-')[1];
		console.log(id);
		deleteTodo(id);
	}
}


function deleteTodo(id) {
	let xhr = new XMLHttpRequest();
	xhr.onload = handleDeleteTodoRequest;
	xhr.open('DELETE', BASE_URL + 'todos' + '/' + id);
	xhr.send();
}

function handleDeleteTodoRequest() {
	let response = JSON.parse(this.responseText);
	console.log(response);
	if (response.success) {
		// méthode 1 on supprime la ligne (le <li>)
		let id = response.success;
		document.querySelector('#todo-' + id).remove();
		// méthode 2
		// on refait un GET pour récuperer tous les todos !
		// moins performant (car refait une requete)
		// readTodoList();
	}
}


// UPDATE

document.querySelector('.todo-list').addEventListener('change', changeOnUl);

function changeOnUl(event) {
	let target = event.target;
	if (target.classList.contains('todo-active')) {
		changeStatusTodo(target);
	}
}

function changeStatusTodo(input) {
	let isChecked = input.checked;
	let id = (input.parentNode.id).split('-')[1];
	let title = input.parentNode.querySelector('.todo-title').textContent;
	updateTodo(id, title, !isChecked);
}

function updateTodo(id, title, active) {
	let xhr = new XMLHttpRequest();
	xhr.onload = handlePUTodoRequest;
	xhr.open('PUT', BASE_URL + 'todos' + '/' + id);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
	xhr.send(JSON.stringify({
		title: title,
		active: active
	}));
}

function handlePUTodoRequest() {
	let response = JSON.parse(this.responseText);
	if (response.success) {
		readTodoList();
	}
}

(function init() {
	readTodoList();
})();





/* Solution avec callback */
/*
function readTodoList(callback) {
	let xhr = new XMLHttpRequest();
	xhr.callback = callback;
	xhr.onload = handleReadTodoListRequest;
	xhr.open('GET', BASE_URL + 'todos');
	xhr.send();
}Acheter des pommes
￼

function handleReadTodoListRequest() {
	// ici this <=> xhr
	let response = this.responseText;
	console.log(typeof response);
	let todolist = JSON.parse(response);
	// renderTodoList(todolist);
	this.callback(todolist)
}




(function init() {
	// promises
	readTodoList(function(todolist) {
		todolist.forEach(function(todo) {
			insertTodoInHTML(todo);
		});
	});
})();
*/

/* Solution avec promise  */
