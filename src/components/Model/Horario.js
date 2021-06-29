import { findRenderedDOMComponentWithClass } from "react-dom/cjs/react-dom-test-utils.production.min"
import { TDia } from "./TDia"

class Horario {
    constructor(horario){
        if(horario){
            this._id=horario._id
            
            if(horario.dia === 'Domingo'){
                this.dia = TDia.Domingo

            }else if(horario.dia === 'Lunes'){
                this.dia = TDia.Lunes

            }else if(horario.dia === 'Martes'){
                this.dia = TDia.Martes
                
            }else if(horario.dia === 'Miércoles'){
                this.dia = TDia.Miércoles
                
            }else if(horario.dia === 'Jueves'){
                this.dia = TDia.Jueves
                
            }else if(horario.dia === 'Viernes'){
                this.dia = TDia.Viernes
                
            }else {
                this.dia = TDia.Sábado
            }

            this.inicio = horario.inicio
            this.cierre = horario.cierre

        }else{
            this._id = ''
            this.dia = ''
            this.inicio = ''
            this.cierre = ''
        }
    }

    //Getters
    getId(){
        return this._id
    }

    getDia(){
        return this.dia
    }

    getInicio(){
        return this.inicio
    }

    getCierre(){
        return this.cierre
    }

    //Setters
    setId(id){
        this._id = id
    }

    setDia(dia){
        this.dia = dia
    }

    setInicio(inicio){
        this.inicio = inicio
    }

    setCierre(cierre){
        this.cierre = cierre
    }
}

export {Horario}