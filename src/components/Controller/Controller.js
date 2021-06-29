import axios from 'axios';
import { ControllerSala } from "./ControllerSala";
import { ControllerClase } from "./ControllerClase";
import { ControllerHorario } from "./ControllerHorario";
import { ControllerServicio } from "./ControllerServicio";
import { ControllerInstructor } from "./ControllerInstructor";
import { ControllerVisitorClases } from "./ControllerVisitorClases";
import { ControllerVisitorMisClases } from "./ControllerVisitorMisClases";





class Controller {
    constructor(){
        this.controllerSala = new ControllerSala()
        this.controllerClase = new ControllerClase()
        this.controllerHorario = new ControllerHorario()
        this.controllerServicio = new ControllerServicio()
        this.controllerInstructor = new ControllerInstructor()
        this.controllerVisitorClases = new ControllerVisitorClases()
        this.controllerVisitorMisClases = new ControllerVisitorMisClases()
    }

    //Bases de Datos
    checkRoleInstructor(userData){
        if(!userData) window.location.replace('/login')
        if(userData.role !== 'Instructor'){
            window.location.replace('/menuPrincipal')
        }
    }

    checkRoleAdministrador(userData){
        if(!userData) window.location.replace('/login')
        if(userData.role !== 'Administrador'){
            window.location.replace('/menuPrincipal')
        }
    }

    getSalaIdLocalSession(userData){
        return userData.idSala
    }

    getUsernameLocalSession(userData){
        return userData.username
    }

    getLocalSession() {
        let userData = localStorage.getItem('token');
        userData = JSON.parse(userData)
        return userData
    }

    getListaSalas(){
        return axios.get('https://api-dis2021.herokuapp.com/Sala/listaSalas')
        .then(respuesta => {
            this.respuesta = respuesta
            return this.respuesta
        })
    }

    getSalaConID(idSala){
        return axios.get('https://api-dis2021.herokuapp.com/Sala/listaSalas')
        .then(respuesta => {
            var salaActual = ''
            for(var i = 0; i < respuesta.data.length; i++){
                if(respuesta.data[i]._id === idSala){
                    salaActual = respuesta.data[i]
                }
            }
            return salaActual
        })
    }

    getUsuario(nombreUsuario){
        const buscarNombreUsuario = {
            nombreUsuario: nombreUsuario
        }
        return axios.post('https://api-dis2021.herokuapp.com/Usuario/encontrarNombreUsuario', buscarNombreUsuario)
        .then(respuesta => {
            this.respuesta = respuesta
            console.log(this.respuesta)
            return this.respuesta
        })
    }

    getUsuarioRaw(nombreUsuario){
        const buscarNombreUsuario = {
            nombreUsuario: nombreUsuario
        }
        return axios.post('https://api-dis2021.herokuapp.com/Usuario/encontrarNombreUsuario', buscarNombreUsuario)
        .then(respuesta => {
            console.log(respuesta.data[0])
            this.respuesta = respuesta.data[0]
            return this.respuesta
        })
    }

    getAdministradoresSala(nombreSala){
        return axios.get('https://api-dis2021.herokuapp.com/Usuario/listaUsuarios')
        .then(respuesta => {
            const listaAdministradoresSala = []
            for(var i = 0; i < respuesta.data.length; i++){
                if(respuesta.data[i].sala.nombreSala === nombreSala && respuesta.data[i].rol === 'Administrador'){
                    listaAdministradoresSala.push(respuesta.data[i])
                }
            }

            this.listaAdmins = listaAdministradoresSala
            return this.listaAdmins
        })
    }

    addClase(nuevasClases){
        axios.post('https://api-dis2021.herokuapp.com/Sala/agregarClases', nuevasClases)
        .then(() => {
            console.log('Clases Agregadas')
        })
    }

    setClase(clase, nombreSala){
        var instructor = {
            cedula: clase.instructor.cedula, 
            nombreCompleto: clase.instructor.nombreCompleto,
            celular: clase.instructor.telefono,
            correo: clase.instructor.correo,
            TRol: clase.instructor.rol,
            estado: clase.instructor.estado,
            cuenta: clase.instructor.cuenta,
            servicios: clase.instructor.servicios
        }

        var claseEditada = {
            _id: clase._id,
            nombre: clase.nombre,
            capacidadMaxima: clase.capacidadMaxima,
            diaEjecucion: clase.diaEjecucion,
            instructor: instructor,
            horaInicio: clase.horaInicio,
            horaFin: clase.horaFin,
            precio: clase.precio,
            servicio: clase.servicio,
            pagos: clase.pagos,
            estado: clase.estado
        }

        const editandoClase = {
            nombreSala: nombreSala,
            claseOriginal: claseEditada,
            editandoClase: claseEditada
        }

        console.log(claseEditada)

        axios.post('https://api-dis2021.herokuapp.com/Sala/editarClase', editandoClase)
        .then(() => {
            console.log('Clase Editada')
            //window.location.replace('/menuClases')
        })
    }

