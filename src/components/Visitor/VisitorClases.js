import { Visitor } from "./Visitor"

class VisitorClases extends Visitor{
    constructor(fecha){
        super()
        this.clases = []
        this.fecha = fecha
    }

    //Getters
    getClases(){
        return this.clases
    }

    getFecha(){
        return this.fecha
    }

    //Setters
    setClases(clases){
        this.clases = clases
    }

    setFecha(fecha){
        this.fecha = fecha
    }

    //Funciones
    execute (sala){
        const listaClases = sala.getClases()
        const listaClasesDiaSel = []

        for(var i = 0; i < listaClases.length; i++){
            if(this.fecha.getTime() === new Date(listaClases[i].diaEjecucion).getTime() && listaClases[i].estado === 'Autorizado'){
                listaClasesDiaSel.push(listaClases[i])
            }
        }

        listaClasesDiaSel.sort(function(a,b){
            if(a.horaInicio < b.horaInicio) { return -1; }
            if(a.horaInicio > b.horaInicio) { return 1; }
            return 0;
        })

        this.clases = listaClasesDiaSel
    }
}

export {VisitorClases}