import { TEstado } from "./TEstado"
import { TPagos } from "./TPagos"

class Pago {
    constructor(pago){
        this._id = pago._id
        this.fechaPago = pago.fechaPago
        this.clienteNombreUsuario = pago.clienteNombreUsuario
        this.monto = pago.monto

        //Estado
        this.estado = (pago.estado === "Pagado"?(TEstado.Pagado):(TEstado.Moroso))

        //MetodoPago
        this.metodoPago = ''

        if(pago.metodoPago === 'Saldo a Favor'){
            this.metodoPago = TPagos.Saldo
        }else if(pago.metodoPago === 'Simpe Móvil'){
            this.metodoPago = TPagos.Simpe
        }else if(pago.metodoPago === 'Tarjeta'){
            this.metodoPago = TPagos.Tarjeta
        }
    }
}

export {Pago}