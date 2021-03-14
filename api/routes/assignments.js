let Assignment = require('../model/assignment');
let StudentAssignment = require('../model/studentAssignment');
const mongoose = require("mongoose");


// Récupérer tous les assignments (GET)
function getAssignments(req, res){
    Assignment.find()
        .populate("matiere")
        .populate("enseignant")
        .exec()
        .then(function(subjects){
            res.json(subjects);
        })
        .catch(function(err){
            res.json(err);
        });
}

// Récupérer un assignment par son id (GET)
function getAssignment(req, res){
    let assignmentId = req.params.id;

    Assignment.findOne({_id: assignmentId})
        .populate("matiere")
        .populate("enseignant")
        .populate("eleve") //Nom de la clé que l'on veut populer
        .then(function (subject){
            res.json(subject);
        })
        .catch(function (err){
            res.json(err);
        });
}

// Ajout d'un assignment (POST)
function postAssignment(req, res){
    let assignmentID = mongoose.Types.ObjectId();
    let assignment = new Assignment();
    assignment._id = assignmentID;
    assignment.nom = req.body.assignment.nom;
    assignment.matiere = req.body.assignment.matiere._id;
    assignment.enseignant = req.body.assignment.enseignant._id;
    assignment.dateLimite = req.body.assignment.dateLimite;

    assignment.save( (err) => {
        if(err){
            res.send('cant post assignment ', err);
        }

        req.body.students.forEach(studentAssignmentData => {
            console.log(studentAssignmentData);
            let studentAssignment = new StudentAssignment();
            studentAssignment._id = mongoose.Types.ObjectId();
            studentAssignment.assignment = assignmentID;
            studentAssignment.dateDeRendu = null;
            studentAssignment.rendu = false;
            studentAssignment.eleve = studentAssignmentData._id;
            studentAssignment.note = null;
            studentAssignment.remarque = '';

            studentAssignment.save((err) => {
                if (err) {
                    res.send('cant post assignment ', err);
                }
            });
        });

        res.json({ message: `${assignment.nom} saved!`})
    })
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    Assignment.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, assignment) => {
        console.log(assignment)
        if (err) {
            res.send(err)
        }
        res.json({message: `updated`})
      // console.log('updated ', assignment)
    });
}

// suppression d'un assignment (DELETE)
function deleteAssignment(req, res) {
    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            res.send(err);
        }

        StudentAssignment.deleteMany({assignment: req.params.id}, (err, studentAssignment) => {
            if (err) {
                res.send(err);
            }
            res.json({message: `Successfully deleted !`})
        })
    })
}

function getDistinctAssignments(req, res){
    let resultArray = [];

    Assignment.aggregate(
        [
            {
                "$group": {
                    "_id": {"nom": "$nom", "enseignant": "$enseignant", "matiere": "$matiere", "dateLimite": "$dateLimite"}
                }
            }
        ]
    ).then(function (result){
        result.forEach(function (data){
            let x = new Assignment()
            x.nom = data._id.nom
            x.enseignant = data._id.enseignant
            x.matiere = data._id.matiere
            x.dateLimite = data._id.dateLimite
            resultArray.push(x)
        });

        Assignment.populate(resultArray, {path: "enseignant"}).then(function (result){
            Assignment.populate(result, {path: "matiere"}).then(function (result){
                res.json(result)
            });
        });
    });
}



module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment, getDistinctAssignments};
