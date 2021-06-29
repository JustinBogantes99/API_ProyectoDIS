class ControllerClase {

    //Setters
    setId(clase, id){
        clase.setId(id)
    }

    setNombre(clase, nombre){
        clase.setNombre(nombre)
    }

    setCapacidadMaxima(clase, capacidadMaxima){
        clase.setCapacidadMaxima(capacidadMaxima)
    }

    setDiaEjecucion(clase, diaEjecucion){
        clase.setDiaEjecucion(diaEjecucion)
    }

    setHoraInicio(clase, horaInicio){
        clase.setHoraInicio(horaInicio)
    }

    setHoraFin(clase, horaFin){
        clase.setHoraFin(horaFin)
    }

    setPrecio(clase, precio){
        clase.setPrecio(precio)
    }

    setInstructor(clase, instructor){
        clase.setInstructor(instructor)
    }

    setServicio(clase, servicio){
        clase.setServicio(servicio)
    }

    setPagos(clase, pagos){
        clase.setPagos(pagos)
    }

    setEstado(clase, estado){
        clase.setEstado(estado)
    }


    //Getters
    getId(clase){
        return clase._id
    }

    getNombreClase(clase){
        return clase.getNombre()
    }

    getCapacidadMaxima(clase){
        return clase.getCapacidadMaxima()
    }

    getDiaEjecucion(clase){
        return clase.getDiaEjecucion()
    }

    getHoraInicio(clase){
        return clase.getHoraInicio()
    }

    getHoraFin(clase){
        return clase.getHoraFin()
    }

    getPrecio(clase){
        return clase.getPrecio()
    }

    getInstructor(clase){
        return clase.getInstructor()
    }

    getServicio(clase){
        return clase.getServicio()
    }

    getPagos(clase){
        return clase.getPagos()
    }

    getEstado(clase){
        return clase.getEstado()
    }

}

export {ControllerClase}