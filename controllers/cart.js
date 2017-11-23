const Cart = require('../models/Cart');
const User = require('../models/User');
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

    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('username', 'Username cannot be blank').notEmpty();
    req.assert('articles', 'Articles cannot be blank').notEmpty();

    const errors = req.validationErrors();
    
    if (errors) {
        res.status(404)
           .json({
            code: 404,
            status: 'error',
            message: errors,
        });
    }

    User.findOne({username: req.body.username}).then(user => {

        let articles = [];
        
        req.body.articles.forEach( x => {
            articles.push({name: x});
        });

        let cart = new Cart({
            name: req.body.name,
            owner: req.body.username,
            articles: articles,
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
    })
    .catch(err => {
        res.status(404)
            .json({
            code: 404,
            status: 'error',
            message: 'Username doesn\'t exist!',
        });   
    });
}


/**
 * DELETE /carts/:id
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


/**
 * PUT /carts/:id/articles
 * Add a article in the cart
 */
exports.addArticles = (req, res, next) => {

    req.assert('articles', 'Articles cannot be blank').notEmpty();
    
    const errors = req.validationErrors();
    
    if (errors) {
        return res.status(404).json({
            code: 404,
            status: 'error',
            message: errors,
        });
    }
    
    let id = req.params.id;
    
    Cart.findOne({_id: new ObjectId(id)}).then(cart => {
        
        let article = {};
        
        req.body.articles.forEach( x => {
            article = {name: x};
        
            Cart.update({_id: new ObjectId(id)}, {$push: {articles: article}})
                .exec()
                .then(err => {
                    if (err) { return next(err);}
                    article = {};
                })
                .catch(err => {
                    return next(err);
                });
        });

        return res.json({
            code: 200,
            status: 'success',
            message: 'Article added to the Cart!'
        });
    })
    .catch(err => {
        return res.json({
            code: 404,
            status: 'error',
            message: 'Cart not found!'
        });
    });
}

/**
 * PUT /carts/:id/articles/:id_article/flag
 * Edit a cart in the db
 */
exports.setFlag = (req, res, next) => {
    
    req.assert('flag', 'Flag cannot be blank').notEmpty();
        
    const errors = req.validationErrors();
        
    if (errors) {
        res.status(404)
           .json({
            code: 404,
            status: 'error',
            message: errors,
        });
    }
        
    let id = req.params.id;
    let id_article = req.params.id_article;
        
    Cart.findOne({_id: new ObjectId(id)}).then(cart => {
            
        let article = cart.articles.id(id_article);
        let flag = article.flag === 'OK' ? 'NOT OK' : 'OK';
        
        Cart.update({_id: new ObjectId(id), 'articles._id': id_article}, 
                {
                    $set: {
                        'articles.$.flag': flag
                    }
                }
            )
            .exec().then(err => {

                res.json({
                    code: 200,
                    status: 'success',
                    message: `Article's flag set to ${flag} in the Cart!`,
                });
            })
            .catch(err => {
                return next(err);
            });
    })
    .catch(err => {
        res.status(404).json({
            code: 404,
            status: 'error',
            message: 'Cart not found!'
        });
    });
}