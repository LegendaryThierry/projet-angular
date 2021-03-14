let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let StudentAssignmentSchema = Schema({
    _id: Schema.Types.ObjectId,
    assignment: {
        type: Schema.Types.ObjectId,
        ref: "Assignment",
        required: true
    },
    dateDeRendu: Date,
    rendu: Boolean,
    eleve: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    note: String,
    remarque: String
});

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('StudentAssignment', StudentAssignmentSchema, 'studentAssignments');
