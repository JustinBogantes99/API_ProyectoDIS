import axios from 'axios';
import { Controller } from '../Controller/Controller';
import { Notifier } from '../Observer/Notifier';
import { Subscriber } from '../Observer/Observer';
class AgregarClaseInstructorStrategy{
    constructor(){
        this.controller = new Controller()
        this.clases = ''
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
        var claseObject = JSON.parse(JSON.stringify(this.clases))

        //Hay que cambiar de nombre ciertos datos del instructor, que están distintos del propio instructor y  las clases
        var instructor = {
            cedula: claseObject.instructor.cedula, 
            nombreCompleto: claseObject.instructor.nombreCompleto,
            celular: claseObject.instructor.telefono,
            correo: claseObject.instructor.correo,
            TRol: claseObject.instructor.rol,
            estado: claseObject.instructor.estado,
            cuenta: claseObject.instructor.cuenta,
            servicios: claseObject.instructor.servicios
        }

        var clase = {
            nombre: claseObject.nombre,
            capacidadMaxima: claseObject.capacidadMaxima,
            diaEjecucion: claseObject.diaEjecucion,
            instructor: instructor,
            horaInicio: claseObject.horaInicio,
            horaFin: claseObject.horaFin,
            precio: claseObject.precio,
            servicio: claseObject.servicio,
            pagos:[],
            estado:'Standby'
        }
        
        const nuevasClasesFinal = {
            nombreSala: this.nombreSala,
            nuevasClases: [clase]
        }

        this.controller.addClase(nuevasClasesFinal)

        //Observer para admin
        var notifier = new Notifier()
        this.controller.getAdministradoresSala(this.nombreSala)
        .then(listaAdministradores => {
            for(var i = 0; i < listaAdministradores.length; i++){
                notifier.subscribe(new Subscriber(listaAdministradores[i]));
            }

            let mensaje= "El instructor "+clase.instructor.nombreCompleto+" solicitó la aprobación de la clase: "+ clase.nombre;
            
            notifier.notify(mensaje);

            notifier.clearSubscribers();
        })
    }

    async addClass(info) {
        await axios.post('https://api-dis2021.herokuapp.com/Sala/agregarClases', info);
        alert('¡Petición Agregada!')
        window.location.replace('/menuPeticion')
    }
}
export {AgregarClaseInstructorStrategy}