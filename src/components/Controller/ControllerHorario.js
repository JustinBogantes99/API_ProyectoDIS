class ControllerHorario {

    //Getters
    getId(horario){
        return horario.getId()
    }

    getDia(horario){
        return horario.getDia()
    }

    getInicio(horario){
        return horario.getInicio()
    }

    getCierre(horario){
        return horario.getCierre()
    }

}

export {ControllerHorario}