const router = require('express').Router();
let Usuario = require('../models/usuario.model');

router.route('/listaUsuarios').get((req, res) => {
    Usuario.find()
    .then(usuarios => res.json(usuarios))
    .catch(err => res.status(400).json('Error: '+ err));
});

router.route('/encontrarCedula').post((req, res) => {
    Usuario.find({"cedula": req.body.cedula})
    .then(usuarios => res.json(usuarios))
    .catch(err => res.status(400).json('Error: '+ err));
});

router.route('/encontrarNombreUsuario').post((req, res) => {
    Usuario.find({"cuenta.nombreUsuario": req.body.nombreUsuario})
    .then(usuarios => res.json(usuarios))
    .catch(err => res.status(400).json('Error: '+ err));
});

router.route('/agregarUsuario').post((req, res) => {
    const nuevoUsuario = new Usuario({
        cedula: req.body.cedula,
        nombreCompleto: req.body.nombreCompleto,
        correo: req.body.correo,
        telefono: req.body.telefono,
        rol: req.body.rol,
        cuenta: req.body.cuenta,
        sala: req.body.sala,
        estado:true,
        herencia: req.body.herencia
    })

    nuevoUsuario.save()
    .then(() => res.json('Usuario agregado!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/editarUsuario').post((req, res) => {
    Usuario.find({"cuenta.nombreUsuario": req.body.cuenta.nombreUsuario})
    .then(usuarios => {
        usuarios[0].cedula = req.body.cedula
        usuarios[0].nombreCompleto = req.body.nombreCompleto
        usuarios[0].correo = req.body.correo
        usuarios[0].telefono = req.body.telefono
        usuarios[0].rol = req.body.rol
        usuarios[0].cuenta = req.body.cuenta
        usuarios[0].sala = req.body.sala
        usuarios[0].estado = req.body.estado
        usuarios[0].herencia = req.body.herencia

        usuarios[0].save()
        .then(() => res.json('Usuario Editado!'))
        .catch(err => res.status(400).json('Error: ' + err));     
    })
    .catch(err => res.status(400).json('Error: '+ err));
});


module.exports = router;