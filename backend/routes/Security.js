const router = require('express').Router();
var bcrypt = require ('bcrypt');
const saltRounds = 10;


router.route('/salting').post((req, res) => {
    bcrypt.hash(req.body.contrasenia, saltRounds, function(err, hash) {
        res.json(hash);
    })
});

router.route('/checking').post((req, res) => {
    bcrypt.compare(req.body.contraseniaInsertada, req.body.contraseniaReal, function(err, response){
        res.json(response);
    })
});

module.exports = router;