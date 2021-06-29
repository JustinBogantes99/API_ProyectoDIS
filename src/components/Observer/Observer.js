import axios from 'axios';

class Subscriber {
    //el observer recibe un objeto tipo Instructor
    constructor(usuario) {
        this.usuario = usuario
    }

    async update(mensaje) {
        let mensajeCompleto = mensaje;
        const usuarioANotificar = {
            cuenta: this.usuario.cuenta,
            notificaciones: mensajeCompleto
        }

        //await axios.post('http://localhost:5000/Usuario/agregarNotificacion', usuarioANotificar);
        await axios.post('https://api-dis2021.herokuapp.com/Usuario/agregarNotificacion', usuarioANotificar);
    }
}
export {Subscriber}