    pullClase(clase, nombreSala){
        const eliminandoClase = {
            nombreSala: nombreSala,
            _id: this.getIdClase(clase)
        }

        axios.post('https://api-dis2021.herokuapp.com/Sala/eliminarClase', eliminandoClase)
        .then(() => {
            console.log('Clase Eliminada')
            //alert('Clase eliminada!')
            //window.location.replace('/menuClases')
        })
    }

    deletenotificaciones(usuario){
        const usuarioANotificar = {
            cuenta: {nombreUsuario: usuario.cuenta.nombreUsuario},
            notificaciones: []
        }
        //axios.post('http://localhost:5000/Usuario/editarNotificaciones', usuarioANotificar);
        axios.post('https://api-dis2021.herokuapp.com/Usuario/editarNotificaciones', usuarioANotificar);
    }


    //Sala
    //Getters
    getNombreSala(sala){
        return this.controllerSala.getNombre(sala)
    }

    getCapacidadMaximaSala(sala){
        return this.controllerSala.getCapacidadMaxima(sala)
    }

    getAforoMontoSala(sala){
        return this.controllerSala.getAforoMonto(sala)
    }

    getHorarioSala(sala){
        return this.controllerSala.getHorario(sala)
    }

    getServiciosSala(sala){
        return this.controllerSala.getServicios(sala)
    }

    //Funciones
    pushClaseSala(sala, clase){
        this.controllerSala.pushClase(sala, clase)
    }

    //Visitor
    manejarVisitorSala(sala, visitor){
        this.controllerSala.manejarVisitor(sala, visitor)
    }



    //Clases
    //Setters
    setIdClase(clase, id){
        this.controllerClase.setId(clase, id)
    }

    setNombreClase(clase, nombre){
        this.controllerClase.setNombre(clase, nombre)
    }

    setCapacidadMaximaClase(clase, capacidadMaxima){
        this.controllerClase.setCapacidadMaxima(clase, capacidadMaxima)
    }

    setDiaEjecucionClase(clase, diaEjecucion){
        this.controllerClase.setDiaEjecucion(clase, diaEjecucion)
    }

    setHoraInicioClase(clase, horaInicio){
        this.controllerClase.setHoraInicio(clase, horaInicio)
    }

    setHoraFinClase(clase, horaFin){
        this.controllerClase.setHoraFin(clase, horaFin)
    }

    setPrecioClase(clase, precio){
        this.controllerClase.setPrecio(clase, precio)
    }

    setInstructorClase(clase, instructor){
        this.controllerClase.setInstructor(clase, instructor)
    }

    setServicioClase(clase, servicio){
        this.controllerClase.setServicio(clase, servicio)
    }

    setPagosClase(clase, pagos){
        this.controllerClase.setPagos(clase, pagos)
    }

    setEstadoClase(clase, estado){
        this.controllerClase.setEstado(clase, estado)
    }


    //Getters
    getIdClase(clase){
        return this.controllerClase.getId(clase)
    }

    getNombreClase(clase){
        return this.controllerClase.getNombreClase(clase)
    }

    getCapacidadMaximaClase(clase){
        return this.controllerClase.getCapacidadMaxima(clase)
    }

    getDiaEjecucionClase(clase){
        return this.controllerClase.getDiaEjecucion(clase)
    }

    getHoraInicioClase(clase){
        return this.controllerClase.getHoraInicio(clase)
    }

    getHoraFinClase(clase){
        return this.controllerClase.getHoraFin(clase)
    }

    getPrecioClase(clase){
        return this.controllerClase.getPrecio(clase)
    }

    getInstructorClase(clase){
        return this.controllerClase.getInstructor(clase)
    }

    getServicioClase(clase){
        return this.controllerClase.getServicio(clase)
    }

    getEstadoClase(clase){
        return this.controllerClase.getEstado(clase)
    }



    //Horario
    //Getters
    getInicioHorario(horario){
        return this.controllerHorario.getInicio(horario)
    }

    getCierreHorario(horario){
        return this.controllerHorario.getCierre(horario)
    }




