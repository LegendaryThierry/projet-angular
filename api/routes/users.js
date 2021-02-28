const User = require('../model/user');

// Récupérer tous les users (GET)
function getUsers(req, res){
    User.find((err, users) => {
        if(err){
            res.send(err)
        }

        res.send(users);
    });
}

// Récupérer un users avec son username et password (POST)
function findUser(req, res){
    let username = req.body.username;
    let password = req.body.password;

    User.findOne({username: username, password: password}, (err, user) =>{
        if(err){
            console.log(err)
            res.send(err)
        }
        res.json(user);
    })
}

// Ajout d'un users (POST)
function postUser(req, res){
    let user = new User();
    user.id = req.body.id;
    user.nom = req.body.nom;
    user.dateDeRendu = req.body.dateDeRendu;
    user.rendu = req.body.rendu;

    user.save( (err) => {
        if(err){
            res.send('cant post users ', err);
        }
        res.json({ message: `${user.nom} saved!`})
    })
}

// Update d'un users (PUT)
function updateUser(req, res) {

    User.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, user) => {
        if (err) {
            res.send(err)
        }
        res.json({message: `updated`})
        // console.log('updated ', users)
    });

}

// suppression d'un users (DELETE)
function deleteUser(req, res) {

    User.findByIdAndRemove(req.params.id, (err, user) => {
        if (err) {
            res.send(err);
        }
        res.json({message: `${user.nom} deleted`});
    })
}



module.exports = { getUsers, postUser, findUser, updateUser, deleteUser };
