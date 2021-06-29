class ControllerVisitorMisClases {

    //Getters
    getFecha(visitor){
        return visitor.getFecha()
    }

    getClases(visitor){
        return visitor.getClases()
    }

    getNombreUsuario(visitor){
        return visitor.getNombreUsuario()
    }

    //Setters
    setFecha(visitor, fecha){
        visitor.setFecha(fecha)
    }

    setClases(visitor, clases){
        visitor.setClases(clases)
    }

    setNombreUsuario(visitor, nombreUsuario){
        visitor.setNombreUsuario(nombreUsuario)
    }

}

export {ControllerVisitorMisClases}