    //Servicio
    //Setters
    
    //Getters
    getNombreServicio(servicio){
        return this.controllerServicio.getNombre(servicio)
    }

    getPrecioServicio(servicio){
        return this.controllerServicio.getPrecio(servicio)
    }

    getMaximoPersonasServicio(servicio){
        return this.controllerServicio.getMaximoPersonas(servicio)
    }



    //Instructor
    getNombreCompletoInstructor(instructor){
        return this.controllerInstructor.getNombreCompleto(instructor)
    }

    getNombreUsuarioInstructor(instructor){
        return this.controllerInstructor.getNombreUsuarioInstructor(instructor)
    }

    getServiciosInstructor(instructor){
        return this.controllerInstructor.getServicios(instructor)
    }




    //VisitorClases
    //Getters
    getClasesVisitorClases(visitor){
        return this.controllerVisitorClases.getClases(visitor)
    }

    //Setters
    setFechaVisitorClases(visitor, fecha){
        this.controllerVisitorClases.setFecha(visitor, fecha)
    }


    //VisitorMisClases
    //Getters
    getClasesVisitorMisClases(visitor){
        return this.controllerVisitorMisClases.getClases(visitor)
    }

    //Setters
    setFechaVisitorMisClases(visitor, fecha){
        this.controllerVisitorMisClases.setFecha(visitor, fecha)
    }

    setNombreUsuarioVisitorMisClases(visitor, nombreUsuario){
        this.controllerVisitorMisClases.setNombreUsuario(visitor, nombreUsuario)
    }


    //Cargar elementos del GUI
    MakeOptions(X){
        return <option>{X}</option>
    }

    cargarClases(X){
        return (
            <div className="container" style={{border:'2px solid #5A47AB', margin: '10px 0px 10px', borderRadius: 10}}>
                <div className="form-group" style={{margin: '10px 10px 20px'}}>
                    <h4 style={{display: "flex", justifyContent: "left", color:'white', margin: '10px 0 0px'}}>
                        Nombre de la Clase
                    </h4>
                    <div className="container" style={{backgroundColor: '#5A47AB', borderRadius: 10, border:'2px solid #5A47AB', margin: '5px 0px 0px'}}>
                        <text style={{textDecorationLine: 'underline', display: "flex", justifyContent: "left", color: 'white'}}>
                            {this.getNombreClase(X)}
                        </text>
                    </div>
    
                    <h4 style={{display: "flex", justifyContent: "left", color:'white', margin: '10px 0 0px'}}>
                        Instructor
                    </h4>
                    <div className="container" style={{backgroundColor: '#5A47AB', borderRadius: 10, border:'2px solid #5A47AB', margin: '5px 0px 0px'}}>
                        <text style={{textDecorationLine: 'underline', display: "flex", justifyContent: "left", color: 'white'}}>
                            {X.instructor.nombreCompleto}
                        </text>
                    </div>
    
                    <h4 style={{display: "flex", justifyContent: "left", color:'white', margin: '10px 0 0px'}}>
                        Precio Total
                    </h4>
                    <div className="container" style={{backgroundColor: '#5A47AB', borderRadius: 10, border:'2px solid #5A47AB', margin: '5px 0px 0px'}}>
                        <text style={{textDecorationLine: 'underline', display: "flex", justifyContent: "left", color: 'white'}}>
                            {X.precio}
                        </text>
                    </div>
    
                    <h4 style={{display: "flex", justifyContent: "left", color:'white', margin: '10px 0 0px'}}>
                        Horario
                    </h4>
                    <div className="container" style={{backgroundColor: '#5A47AB', borderRadius: 10, border:'2px solid #5A47AB', margin: '5px 0px 0px'}}>
                        <text style={{textDecorationLine: 'underline', display: "flex", justifyContent: "left", color: 'white'}}>
                            {X.horaInicio}-{X.horaFin}
                        </text>
                    </div>
    
                    <h4 style={{display: "flex", justifyContent: "left", color:'white', margin: '10px 0 0px'}}>
                        Cupos
                    </h4>
                    <div className="container" style={{backgroundColor: '#5A47AB', borderRadius: 10, border:'2px solid #5A47AB', margin: '5px 0px 0px'}}>
                        <text style={{textDecorationLine: 'underline', display: "flex", justifyContent: "left", color: 'white'}}>
                            {X.pagos.length}/{X.capacidadMaxima}
                        </text>
                    </div>
                </div>
            </div>
        )
    }

}

export {Controller}