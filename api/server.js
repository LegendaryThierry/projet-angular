let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let assignment = require('./routes/assignments');
const user = require('./routes/users');
const subject = require('./routes/subjects');

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//mongoose.set('debug', true);

//URI de connexion à la base de données MongoDB
const uri = 'mongodb+srv://admin:zidane@cluster0.9oqen.mongodb.net/assignments?retryWrites=true&w=majority';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify:false
};

mongoose.connect(uri, options)
  .then(() => {
    console.log("Connecté à la base MongoDB assignments dans le cloud !");
    console.log("at URI = " + uri);
    console.log("vérifiez with http://localhost:8010/api/assignments que cela fonctionne")
    },
    err => {
      console.log('Erreur de connexion: ', err);
    });

// Pour accepter les connexions cross-domain (CORS)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Pour les formulaires
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let port = process.env.PORT || 8010;

// les routes
const prefix = '/api';

// ----- ASSIGNMENTS ROUTES -----
app.route(prefix + '/assignments')
  .get(assignment.getAssignments)
  .post(assignment.postAssignment)
  .put(assignment.updateAssignment);

app.route(prefix + '/assignments/distinct')
    .get(assignment.getDistinctAssignments)

app.route(prefix + '/assignments/:id')
  .get(assignment.getAssignment)
  .delete(assignment.deleteAssignment);

// ----- USERS ROUTES -----
app.route(prefix + '/users')
    .get(user.getUsers); //Si le service reçoit une requête sur cette URL. Quelle fonction doit-il exécuter ?

app.route(prefix + '/users/findUser')
    .post(user.findUser);

// ----- SUBJECTS ROUTES -----
app.route(prefix + '/subjects')
    .get(subject.getSubjects);

app.route(prefix + '/subjects/findSubject')
    .post(subject.findSubject);
  

// On démarre le serveur
app.listen(port, "0.0.0.0");
console.log('Serveur démarré sur http://localhost:' + port);

module.exports = app;


