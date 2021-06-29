import { Clase } from "../Model/Clase"

class Decorator{
    constructor(clase){
        if(clase){
            this.clase = clase
        }else{
            this.clase = new Clase()
        }
    }

    //Getters
    getClase(){
        return this.clase
    }

    getId(){
        return this.clase.getId()
    }

    getNombre(){
        return this.clase.getNombre()
    }

    getCapacidadMaxima(){
        return this.clase.getCapacidadMaxima()
    }

    getDiaEjecucion(){
        return this.clase.getDiaEjecucion()
    }

    getHoraInicio(){
        return this.clase.getHoraInicio()
    }

    getHoraFin(){
        return this.clase.getHoraFin()
    }

    getPrecio(){
        return this.clase.getPrecio()
    }

    getInstructor(){
        return this.clase.getInstructor()
    }

    getServicio(){
        return this.clase.getServicio()
    }

    getPagos(){
        return this.clase.getPagos()
    }

    getEstado(){
        return this.clase.getEstado()
    }

    //Setters
    setClase(clase){
        this.clase = clase
    }

    setId(id){
        this.clase.setId(id)
    }

    setNombre(nombre){
        this.clase.setNombre(nombre)
    }

    setCapacidadMaxima(capacidadMaxima){
        this.clase.setCapacidadMaxima(capacidadMaxima)
    }

    setDiaEjecucion(diaEjecucion){
        this.clase.setDiaEjecucion(diaEjecucion)
    }

    setHoraInicio(horaInicio){
        this.clase.setHoraInicio(horaInicio)
    }

    setHoraFin(horaFin){
        this.clase.setHoraFin(horaFin)
    }

    setPrecio(precio){
        this.clase.setPrecio(precio)
    }

    setInstructor(instructor){
        this.clase.setInstructor(instructor)
    }

    setServicio(servicio){
        this.clase.setServicio(servicio)
    }

    setPagos(pagos){
        this.clase.setPagos(pagos)
    }

    setEstado(estado){
        this.clase.setEstado(estado)
    }

}

export {Decorator}