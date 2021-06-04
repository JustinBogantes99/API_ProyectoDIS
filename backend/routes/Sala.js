const router = require('express').Router();
let Sala = require('../models/sala.model');

router.route('/listaSalas').get((req, res) => {
    Sala.find()
    .then(salas => res.json(salas))
    .catch(err => res.status(400).json('Error: '+ err));
});

router.route('/encontrarSala').post((req, res) => {
    Sala.find({"nombre": req.body.nombre})
    .then(salas => res.json(salas))
    .catch(err => res.status(400).json('Error: '+ err));
});

router.route('/agregarSala').post((req, res) => {
    const nuevaSala = new Sala({
        nombre:req.body.nombre,
        capacidadMaxima:req.body.capacidadMaxima,
        horario:[],
        aforo: req.body.aforo,
        clases:[],
        servicios:[],
        horario: req.body.horario
    });

    nuevaSala.save()
    .then(() => res.json('¡Sala agregada!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/editarSala').post((req, res) => {
    Sala.find({"nombre": req.body.actualName})
    .then(salas => {
        salas[0].nombre = req.body.nombre
        salas[0].capacidadMaxima = req.body.capacidadMaxima
        salas[0].aforo[0].porcentaje = req.body.aforo
        salas[0].horario = req.body.horario

        salas[0].save()
        .then(() => res.json('¡Sala Editada!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: '+ err));
});


//Operaciones de Servicios
router.route('/encontrarServicio').post((req, res) => {
    Sala.find({"nombre": req.body.nombreSala},{"servicios": {$elemMatch:{"nombre": req.body.nombre}}})
    .then(salas => res.json(salas))
    .catch(err => res.status(400).json('Error: '+ err));
});

router.route('/agregarServicio').post((req, res) => {
    Sala.find({"nombre": req.body.nombreSala})
    .then(salas => {
        salas[0].servicios.push(req.body.nuevoServicio)
        salas[0].save()
        .then(() => res.json('¡Servicio Agregado!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: '+ err));
});

router.route('/editarServicio').post((req, res) => {
    Sala.find({"nombre": req.body.nombreSala})
    .then(salas => {
        for(var i=0;i<salas[0].servicios.length;i++){
            if(salas[0].servicios[i].nombre === req.body.nombreOriginal){
                salas[0].servicios[i].nombre = req.body.editandoServicio.nombre
                salas[0].servicios[i].precio = req.body.editandoServicio.precio
                salas[0].servicios[i].maximoPersonas = req.body.editandoServicio.maximoPersonas

                salas[0].save()
                .then(() => res.json('¡Servicio Editado!'))
                .catch(err => res.status(400).json('Error: ' + err));
            }
        }       
    })
    .catch(err => res.status(400).json('Error: '+ err));
});

router.route('/eliminarServicio').post((req, res) => {
    Sala.findOneAndUpdate({"nombre": req.body.nombreSala},{$pull:{servicios:{nombre: req.body.nombre}}}, { safe: true, upsert: true },
    function(err, node) {
        if (err) { return handleError(res, err); }
        return res.json("¡Servicio Eliminado!");
    });
});


//Operaciones de Clases
router.route('/agregarClases').post((req, res) => {
    Sala.find({"nombre": req.body.nombreSala})
    .then(salas => {
        for(var i = 0; i < req.body.nuevasClases.length; i++){
            salas[0].clases.push(req.body.nuevasClases[i])
        }
        
        salas[0].save()
        .then(() => res.json('Clases Agregadas!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: '+ err));
});

router.route('/editarClase').post((req, res) => {
    Sala.find({"nombre": req.body.nombreSala})
    .then(salas => {
        for(var i=0;i<salas[0].clases.length;i++){
            if(salas[0].clases[i]._id == req.body.claseOriginal._id){
                salas[0].clases[i] = req.body.editandoClase

                salas[0].save()
                .then(() => res.json('Clase Editada!'))
                .catch(err => res.status(400).json('Error: ' + err));
            }
        }     
    })
    .catch(err => res.status(400).json('Error: '+ err));
});

router.route('/eliminarClase').post((req, res) => {
    Sala.findOneAndUpdate({"nombre": req.body.nombreSala},{$pull:{clases:{_id: req.body._id}}}, { safe: true, upsert: true },
    function(err, node) {
        if (err) { return handleError(res, err); }
        return res.json("Clase Eliminada!");
    });
});

module.exports = router;