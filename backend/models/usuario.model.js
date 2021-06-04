const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    cedula:{type:String},
    nombreCompleto:{type:String},
    correo:{type:String},
    telefono:{type:String},
    rol:{type:String},
    cuenta:{nombreUsuario:String, contrasenia:String},
    sala:{idSala:String, nombreSala:String},
    estado:{type:Boolean},
    herencia:[mongoose.Schema.Types.Mixed]
})

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;