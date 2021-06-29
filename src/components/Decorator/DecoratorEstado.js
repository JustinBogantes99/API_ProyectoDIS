import { Decorator } from "./Decorator";
import { TModo } from "./TModo";

class DecoratorEstado extends Decorator{
    constructor(clase, modo){
        super(clase)
        this.modo = (modo === 'SoloLectura'?(TModo.SoloLectura):(TModo.Editable))
    }

    //Getters
    getModo(){
        return this.modo
    }

    //Setters
    setModo(modo){
        this.modo = modo
    }

}

export {DecoratorEstado}