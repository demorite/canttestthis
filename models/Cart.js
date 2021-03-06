'use strict';
const mongoose = require('mongoose');
const Article = require('./Article').articleSchema;

const cartSchema = new  mongoose.Schema({
    
    name: String,
    owner: String,
    articles: [Article]
}, { timestamps: true });

const Cart = mongoose.model('carts', cartSchema);

module.exports = Cart;