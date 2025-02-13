// Informations relatives à une matière

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let SubjectSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    teachers : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }]
});

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Subject', SubjectSchema, 'subjects');
