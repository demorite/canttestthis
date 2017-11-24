const express = require('express');
const mongoose = require('mongoose');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const expressValidator = require('express-validator');
const logger = require('morgan');

const app = express();
const PORT = process.env.PORT || 8083;

/**
 * Express configuration.
 */
app.set('json spaces', 2);
app.use(logger('dev'));
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
const cartController = require('./controllers/cart');

/**
 *  Routes
 */
app.get('/', indexController.index);

app.get('/users', userController.index);
app.get('/users/:id([a-z0-9]{12,})', userController.getById);
app.post('/users', userController.add);
app.put('/users/:id([a-z0-9]{12,})', userController.edit);
app.delete('/users/:id([a-z0-9]{12,})', userController.delete);

app.get('/carts', cartController.index);
app.get('/carts/:id', cartController.getById);
app.post('/carts', cartController.add);
app.delete('/carts/:id', cartController.delete);
app.put('/carts/:id/articles', cartController.addArticles);
app.put('/carts/:id/articles/:id_article/flag', cartController.setFlag);

/**
 * Error 404
 */
app.use((req, res, next) => {
    let err = new Error('Not Found')
    err.status = 404
    next(err)
});

/**
 * Error handler
 */
app.use((err, req, res, next) => {

    let data = {
        message: err.message,
        status: err.status || 500
    }

    if(app.get('env') === 'development') {
       data.stack = err.stack
    }

    res.status(data.status)
    res.format({
        json: () => { res.send(data) }
    });
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
