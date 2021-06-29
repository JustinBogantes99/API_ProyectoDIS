class ControllerServicio {

    getNombre(servicio){
        return servicio.getNombre()
    }

    getPrecio(servicio){
        return servicio.getPrecio()
    }

    getMaximoPersonas(servicio){
        return servicio.getMaximoPersonas()
    }

}

export {ControllerServicio}