const Cart = require('../models/Cart');
const ObjectId = require('mongodb').ObjectID;

/**
 * GET /carts
 * Home page.
 */
exports.index = (req, res, next) => {
    
    Cart.find().then(carts => {
		res.json({ 
			carts
		});
	})
	.catch(err => {
		return next(err);
	});
}


/**
 * GET /carts/:id
 * Carts by id
 */
exports.getById = (req, res, next) => {
    
    let id = req.params.id;

    Cart.findOne({_id: new ObjectId(id)}).then(cart => {
		res.json({ 
			cart
		});
	})
	.catch(err => {
		return next(err);
	});
}


/**
 * POST /carts
 * Add a cart in the db
 */
exports.add = (req, res, next) => {

    req.assert('name', 'Password cannot be blank').notEmpty();

    const errors = req.validationErrors();
    
    if (errors) {
        res.status(404)
           .json({
            code: 404,
            status: 'error',
            message: errors,
        });
    }

    let cart = new Cart({
        name: req.body.name,
    });
    
    cart.save().then(err => {

        res.status(201)
            .json({
            code: 201,
            status: 'success',
            message: 'Cart created!'
        });
    })
    .catch(err => {
        
        return next(err);    
    });
}


/**
 * PUT /carts/:id
 * Edit a cart in the db
 */
exports.edit = (req, res, next) => {
    
    let id = req.params.id;
    
    Cart.findOne({_id: new ObjectId(id)}).then(cart => {
        const params = req.body;
        const POSSIBLE_KEYS = ['name'];
        
        let queryArgs = {};
        
        for (key in params) {
            if (~POSSIBLE_KEYS.indexOf(key)) {
                queryArgs.info[key] = params[key];
            }
        }
        
        if (!queryArgs) {
            let err = new Error('Bad request');
            err.status = 400;
            return Promise.reject(err);
        }

        Cart.update({_id: new ObjectId(id)}, {$set: queryArgs}).exec().then(err => {
            res.json({
                code: 200,
                status: 'success',
                message: 'Cart edited'
            });
        })
        .catch(err => {
            return next(err);
        });
    })
    .catch(err => {
        return next(err);
    });
}


/**
 * Delete /carts/:id
 * Delete a cart in the db
 */
exports.delete = (req, res, next) => {
    
    let id = req.params.id;

    Cart.remove({_id: new ObjectId(id)}).then(err => {
        res.json({
            code: 200,
            status: 'success',
            message: 'Cart deleted!'
        });
    })
    .catch(err => {
        return next(err);
    });
}