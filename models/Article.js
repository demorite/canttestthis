'use strict';
const mongoose = require('mongoose');
const articleSchema = new  mongoose.Schema({
    
    name: String,
    flag: {
        type: String,
        enum: ['OK', 'NOT OK'],
        default: 'NOT OK',
    }

}, { timestamps: true });
const Article = mongoose.model('articles', articleSchema);
module.exports = {articleSchema, Article};