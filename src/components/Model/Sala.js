import { Aforo } from "./Aforo"
import { Clase } from "./Clase"
import { Horario } from "./Horario"
import { Servicio } from "./Servicio"

class Sala {
    constructor(sala){
        if(sala){
            this._id = sala._id
            this.nombre = sala.nombre
            this.capacidadMaxima = sala.capacidadMaxima

            //Horario
            const listaHorarios = []
            for(var i = 0; i < sala.horario.length; i++){
                var manejandoHorario = new Horario(sala.horario[i])
                listaHorarios.push(manejandoHorario)
            }
            this.horario = listaHorarios


            //Aforo
            this.aforo = new Aforo(sala.aforo[0])
            

            //Clases
            var listaClases = []
            for(var i = 0; i < sala.clases.length; i++){
                var manjeandoClase = new Clase(sala.clases[i])
                listaClases.push(manjeandoClase)
            }
            this.clases = listaClases


            //Servicios
            const listaServicios = []
            for(var i = 0; i < sala.servicios.length; i++){
                var manejandoServicio = new Servicio(sala.servicios[i])
                listaServicios.push(manejandoServicio)
            }
            this.servicios = listaServicios

        }else{
            this._id = ''
            this.nombre = ''
            this.capacidadMaxima = 0
            this.horario = []
            this.aforo = new Aforo()
            this.clases = []
            this.servicios = []
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

    getHorario(){
        return this.horario
    }

    getClases(){
        return this.clases
    }

    getAforoMonto(){
        return this.aforo.getMonto()
    }

    getServicios(){
        return this.servicios
    }

    //Setters


    //Visitor
    accept(visitor){
        visitor.execute(this)
    }
}

export {Sala}