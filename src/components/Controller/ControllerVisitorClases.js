class ControllerVisitorClases {

    //Getters
    getFecha(visitor){
        return visitor.getFecha()
    }

    getClases(visitor){
        return visitor.getClases()
    }

    //Setters
    setFecha(visitor, fecha){
        visitor.setFecha(fecha)
    }

    setClases(visitor, clases){
        visitor.setClases(clases)
    }

}

export {ControllerVisitorClases}