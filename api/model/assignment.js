let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let AssignmentSchema = Schema({
    id: Number,
    dateLimite: Date,
    dateDeRendu: Date,
    nom: String,
    rendu: Boolean,
    matiere: {
        type: Schema.Types.ObjectId,
        ref: "Subject",
        required: true
    },
    enseignant: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    eleve: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    note: String,
    remarque: String
});

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Assignment', AssignmentSchema, 'assignments');
