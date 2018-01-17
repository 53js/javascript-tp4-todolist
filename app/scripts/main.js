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

function createTodo(newTodo) {
	let xhr = new XMLHttpRequest();
	xhr.onload = function handleCreateTodoRequest() {
		let response = JSON.parse(this.responseText);
		console.log(response);
		if (response.error) {
			console.log('error : ', response.error);
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
	if (todo.active === 0 ) {
		cloneLI.querySelector('.todo-active').checked = true;
		cloneLI.querySelector('span').style.textDecoration =  'line-through';
		cloneLI.querySelector('span').style.opacity =  0.5;
	}
	return cloneLI;
}


function readTodoList() {
	let xhr = new XMLHttpRequest();
	xhr.onload = handleReadTodoListRequest;
	xhr.open('GET', BASE_URL + 'todos');
	xhr.send();
}

function handleReadTodoListRequest() {
	// ici this <=> xhr
	let response = this.responseText;
	console.log(response);
	console.log(typeof response);
	let todolist = JSON.parse(response);
	renderTodoList(todolist);
}

function renderTodoList(todolist) {
	todolist.forEach(function(todo) {
		insertTodoInHTML(todo);
	});
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
	console.log(response);
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
