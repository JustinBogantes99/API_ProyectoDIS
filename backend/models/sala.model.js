const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const salaSchema = new Schema({
    nombre:{type:String},
    capacidadMaxima:{type:Number},
    horario:[{dia:String, inicio:String, cierre:String}],
    aforo:[{porcentaje:Number}],
    clases:[{nombre:String, capacidadMaxima:Number, diaEjecucion:String, instructor:{cedula:String, nombreCompleto:String, celular:Number, correo:String, TRol:String,
             estado:Boolean, cuenta:{nombreUsuario:String,contrasenia:String}, servicios:{nombre:String, precio:Number, maximoPersonas:Number}}, 
            servicio:{nombre:String, precio:Number, maximoPersonas:Number}, horaInicio:{type:String}, horaFin:{type:String}, precio: {type:Number},
            pagos:[{fechaPago:String, clienteNombreUsuario:String, monto:Number, estado:String, metodoPago:String}]}],
    servicios:[{nombre:String, precio:Number, maximoPersonas:Number}]
})

const Sala = mongoose.model('Sala', salaSchema);

module.exports = Sala;