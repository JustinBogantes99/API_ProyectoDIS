import { Cuenta } from "./Cuenta"
import { Servicio } from "./Servicio"

class Instructor {
    constructor(instructor, full){
        if(instructor){
            this.cedula = instructor.cedula
            this.nombreCompleto = instructor.nombreCompleto
            this.correo = instructor.correo
            this.estado = instructor.estado
    
            //Cuenta
            this.cuenta = new Cuenta(instructor.cuenta)

        }else{
            this.cedula = ''
            this.nombreCompleto = ''
            this.correo = ''
            this.estado = ''

            //Cuenta
            this.cuenta = new Cuenta()
        }
        

        if(full){
            this.telefono = instructor.telefono
            this.rol = instructor.rol
            this.sala = instructor.sala
            
            //Servicios
            const listaServicios = []
            for(var i = 0; i < instructor.herencia[0].length; i++){
                var manjeandoServicio = new Servicio(instructor.herencia[0][i])
                listaServicios.push(manjeandoServicio)
            }
            
            listaServicios.sort(function(a,b){
                if(a.getNombre() < b.getNombre()) { return -1; }
                if(a.getNombre() > b.getNombre()) { return 1; }
                return 0;
            })

            this.servicios = listaServicios
        }else{
            this.telefono = ""
            this.rol = ""
            this.sala = ""
            this.servicios = []
        }
    }

    getNombreCompleto(){
        return this.nombreCompleto
    }

    getNombreUsuario(){
        return this.cuenta.getNombreUsuario()
    }

    getServicios(){
        return this.servicios
    }
}

export {Instructor}