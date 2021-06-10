import React, { useState } from 'react';
import { Button } from '../Button';
import Calendar from "react-range-calendar";
import axios from 'axios';

function getLocalSession() {
    let userData = localStorage.getItem('token');
    userData = JSON.parse(userData)
    return userData
}

function MakeOptions(X){
    return <option>{X}</option>
}

function ReservarCupoAdmin() {
    const [salaActual, setSalaActual] = useState({nombre:'', servicios:[]})
    const [listaSalas, setListaSalas] = useState([])
    const [listaClientes, setListaClientes] = useState([])
    const [listaClientesParcial, setListaClientesParcial] = useState([])
    const [clienteActual, setClienteActual] = useState({nombreCompleto:'', cuenta:{nombreUsuario:''}})
    const [listaClasesParcial, setListaClasesParcial] = useState([])
    const [claseActual, setClaseActual] = useState({nombre:''})
    const [dia, setDia] = useState([new Date()])
    const [cargado, setCargado] = useState(false)
    const [error, setError] = useState('')

    const [charger, setCharger] = useState(() => {
        let userData = getLocalSession();
        if(!userData) window.location.replace('/login')
        if(userData.role !== 'Administrador'){
            window.location.replace('/menuPrincipal')
        }

        dia[0].setHours(0,0,0,0)

        axios.get('https://api-dis2021.herokuapp.com/Sala/listaSalas')
        .then(respuesta => {
            if(respuesta.data.length > 0){
                respuesta.data[0].servicios.sort(function(a,b){
                    if(a.nombre < b.nombre) { return -1; }
                    if(a.nombre > b.nombre) { return 1; }
                    return 0;
                })

                setListaSalas(respuesta.data)
                setSalaActual(respuesta.data[0])

                axios.get('https://api-dis2021.herokuapp.com/Usuario/listaUsuarios')
                .then(respuestaListaUsuarios => {
                    if(respuestaListaUsuarios.data.length > 0){
                        respuestaListaUsuarios.data.sort(function(a,b){
                            if(a.nombreCompleto < b.nombreCompleto) { return -1; }
                            if(a.nombreCompleto > b.nombreCompleto) { return 1; }
                            return 0;
                        })

                        const usuariosClientes = []

                        for( var i = 0; i < respuestaListaUsuarios.data.length; i++){
                            if(respuestaListaUsuarios.data[i].rol === 'Cliente') usuariosClientes.push(respuestaListaUsuarios.data[i])
                        }

                        setListaClientes(usuariosClientes)

                        const usuariosClientesParcial = []
                        for(var i = 0; i < usuariosClientes.length; i++){
                            if(usuariosClientes[i].sala.idSala === respuesta.data[0]._id && usuariosClientes[i].estado)usuariosClientesParcial.push(usuariosClientes[i])
                        }

                        setListaClientesParcial(usuariosClientesParcial)
                        if(usuariosClientesParcial.length > 0) setClienteActual(usuariosClientesParcial[0])

                        const clasesParcialesLocal = []

                        for(var i = 0; i < respuesta.data[0].clases.length; i++){
                            if(new Date(respuesta.data[0].clases[i].diaEjecucion).getTime() === dia[0].getTime())clasesParcialesLocal.push(respuesta.data[0].clases[i])
                        }

                        setListaClasesParcial(clasesParcialesLocal)
                        if(clasesParcialesLocal.length > 0){
                            setClaseActual(clasesParcialesLocal[0])
                            setCargado(true)
                        }
                    }
                })
            }
        })
    })

    const handleCambiarSala = e =>{
        for(var i = 0; i < listaSalas.length; i++){
            if(listaSalas[i].nombre === e){
                setSalaActual(listaSalas[i])
                
                const listaClientesParcialLocal = []
                for(var k = 0; k < listaClientes.length; k++){
                    if(listaClientes[k].sala.idSala === listaSalas[i]._id && listaClientes[k].estado)listaClientesParcialLocal.push(listaClientes[k])
                }
                
                listaClientesParcialLocal.sort(function(a,b){
                    if(a.nombreCompleto < b.nombreCompleto) { return -1; }
                    if(a.nombreCompleto > b.nombreCompleto) { return 1; }
                    return 0;
                })

                setListaClientesParcial(listaClientesParcialLocal)
                if(listaClientesParcialLocal.length > 0)setClienteActual(listaClientesParcialLocal[0])
                else setClienteActual({nombreCompleto:'', cuenta:{nombreUsuario:''}})

                const listaClasesParcialesLocal = []
                for(var k = 0; k < listaSalas[i].clases.length; k++){
                    if(new Date(listaSalas[i].clases[k].diaEjecucion).getTime() === dia[0].getTime())listaClasesParcialesLocal.push(listaSalas[i].clases[k])
                }

                listaClasesParcialesLocal.sort(function(a,b){
                    if(a.nombre < b.nombre) { return -1; }
                    if(a.nombre > b.nombre) { return 1; }
                    return 0;
                })

                setListaClasesParcial(listaClasesParcialesLocal)
                if(listaClasesParcialesLocal.length > 0){
                    setClaseActual(listaClasesParcialesLocal[0])
                    setCargado(true)
                }
            }
        }
    }

    const handleCambiarCliente = e =>{
        for(var i = 0; i < listaClientesParcial.length; i++){
            if(listaClientesParcial[i].nombreCompleto === e && clienteActual.cuenta.nombreUsuario !== listaClientesParcial[i].cuenta.nombreUsuario){
                setClienteActual(listaClientesParcial[i])
            }
        }
    }

    const handleCambioClase = e => {
        for(var i = 0; i < listaClasesParcial.length; i++){
            if(listaClasesParcial[i].nombre === e && new Date(listaClasesParcial[i].diaEjecucion).getTime() === dia[0].getTime() 
            && listaClasesParcial[i].horaInicio !== claseActual.horaInicio) {
                setClaseActual(listaClasesParcial[i])
                setCargado(true)
            }
        }
    }

    const handleCambioDia = e => {
        setDia(e)

        var today = new Date()
        var nextMonth = new Date().setDate(today.getDate()+30)
        var nextMonthDay = new Date(nextMonth)

        if(nextMonthDay.getTime() >= e[0].getTime()){
            setError('')

            const listaClasesParcialesLocal = []
            for(var i = 0; i < salaActual.clases.length; i++){
                if(new Date(salaActual.clases[i].diaEjecucion).getTime() === e[0].getTime()) listaClasesParcialesLocal.push(salaActual.clases[i])
            }

            listaClasesParcialesLocal.sort(function(a,b){
                if(a.nombre < b.nombre) { return -1; }
                if(a.nombre > b.nombre) { return 1; }
                return 0;
            })

            setListaClasesParcial(listaClasesParcialesLocal)
            if(listaClasesParcialesLocal.length > 0) {
                setClaseActual(listaClasesParcialesLocal[0])
                setCargado(true)
            }
            else {
                setClaseActual({nombre:''})
                setCargado(false)
            }
        }else{
            setError('Aún no se han revelado las clases de la fecha seleccionada. Las clases se liberan 30 días antes de la fecha seleccionada.')
            setListaClasesParcial([])
            setClaseActual({nombre:''})
            setCargado(false)
        }
    }

    const handleSubmit = () =>{
        if(listaSalas.length === 0 || listaClientesParcial.length === 0 || listaClasesParcial.length === 0){
            setError('No se ha escogido una clase correctamente o cliente')
        }else if(claseActual.pagos.length >= claseActual.capacidadMaxima){
            setError('La clase ya está llena, no tiene más cupos disponibles')
        }else{
            var moroso = false
            var inscrito = false
            for(var i = 0; i < clienteActual.herencia[1].length; i++){
                if(clienteActual.herencia[1][i].estado === 'Moroso')moroso=true
            }
            for(var i = 0; i < claseActual.pagos.length; i++){
                if(claseActual.pagos[i].clienteNombreUsuario === clienteActual.cuenta.nombreUsuario)inscrito=true
            }

            if(moroso){
                setError('El cliente seleccionado está actualmente moroso, no se puede reservar más clases hasta que pague')
            }else if(inscrito){
                setError('El cliente seleccionado ya está incrito en la clase actual')
            }else{
                setError('')

                const nuevoPagoCliente = {
                    fechaPago:'',
                    clienteNombreUsuario: clienteActual.cuenta.nombreUsuario,
                    monto: claseActual.precio,
                    estado:'Moroso',
                    metodoPago: ''
                }

                var clase = claseActual
                clase.pagos.push(nuevoPagoCliente)
                        

                const editandoClase = {
                    nombreSala: salaActual.nombre,
                    claseOriginal: claseActual,
                    editandoClase: clase
                }

                axios.post('https://api-dis2021.herokuapp.com/Sala/editarClase', editandoClase)
                .then(() => {
                    
                    const nombreSala ={
                        nombre: salaActual.nombre
                    }

                    axios.post('https://api-dis2021.herokuapp.com/Sala/encontrarSala', nombreSala)
                    .then(salas =>{
                        var nclaseActual = ''
                        for(var i = 0; i < salas.data[0].clases.length; i++){
                            if(salas.data[0].clases[i]._id === claseActual._id)nclaseActual=salas.data[0].clases[i]
                        }

                        if(nclaseActual){
                            var nuevaHerencia = clienteActual.herencia

                            nuevaHerencia[1].push(nclaseActual.pagos[nclaseActual.pagos.length-1])

                            const editandoUsuario = {
                                cedula: clienteActual.cedula,
                                nombreCompleto: clienteActual.nombreCompleto,
                                correo: clienteActual.correo,
                                telefono: clienteActual.telefono,
                                rol: clienteActual.rol,
                                cuenta: clienteActual.cuenta,
                                sala: clienteActual.sala,
                                estado:clienteActual.estado,
                                herencia: nuevaHerencia
                            }

                            axios.post('https://api-dis2021.herokuapp.com/Usuario/editarUsuario', editandoUsuario)
                            .then(() => {
                                alert('Reserva Realizada!')
                                window.location.replace('/menuUsuarios')
                            })
                        }
                    })
                })
            }

            

            /*var nuevaHerencia = clienteActual.herencia

            nuevaHerencia[1].push(nuevoPagoCliente)

            const editandoUsuario = {
                cedula: clienteActual.cedula,
                nombreCompleto: clienteActual.nombreCompleto,
                correo: clienteActual.correo,
                telefono: clienteActual.telefono,
                rol: clienteActual.rol,
                cuenta: clienteActual.cuenta,
                sala: clienteActual.sala,
                estado:clienteActual.estado,
                herencia: nuevaHerencia
            }

            axios.post('https://api-dis2021.herokuapp.com/Usuario/editarUsuario', editandoUsuario)
            .then(() => {

                const nombreUsuarioLocal = {
                    nombreUsuario: clienteActual.cuenta.nombreUsuario
                }

                axios.post('https://api-dis2021.herokuapp.com/Usuario/encontrarNombreUsuario', nombreUsuarioLocal)
                .then(respuestaNombreUsuario =>{
                    console.log()
                    var clase = claseActual
                    clase.pagos.push(respuestaNombreUsuario.data[0].herencia[1][respuestaNombreUsuario.data[0].herencia[1].length-1])
                    
                    const editandoClase = {
                        nombreSala: salaActual.nombre,
                        claseOriginal: claseActual,
                        editandoClase: clase
                    }

                    axios.post('https://api-dis2021.herokuapp.com/Sala/editarClase', editandoClase)
                    .then(() => {
                        alert('Reserva Realizada!')
                        window.location.replace('/menuUsuarios')
                    })
                })


            })*/

        }
    }

    return (
        <div style={{margin: '0px 0px 20px'}}>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0 45px'}}>
                <h1 style={{color:'#5A47AB'}}>
                    Reservar Cupo para Cliente
                </h1>
            </div>

            <div className="container">
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Sala
                        </h2>
                        <select
                        required
                        className="form-control"
                        value={salaActual.nombre}
                        onChange={e => handleCambiarSala(e.target.value)}
                        style={{width:"300px"}}>
                            {
                                listaSalas.map(e => MakeOptions(e.nombre))
                            }
                        </select>

                    </div>
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Nombre Completo
                        </h2>
                        <select
                        required
                        className="form-control"
                        value={clienteActual.nombreCompleto}
                        onChange={e => handleCambiarCliente(e.target.value)}
                        style={{width:"300px"}}>
                            {
                                listaClientesParcial.map(e => MakeOptions(e.nombreCompleto))
                            }
                        </select>
                    </div> 

                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Nombre de Usuario
                        </h2>
                        <input type="text" placeholder='Nombre de Usuario' name="nombreUsuario" required
                        className="form-control" 
                        value={clienteActual.cuenta.nombreUsuario}
                        style={{width:"300px"}}>
                        </input>
                    </div>

                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Nombre Clase
                        </h2>
                        <select
                        required
                        className="form-control"
                        value={claseActual.nombre}
                        onChange={e => handleCambioClase(e.target.value)}
                        style={{width:"300px"}}>
                            {
                                listaClasesParcial.map(e => MakeOptions(e.nombre))
                            }
                        </select>
                    </div> 
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{display: "flex", justifyContent: "center",color:'#5A47AB', margin: '10px 0 0px'}}>
                            Calendario de Clases
                        </h2>
                        <Calendar
                            baseColor = '#5A47AB'
                            hoverBackgroundColor ='#5A47AB'
                            visible={true}
                            dateRange={dia}
                            onDateClick={dia => handleCambioDia([dia])}
                            type="single"
                        />
                    </div>
                    {
                                listaClasesParcial.length > 0? (
                        <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{display: "flex", justifyContent: "center",color:'#5A47AB', margin: '10px 0 0px'}}>
                            Datos de la Clase
                        </h2>
                        <div className="container" style={{maxHeight: 350, overflow: 'auto', width:"400px", height:"800px", backgroundColor: '#000000', borderRadius: 10}}>
                            
                                <div>
                                    <div className="container" style={{border:'2px solid #5A47AB', margin: '10px 0px 10px', borderRadius: 10}}>
                                        <div className="form-group" style={{margin: '10px 10px 20px'}}>
                                            <h4 style={{display: "flex", justifyContent: "left", color:'white', margin: '10px 0 0px'}}>
                                                Nombre de la Clase
                                            </h4>
                                            <div className="container" style={{backgroundColor: '#5A47AB', borderRadius: 10, border:'2px solid #5A47AB', margin: '5px 0px 0px'}}>
                                                <text style={{textDecorationLine: 'underline', display: "flex", justifyContent: "left", color: 'white'}}>
                                                    {claseActual.nombre}
                                                </text>
                                            </div>

                                            <h4 style={{display: "flex", justifyContent: "left", color:'white', margin: '10px 0 0px'}}>
                                                Instructor
                                            </h4>
                                            <div className="container" style={{backgroundColor: '#5A47AB', borderRadius: 10, border:'2px solid #5A47AB', margin: '5px 0px 0px'}}>
                                                <text style={{textDecorationLine: 'underline', display: "flex", justifyContent: "left", color: 'white'}}>
                                                    {claseActual.instructor.nombreCompleto}
                                                </text>
                                            </div>

                                            <h4 style={{display: "flex", justifyContent: "left", color:'white', margin: '10px 0 0px'}}>
                                                Precio Total
                                            </h4>
                                            <div className="container" style={{backgroundColor: '#5A47AB', borderRadius: 10, border:'2px solid #5A47AB', margin: '5px 0px 0px'}}>
                                                <text style={{textDecorationLine: 'underline', display: "flex", justifyContent: "left", color: 'white'}}>
                                                    {claseActual.precio}
                                                </text>
                                            </div>

                                            <h4 style={{display: "flex", justifyContent: "left", color:'white', margin: '10px 0 0px'}}>
                                                Horario
                                            </h4>
                                            <div className="container" style={{backgroundColor: '#5A47AB', borderRadius: 10, border:'2px solid #5A47AB', margin: '5px 0px 0px'}}>
                                                <text style={{textDecorationLine: 'underline', display: "flex", justifyContent: "left", color: 'white'}}>
                                                    {claseActual.horaInicio}-{claseActual.horaFin}
                                                </text>
                                            </div>

                                            <h4 style={{display: "flex", justifyContent: "left", color:'white', margin: '10px 0 0px'}}>
                                                Cupos
                                            </h4>
                                            <div className="container" style={{backgroundColor: '#5A47AB', borderRadius: 10, border:'2px solid #5A47AB', margin: '5px 0px 0px'}}>
                                                <text style={{textDecorationLine: 'underline', display: "flex", justifyContent: "left", color: 'white'}}>
                                                {claseActual.pagos.length}/{claseActual.capacidadMaxima}
                                                </text>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            
                        </div>
                    </div>):(<></>)
                    }
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '30px 0 20px'}}>
                    <label>{error}</label>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0px 100px'}}>
                        <Button buttonStyle='btn--outline2' path='/menuUsuarios' specificStyle={{width: '260px'}}>Volver al Menú de Usuarios</Button>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button buttonStyle='btn--outline2' onClick={handleSubmit} specificStyle={{width: '260px'}}>Reservar Cupo para Usuario</Button>
                </div>
            </div>
        </div>
    )
}

export default ReservarCupoAdmin
