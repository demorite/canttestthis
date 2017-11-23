const Article = require('../models/Article');

/**
 * GET /articles
 * Home page.
 */
exports.index = (req, res, next) => {
    
    Article.find().then(articles => {
		res.json({ 
			articles
		});
	})
	.catch(err => {
		return next(err);
	});
}


/**
 * GET /articles/:id
 * Articles by id
 */
exports.getById = (req, res, next) => {
    
    let id = req.params.id;

    Article.findOne({_id: new ObjectId(id)}).then(article => {
		res.json({ 
			article
		});
	})
	.catch(err => {
		return next(err);
	});
}


/**
 * POST /articles
 * Add a article in the db
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

    let article = new Article({
        name: req.body.name,
    });
    
    article.save().then(err => {

        res.status(201)
            .json({
            code: 201,
            status: 'success',
            message: 'Article created!'
        });
    })
    .catch(err => {
        
        return next(err);    
    });
}


/**
 * PUT /articles/:id
 * Edit a article in the db
 */
exports.edit = (req, res, next) => {
    
    let id = req.params.id;
    
    Article.findOne({_id: new ObjectId(id)}).then(article => {
        const params = req.body;
        const POSSIBLE_KEYS = ['name', 'items'];
        
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

        Article.update({_id: new ObjectId(id)}, {$set: queryArgs}).exec().then(err => {
            res.json({
                code: 200,
                status: 'success',
                message: 'Article edited'
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
 * Delete /articles/:id
 * Delete a article in the db
 */
exports.delete = (req, res, next) => {
    
    let id = req.params.id;

    Article.remove({_id: new ObjectId(id)}).then(err => {
        res.json({
            code: 200,
            status: 'success',
            message: 'Article deleted!'
        });
    })
    .catch(err => {
        return next(err);
    });
}