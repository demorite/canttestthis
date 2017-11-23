const express = require('express');
const mongoose = require('mongoose');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const expressValidator = require('express-validator');

const app = express();
const PORT = process.env.PORT || 8083;

/**
 * Express configuration.
 */
app.set('json spaces', 2);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride());
app.use(expressValidator());

/**
 * Controllers (route handlers).
 */
const indexController = require('./controllers/index');
const userController = require('./controllers/user');
//const articleController = require('./controllers/article');
//const cartController = require('./controllers/cart');

/**
 *  Routes
 */
app.get('/', indexController.index);

app.get('/users', userController.index);
app.get('/users/:id', userController.getById);
app.post('/users', userController.add);
app.put('/users/:id', userController.edit);
app.delete('/users/:id', userController.delete);

 

app.use((req, res, next) => {
	res.status(404);
	return res.send(`<body style="width: 100%;height: 100vh; background-size: contain;background: black url(https://http.cat/${res.statusCode}) no-repeat center;"></body>`)
});

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_DOCKER_URI || 'mongodb://localhost:27017/test-unitaire', {useMongoClient: true})
	.then(() => {
		console.log('%s Connection has been established successfully with the database', chalk.green('✓'));
		/**
		 * Running server
		 */
		app.listen(PORT, () => {
			console.log('%s App is running at http://localhost:%d', chalk.green('✓'), PORT);
			console.log('-- Press CTRL-C to stop --\n');
		});
	})
	.catch(err => {
		console.error(Object.assign({},err, {
			message: `${err.message}\n
			${chalk.red('✗')} MongoDB connection error. Please make sure MongoDB is running.`
		}));
	});

module.exports = app;
