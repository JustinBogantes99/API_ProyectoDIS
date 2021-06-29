import { Instructor } from "./Instructor"
import { Pago } from "./Pago"
import { Servicio } from "./Servicio"

class Clase {
    constructor(clase){
        if(clase){
            this._id = clase._id
            this.nombre = clase.nombre
            this.capacidadMaxima = clase.capacidadMaxima
            this.diaEjecucion = clase.diaEjecucion
            this.horaInicio = clase.horaInicio
            this.horaFin = clase.horaFin
            this.precio = clase.precio

            //instructor
            this.instructor = new Instructor(clase.instructor, false)

            //servicio
            this.servicio = new Servicio(clase.servicio)

            //pagos
            const listaPagos = []
            for(var i = 0; i < clase.pagos.length; i++){
                var manjeandoPago = new Pago(clase.pagos[i])
                listaPagos.push(manjeandoPago)
            }
            this.pagos = listaPagos

            this.estado = clase.estado

        }else{
            this._id = ''
            this.nombre = ''
            this.capacidadMaxima = 0
            this.diaEjecucion = new Date()
            this.horaInicio = '07:00'
            this.horaFin = '07:00'
            this.precio = 0

            this.instructor = new Instructor()
            this.servicio = new Servicio()
            this.pagos = []
            this.estado = 'Standby'
        }

    }

    //Getters
    getId(){
        return this._id
    }

    getNombre(){
        return this.nombre
    }

    getCapacidadMaxima(){
        return this.capacidadMaxima
    }

    getDiaEjecucion(){
        return this.diaEjecucion
    }

    getHoraInicio(){
        return this.horaInicio
    }

    getHoraFin(){
        return this.horaFin
    }

    getPrecio(){
        return this.precio
    }

    getInstructor(){
        return this.instructor
    }

    getServicio(){
        return this.servicio
    }

    getPagos(){
        return this.pagos
    }

    getEstado(){
        return this.estado
    }

    //Setters
    setId(id){
        this._id = id
    }

    setNombre(nombre){
        this.nombre = nombre
    }

    setCapacidadMaxima(capacidadMaxima){
        this.capacidadMaxima = capacidadMaxima
    }

    setDiaEjecucion(diaEjecucion){
        this.diaEjecucion = diaEjecucion
    }

    setHoraInicio(horaInicio){
        this.horaInicio = horaInicio
    }

    setHoraFin(horaFin){
        this.horaFin = horaFin
    }

    setPrecio(precio){
        this.precio = precio
    }

    setInstructor(instructor){
        this.instructor = instructor
    }

    setServicio(servicio){
        this.servicio = servicio
    }

    setPagos(pagos){
        this.pagos = pagos
    }

    setEstado(estado){
        this.estado = estado
    }
}

export {Clase}