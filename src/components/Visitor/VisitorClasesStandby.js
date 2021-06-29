import { Visitor } from "./Visitor"

class VisitorClasesStandby extends Visitor{
    constructor(){
        super()
        this.clases = []
    }

    //Getters
    getClases(){
        return this.clases
    }

    //Setters
    setClases(clases){
        this.clases = clases
    }


    //Funciones
    execute (sala){
        const listaClases = sala.getClases()
        const listaClasesStandby = []

        for(var i = 0; i < listaClases.length; i++){
            if(listaClases[i].estado === 'Standby'){
                listaClasesStandby.push(listaClases[i])
            }
        }

        listaClasesStandby.sort(function(a,b){
            if(a.diaEjecucion < b.diaEjecucion) { return -1; }
            if(a.diaEjecucion > b.diaEjecucion) { return 1; }
            return 0;
        })

        this.clases = listaClasesStandby
    }
}

export {VisitorClasesStandby}