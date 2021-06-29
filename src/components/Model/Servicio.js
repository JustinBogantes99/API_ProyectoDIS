class Servicio {
    constructor(servicio){
        if(servicio){
            this.nombre = servicio.nombre
            this.precio = servicio.precio
            this.maximoPersonas = servicio.maximoPersonas
        }else{
            this.nombre = ''
            this.precio = ''
            this.maximoPersonas = ''
        }
    }

    //Getters
    getNombre(){
        return this.nombre
    }

    getPrecio(){
        return this.precio
    }

    getMaximoPersonas(){
        return this.maximoPersonas
    }

    //Setters
    setNombre(nombre){
        this.nombre = nombre
    }

    setPrecio(precio){
        this.precio = precio
    }

    setMaximoPersonas(maximoPersonas){
        this.maximoPersonas = maximoPersonas
    }
}

export {Servicio}