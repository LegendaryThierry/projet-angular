let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = Schema({
    username: String,
    password: String,
    first_name: String,
    last_name: String
});

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('User', UserSchema);
