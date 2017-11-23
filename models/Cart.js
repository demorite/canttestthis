'use strict';
const mongoose = require('mongoose');
const Article = require('./Article');

const cartSchema = new  mongoose.Schema({
    
    products: [Article]

}, { timestamps: true });


const Cart = mongoose.model('carts', cartSchema);

module.exports = Cart;