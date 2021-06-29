class ControllerSala {

    //Getters
    getNombre(sala){
        return sala.getNombre()
    }

    getCapacidadMaxima(sala){
        return sala.getCapacidadMaxima()
    }

    getAforoMonto(sala){
        return sala.getAforoMonto()
    }

    getHorario(sala){
        return sala.getHorario()
    }

    getServicios(sala){
        return sala.getServicios()
    }

    //Funciones
    pushClase(sala, clase){
        var listaClases = sala.getClases()
        listaClases.push(clase)
    }

    manejarVisitor(sala, visitor){
        sala.accept(visitor)
    }

}

export {ControllerSala}