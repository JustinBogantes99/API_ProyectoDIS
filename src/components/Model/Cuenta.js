class Cuenta {
    constructor(cuenta){
        if(cuenta){
            this.nombreUsuario = cuenta.nombreUsuario
            this.contrasenia = cuenta.contrasenia
        }else{
            this.nombreUsuario = ''
            this.contrasenia = ''
        }
    }

    getNombreUsuario(){
        return this.nombreUsuario
    }

    getContrasenia(){
        return this.contrasenia
    }
}

export {Cuenta}