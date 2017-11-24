const User = require('../models/User');
const ObjectId = require('mongodb').ObjectID;
const _ = require('lodash');

/**
 * GET /users
 * Users' list
 */
exports.index = (req, res, next) => {
	User.find()
		.then(users => {
			res.json({
				users
			});
		})
};


/**
 * GET /users/:id
 * Users by id
 */
exports.getById = (req, res, next) => {
	
	let id = req.params.id;
	
	User.findOne({_id: new ObjectId(id)})
		.then(user => {
			res.json({
				user
			});
		})
};


/**
 * POST /users
 * Add a user in the db
 */
exports.add = (req, res, next) => {
	
	req.assert('username', 'Username cannot be blank').notEmpty();
	req.assert('name', 'name cannot be blank').notEmpty();
	
	const errors = req.validationErrors();
	
	if (errors) {
		return res.status(404)
			.json({
				code: 404,
				status: 'error',
				message: errors,
			});
	}
	
	let user = new User({
		username: req.body.username,
		name: req.body.name,
	});
	
	user.save()
		.then(() => {
			return res.status(201)
				.json({
					code: 201,
					status: 'success',
					message: 'User created!'
				});
		})
		.catch(err => {
			if (err.code === 11000) {
				return res.status(409)
					.json({
						code: res.statusCode,
						status: 'error',
						message: 'The username you have entered is already associated with an account.',
					});
			}
		});
};


/**
 * PUT /users/:id
 * Edit a user in the db
 */
exports.edit = (req, res, next) => {
	
	let id = req.params.id;
	
	User.findOne({_id: new ObjectId(id)}).then(user => {
		const params = req.body;
		const POSSIBLE_KEYS = ['username', 'name'];
		
		let queryArgs = {};
		
		for (key in params) {
			if (~POSSIBLE_KEYS.indexOf(key)) {
				queryArgs[key] = params[key];
			}
		}
		
		if (_.isEmpty(queryArgs)) {
			let err = new Error('Bad request');
			err.status = 400;
			return next(err);
		}
		
		User.update({_id: new ObjectId(id)}, {$set: queryArgs}).exec().then(err => {
			res.json({
				code: 200,
				status: 'success',
				message: 'User edited'
			});
		})
	})
};


/**
 * Delete /users/:id
 * Delete a user in the db
 */
exports.delete = (req, res, next) => {
	
	let id = req.params.id;
	
	User.remove({_id: new ObjectId(id)}).then(err => {
			res.json({
				code: 200,
				status: 'success',
				message: 'User deleted!'
			});
		})
};