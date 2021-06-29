import { Visitor } from "./Visitor"

class VisitorMisClases extends Visitor{
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

        console.log(this)

        for(var i = 0; i < listaClases.length; i++){
            if(this.fecha.getTime() === new Date(listaClases[i].diaEjecucion).getTime() && listaClases[i].instructor.cuenta.nombreUsuario === this.nombreUsuario){
                //Agregar el Filtro para clases con pagos
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

export {VisitorMisClases}