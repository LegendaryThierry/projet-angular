const Subject = require('../model/subject');

// Récupérer tous les subjects (GET)
function getSubjects(req, res){
    Subject.find()
        .populate("teacher")
        .exec()//Nom de la clé que l'on veut populer
        .then(function(subjects){
            res.json(subjects);
        })
        .catch(function(err){
            res.json(err);
        });
}

// Récupérer un subject avec son title (POST)
function findSubject(req, res){
    let title = req.body.title;

    Subject.findOne({title: title})
        .populate("teacher") //Nom de la clé que l'on veut populer
        .exec()
        .then(function(subject){
            res.json(subject);
        })
        .catch(function(err){
            res.json(err);
        })
}

// Ajout d'un subjects (POST)
function postSubject(req, res){
    let subject = new Subject();
    subject.id = req.body.id;
    subject.nom = req.body.nom;
    subject.dateDeRendu = req.body.dateDeRendu;
    subject.rendu = req.body.rendu;

    subject.save( (err) => {
        if(err){
            res.send('cant post subjects ', err);
        }
        res.json({ message: `${subject.nom} saved!`})
    })
}

// Update d'un subjects (PUT)
function updateSubject(req, res) {

    Subject.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, subject) => {
        if (err) {
            res.send(err)
        }
        res.json({message: `updated`})
        // console.log('updated ', subjects)
    });

}

// suppression d'un subjects (DELETE)
function deleteSubject(req, res) {

    Subject.findByIdAndRemove(req.params.id, (err, subject) => {
        if (err) {
            res.send(err);
        }
        res.json({message: `${subject.nom} deleted`});
    })
}



module.exports = { getSubjects, postSubject, findSubject, updateSubject, deleteSubject };
