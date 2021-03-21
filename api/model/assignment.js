// Informations générale associé à un devoir

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let AssignmentSchema = Schema({
    _id: Schema.Types.ObjectId,
    dateLimite: Date,
    nom: String,
    matiere: {
        type: Schema.Types.ObjectId,
        ref: "Subject",
        required: true
    },
    enseignant: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Assignment', AssignmentSchema, 'assignments');
