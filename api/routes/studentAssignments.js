let StudentAssignment = require('../model/studentAssignment');
const mongoose = require('mongoose');

// Récupérer tous les assignments (GET)
function getStudentAssignments(req, res){
    StudentAssignment.find()
        .populate({
            path:"assignment",
            model: 'Assignment',
            populate: [{
                path: "matiere",
                model: "Subject"
            },{
                path: "enseignant",
                model: "User"
            }]})
        .populate("eleve") //Nom de la clé que l'on veut populer
        .exec()
        .then(function(subjects){
            res.json(subjects);
        })
        .catch(function(err){
            res.json(err);
        });
}

// Récupérer un assignment par son id (GET)
function getStudentAssignment(req, res){
    let assignmentId = req.params.id;

    StudentAssignment.findOne({_id: assignmentId})
        .populate({
            path:"assignment",
            model: 'Assignment',
            populate: [{
                path: "matiere",
                model: "Subject"
            },{
                path: "enseignant",
                model: "User"
            }]})
        .populate("eleve")
        .then(function (subject){
            res.json(subject);
        })
        .catch(function (err){
            res.json(err);
        });
}

// Ajout d'un assignment (POST)
function postStudentAssignment(req, res){
    console.log(req.body);
    req.body.students.forEach(student => {
        let studentAssignment = new StudentAssignment();
        studentAssignment.assignment = req.body.assignment;
        studentAssignment.dateDeRendu = req.body.dateDeRendu;
        studentAssignment.rendu = req.body.rendu;
        studentAssignment.eleve = req.body.eleve;
        studentAssignment.note = req.body.note;
        studentAssignment.remarque = req.body.remarque;

        studentAssignment.save( (err) => {
            if(err){
                res.send('cant post assignment ', err);
            }
            res.json({ message: `${studentAssignment.nom} saved!`})
        })
    });
}

// Update d'un assignment (PUT)
function updateStudentAssignment(req, res) {
    StudentAssignment.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, assignment) => {
        if (err) {
            res.send(err)
        }
        res.json({message: `updated`})
        // console.log('updated ', assignment)
    });
}

// suppression d'un assignment (DELETE)
function deleteStudentAssignment(req, res) {

    StudentAssignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            res.send(err);
        }
        res.json({message: `${assignment.nom} deleted`});
    })
}



module.exports = { getStudentAssignments, postStudentAssignment, getStudentAssignment, updateStudentAssignment, deleteStudentAssignment};
