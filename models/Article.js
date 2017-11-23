'use strict';
const mongoose = require('mongoose');
const articleSchema = new  mongoose.Schema({
    
    name: String,
    items: Number,
    flag: {
        type: String,
        enum: ['OK', 'NOT OK']
    }

}, { timestamps: true });
const Article = mongoose.model('articles', articleSchema);
module.exports = {articleSchema, Article};