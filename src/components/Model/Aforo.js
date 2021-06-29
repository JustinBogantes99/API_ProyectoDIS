class Aforo {
    constructor(aforo){
        if(aforo){
            this._id = aforo._id
            this.monto = aforo.monto
        }else{
            this._id = ''
            this.monto = 0
        }
    }


    //Getters
    getId(){
        return this._id
    }

    getMonto(){
        return this.monto
    }

    //Setters

    setId(id){
        this._id=id
    }

    setMonto(monto){
        this.monto = monto
    }
}

export {Aforo}