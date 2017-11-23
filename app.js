const express = require('express');
const mongoose = require('mongoose');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const expressValidator = require('express-validator');

const app = express();
const PORT = 8081;

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

 

app.get("*", (req, res, next) => {
	if(res.statusCode === 200)
		res.status(404);
	res.send('<body style="' +
		'background-image: url(https://http.cat/'+res.statusCode+');' +
		'width: 100%;' +
		'height: 100vh;' +
		'background-size: contain;' +
		'background-color: black;' +
		'background-position: center;' +
		'background-repeat: no-repeat;' +
		'"></body>')
});

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_DOCKER_URI || 'mongodb://localhost:27017/test-unitaire',
                {
                    useMongoClient: true
				})
				.then(() => {

					console.log('%s Connection has been established successfully with the database', chalk.green('✓'));
					
					/**
					 * Running server
					 */
					app.listen(PORT, (err) => {
						if (err)
							console.error(err);
						console.log('%s App is running at http://localhost:%d', chalk.green('✓'), PORT);
						console.log('-- Press CTRL-C to stop --\n');
					});
				})
				.catch(err => {
					console.error(err);
					console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
					process.exit();
				});