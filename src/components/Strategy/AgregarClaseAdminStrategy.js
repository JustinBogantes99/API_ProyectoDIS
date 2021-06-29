import axios from 'axios';
import { Controller } from '../Controller/Controller';
class AgregarClaseAdminStrategy{
    constructor(){
        this.controller = new Controller()
        this.clases = []
        this.nombreSala = ''
    }

    //Setters
    setClases(clases){
        this.clases = clases
    }

    setNombreSala(nombreSala){
        this.nombreSala = nombreSala
    }

    //Getters
    getClases(){
        return this.clases
    }

    getNombreSala(){
        return this.nombreSala
    }

    //Funciones
    execute(){
        const nuevasClasesFinal = {
            nombreSala: this.nombreSala,
            nuevasClases: this.clases
        }

        this.controller.addClase(nuevasClasesFinal)
    }

    async addClass(info) {
        await axios.post('https://api-dis2021.herokuapp.com/Sala/agregarClases', info);
        alert('¡Clases Agregadas!')
        window.location.replace('/menuClases')
    }
}
export {AgregarClaseAdminStrategy}