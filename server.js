'use strict';
const PORT = 9000;
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

console.log('please change your mysql root & password & database');
// mysql configuration
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : '',
  password : '',
  database : ''
});

// Tester la connection à MySQL
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});


// express configuration
const app = express();
app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/app'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));


// GET
app.get('/todos', function(request, response) {
	connection.query('SELECT * FROM todo', function (error, results, fields) {
		console.log(fields);

		if (error) {
			console.log(error);
			response.json({ error: error });
		}
		console.log(results);
		response.json(results);
	});
});

// GET /todos/1
app.get('/todos/:id', function(request, response) {
	let id = request.params.id;
	connection.query(`SELECT * FROM todo WHERE id = ${id}`, function (error, result, fields) {
		if (error) {
			console.log(error);
			response.json({ error: error });
		}
		console.log(result);
		response.json(result);
	});
});

//  POST insertion d'un todo dans BD
app.post('/todos', function(request, response) {
	let todo = request.body;
	let query = `INSERT INTO todo SET ?`;
	let queryBis = `INSERT INTO todo (title, active) VALUES('${todo.title}', ${todo.active})`;

	connection.query(query, todo, function (error, result, fields) {
		if (error) {
			console.log(error);
			response.json({ error: error });
		}
		console.log(result);
		if (result.insertId)
			response.json({ insertId: result.insertId });
		else {
			response.json({ error: 'insertId null' });
		}
	});
});


app.put('/todos/:id', function(request, response) {
	let id = request.params.id;
	let todo = request.body;
	response.send(id + ' ' + JSON.stringify(todo));
});

app.delete('/todos/:id', function(request, response) {
	let id = request.params.id;
});



app.listen(PORT);

console.log(`--------------------------------------------------
| The root folder is: '${__dirname}/app'
| You can access the application at: http://localhost:${PORT}
---------------------------------------------------------------`);
