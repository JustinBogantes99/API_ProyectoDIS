import { Visitor } from "./Visitor"
import { DecoratorEstado } from '../Decorator/DecoratorEstado'
import { TModo } from '../Decorator/TModo'

class VisitorClasesDecorator extends Visitor{
    constructor(fecha){
        super()
        this.clases = []
        this.fecha = fecha
        this.nombreUsuario = ''
    }

    //Getters
    getClases(){
        return this.clases
    }

    getFecha(){
        return this.fecha
    }

    getNombreUsuario(){
        return this.nombreUsuario
    }

    //Setters
    setClases(clases){
        this.clases = clases
    }

    setFecha(fecha){
        this.fecha = fecha
    }

    setNombreUsuario(nombreUsuario){
        console.log('nombreUsuario: '+nombreUsuario)
        this.nombreUsuario = nombreUsuario
    }

    //Funciones
    execute(sala){
        const listaClases = sala.getClases()
        const listaClasesDiaSel = []
        
        for(var i = 0; i < listaClases.length; i++){
            if(this.fecha.getTime() === new Date(listaClases[i].diaEjecucion).getTime()){
                if(listaClases[i].instructor.cuenta.nombreUsuario === this.nombreUsuario){
                    if(listaClases[i].estado === 'Autorizado'){
                        if(listaClases[i].getPagos().length > 0){
                            listaClasesDiaSel.push(new DecoratorEstado(listaClases[i], TModo.SoloLectura))
                        }else{
                            listaClasesDiaSel.push(new DecoratorEstado(listaClases[i], TModo.Editable))
                        }
                    }else{
                        listaClasesDiaSel.push(new DecoratorEstado(listaClases[i], TModo.Editable))
                    }
                }else{
                    listaClasesDiaSel.push(new DecoratorEstado(listaClases[i], TModo.SoloLectura))
                }
            }
        }

        listaClasesDiaSel.sort(function(a,b){
            if(a.getHoraInicio() < b.getHoraInicio()) { return -1; }
            if(a.getHoraInicio() > b.getHoraInicio()) { return 1; }
            return 0;
        })
        
        this.clases = listaClasesDiaSel
    }
}

export {VisitorClasesDecorator}