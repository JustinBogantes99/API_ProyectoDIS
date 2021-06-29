class ControllerInstructor {

    getNombreCompleto(instructor){
        return instructor.getNombreCompleto()
    }

    getNombreUsuarioInstructor(instructor){
        return instructor.cuenta.nombreUsuario
    }

    getServicios(instructor){
        return instructor.getServicios()
    }

}

export {ControllerInstructor}