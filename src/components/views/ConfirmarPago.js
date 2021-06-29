import React, { useState } from 'react';
import { Button } from '../Button';
import axios from 'axios';

function getLocalSession() {
    let userData = localStorage.getItem('token');
    userData = JSON.parse(userData)
    return userData
}

function MakeOptions(X){
    return <option>{X}</option>
}


function ConfirmarPago() {
    const [salaActual, setSalaActual] = useState({nombre:'', servicios:[]})
    const [listaSalas, setListaSalas] = useState([])
    const [diaOriginal, setDiaOriginal] = useState('')
    const [listaClasesParcial, setListaClasesParcial] = useState([])
    const [claseActual, setClaseActual] = useState({nombre:''})
    const [pagoActual, setPagoActual] = useState(0)
    const [clienteActual, setClienteActual] = useState({nombreCompleto:'', cuenta:{nombreUsuario:''}, herencia:[0]})
    const [listaClientes, setListaClientes] = useState([])
    const [listaClientesParcial, setListaClientesParcial] = useState([])
    const [metodoPago, setMetodoPago] = useState('Simpe Móvil')
    const [error, setError] = useState('')

    const [charger, setCharger] = useState(() => {
        let userData = getLocalSession();
        if(!userData) window.location.replace('/login')
        if(userData.role !== 'Administrador'){
            window.location.replace('/menuPrincipal')
        }

        axios.get('https://api-dis2021.herokuapp.com/Sala/listaSalas')
        .then(respuesta => {
            if(respuesta.data.length > 0){

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

                        const usuariosTrabajadores = []

                        for( var i = 0; i < respuestaListaUsuarios.data.length; i++){
                            if(respuestaListaUsuarios.data[i].rol === 'Cliente') usuariosTrabajadores.push(respuestaListaUsuarios.data[i])
                        }

                        setListaClientes(usuariosTrabajadores)

                        /*const usuariosTrabajadoresParcial = []
                        for(var i = 0; i < usuariosTrabajadores.length; i++){
                            if(usuariosTrabajadores[i].sala.idSala === respuesta.data[0]._id)usuariosTrabajadoresParcial.push(usuariosTrabajadores[i])
                        }

                        setListaClientesParcial(usuariosTrabajadoresParcial)
                        if(usuariosTrabajadoresParcial.length > 0) setClienteActual(usuariosTrabajadoresParcial[0])*/
                    }
                })
            }
        })
    })

    const handleCambiarSala = e => {
        for(var k = 0; k < listaSalas.length; k++){
            if(listaSalas[k].nombre === e){
                setSalaActual(listaSalas[k])
                setDiaOriginal('')
                setListaClasesParcial([])
                setClaseActual({nombre:''})
            }
        }
    }

    const handleCambioDia = e => {
        setDiaOriginal(e)
        if(salaActual.clases.length > 0){
            var diaSeleccionado= new Date(e)
            diaSeleccionado.setDate(diaSeleccionado.getDate()+1)
            diaSeleccionado.setHours(0,0,0,0);

            const clasesParciales = []

            for(var i = 0; i < salaActual.clases.length; i++){
                if(new Date(salaActual.clases[i].diaEjecucion).getTime() === diaSeleccionado.getTime() &&
                salaActual.clases[i].estado === 'Autorizado'){
                    clasesParciales.push(salaActual.clases[i])
                }
            }

            if(clasesParciales.length === 0){
                setError('No hay clases para el día seleccionado')
                setListaClasesParcial([])
                setClienteActual({nombreCompleto:'', cuenta:{nombreUsuario:''}, herencia:[0]})
                setPagoActual(0)

            }else{
                setError('')

                clasesParciales.sort(function(a,b){
                    if(a.nombre < b.nombre) { return -1; }
                    if(a.nombre > b.nombre) { return 1; }
                    return 0;
                })

                setListaClasesParcial(clasesParciales)
                setClaseActual(clasesParciales[0])
                if(clasesParciales[0].pagos.length > 0){
                    const usuariosPago = []
                    var first = true

                    for(var i = 0; i < clasesParciales[0].pagos.length; i++){
                        for(var j = 0; j < listaClientes.length; j++){
                            if(listaClientes[j].cuenta.nombreUsuario === clasesParciales[0].pagos[i].clienteNombreUsuario && clasesParciales[0].pagos[i].estado === 'Moroso'){
                                usuariosPago.push(listaClientes[j])
                                if(first){
                                    setPagoActual(clasesParciales[0].pagos[i].monto)
                                    first = false
                                }
                            }
                        }
                    }

                    setListaClientesParcial(usuariosPago)
                    if(usuariosPago.length > 0) {
                        setError('')
                        setClienteActual(usuariosPago[0])
                        
                    }else{
                        setError('No hay ningun cliente que haya reservado pendiente de pago')
                        setClienteActual({nombreCompleto:'', cuenta:{nombreUsuario:''}, herencia:[0]})
                    }
                }else{
                    setError('No hay ningun cliente que haya reservado')
                    setListaClientesParcial([])
                    setClienteActual({nombreCompleto:'', cuenta:{nombreUsuario:''}, herencia:[0]})
                    setPagoActual(0)
                }
            }
        }else{
            setError('No hay ninguna clase este día')
            setListaClientesParcial([])
            setClienteActual({nombreCompleto:'', cuenta:{nombreUsuario:''}, herencia:[0]})
            setPagoActual(0)
        }
    }

    const handleCambiarClase = e => {
        for(var k = 0; k < listaClasesParcial.length;  k++){
            if(listaClasesParcial[k].nombre === e && listaClasesParcial[k].horaInicio !== claseActual.horaInicio){
                setClaseActual(listaClasesParcial[k])

                if(listaClasesParcial[k].pagos.length > 0){
                    const usuariosPago = []
                    var first = true

                    for(var i = 0; i < listaClasesParcial[k].pagos.length; i++){
                        for(var j = 0; j < listaClientes.length; j++){
                            if(listaClientes[j].cuenta.nombreUsuario === listaClasesParcial[k].pagos[i].clienteNombreUsuario && listaClasesParcial[k].pagos[i].estado === 'Moroso'){
                                usuariosPago.push(listaClientes[j])
                                if(first){
                                    setPagoActual(listaClasesParcial[k].pagos[i].monto)
                                    first = false
                                }
                            }
                        }
                    }

                    setListaClientesParcial(usuariosPago)
                    if(usuariosPago.length > 0) {
                        setClienteActual(usuariosPago[0])
                        
                    }else{
                        setError('No hay ningun cliente que haya reservado')
                        setClienteActual({nombreCompleto:'', cuenta:{nombreUsuario:''}, herencia:[0]})
                    }
                }else{
                    setListaClientesParcial([])
                    setClienteActual({nombreCompleto:'', cuenta:{nombreUsuario:''}, herencia:[0]})
                    setPagoActual(0)
                }
            }
        }
    }

    const handleCambiarCliente = e => {
        for(var i = 0; i < listaClientesParcial.length; i++){
            if(listaClientesParcial[i].nombreCompleto === e && listaClientesParcial[i].cuenta.nombreUsuario !== clienteActual.cuenta.nombreUsuario){
                setClienteActual(listaClientesParcial[i])
            }
        }
    }

    const handleSubmit = () =>{
        if(listaSalas.length === 0 || !diaOriginal || listaClasesParcial.length === 0 || listaClientes.length === 0){
            setError('No se puede confirmar el pago en el estado actual')
        }else if(metodoPago === 'Saldo a Favor' && clienteActual.herencia[0] < pagoActual){
            setError('El cliente actual no tiene saldo a favor suficiente para pagar la clase')
        }else{
            setError('')
            var actualizandoPago = ''

            for(var i = 0; i < claseActual.pagos.length; i++){
                if(claseActual.pagos[i].clienteNombreUsuario === clienteActual.cuenta.nombreUsuario){
                    actualizandoPago = claseActual.pagos[i]
                    i = claseActual.pagos.length-1
                }
            }

            actualizandoPago.fechaPago = new Date()
            actualizandoPago.estado = 'Pagado'
            actualizandoPago.metodoPago = metodoPago

            console.log(actualizandoPago)

            for(var i = 0; i < claseActual.pagos.length; i++){
                if(claseActual.pagos[i].clienteNombreUsuario === clienteActual.cuenta.nombreUsuario){
                    claseActual.pagos[i] = actualizandoPago
                }
            }

            if(metodoPago === 'Saldo a Favor'){
                clienteActual.herencia[0] = clienteActual.herencia[0] - pagoActual
            }

            const claseActualizada = {
                nombreSala: salaActual.nombre,
                claseOriginal: claseActual,
                editandoClase: claseActual
            }

            console.log(claseActualizada)
            axios.post('https://api-dis2021.herokuapp.com/Sala/editarClase', claseActualizada)
            .then(() => {
                var nuevaHerencia = clienteActual.herencia

                for(var i = 0; i < nuevaHerencia[1].length; i++){
                    if(nuevaHerencia[1][i]._id === actualizandoPago._id){
                        nuevaHerencia[1][i] = actualizandoPago
                    }
                }

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
                    alert('¡Reserva Pagada!')
                    window.location.replace('/menuUsuarios')
                })
            })
        }
    }


    return (
        <div style={{margin: '0px 0px 20px'}}>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0 45px'}}>
                <h1 style={{color:'#5A47AB'}}>
                    Confirmar Pago
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
                                listaSalas.map(e=> MakeOptions(e.nombre))
                            }
                        </select>
                    </div>
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Día de la Clase
                        </h2>
                        <input type="date" placeholder='Día de la Clase' name="diaClase" required
                        className="form-control" 
                        value={diaOriginal}
                        onChange={e => handleCambioDia(e.target.value)}
                        style={{width:"300px"}}>
                        </input>
                    </div>

                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Clase
                        </h2>
                        <select
                        required
                        className="form-control"
                        value={claseActual.nombre}
                        onChange={e => handleCambiarClase(e.target.value)}
                        style={{width:"300px"}}>
                            {
                                listaClasesParcial.map(e => MakeOptions(e.nombre))
                            }
                        </select>
                    </div>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Cliente
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
                            Monto a Pagar
                        </h2>
                        <input type="number" placeholder='Monto a Pagar' name="precio" required
                        className="form-control" 
                        value={pagoActual}
                        style={{width:"300px"}}>
                        </input>
                    </div>
                    
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '30px 0 20px'}}>
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Método de Pago
                        </h2>
                        <select
                        required
                        className="form-control"
                        value={metodoPago}
                        onChange={e => setMetodoPago(e.target.value)}
                        style={{width:"300px"}}>
                            {
                                <>
                                <option>Simpe Móvil</option>
                                <option>Tarjeta</option>
                                <option>Saldo a Favor</option>
                                </>
                            }
                        </select>
                    </div>
                    {
                        metodoPago === 'Saldo a Favor'?(
                            <div className="form-group" style={{margin: '10px 10px 20px'}}>
                                <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                                    Monto a Favor
                                </h2>
                                <input type="text" placeholder='Nombre de Usuario' name="nombreUsuario" required
                                className="form-control" 
                                value={clienteActual.herencia[0]}
                                style={{width:"300px"}}>
                                </input>
                            </div>
                        ):(<></>)
                    }
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '30px 0 20px'}}>
                    <label>{error}</label>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0px 100px'}}>
                        <Button buttonStyle='btn--outline2' path='/menuClases' specificStyle={{width: '260px'}}>Volver al Menú de Clases</Button>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button buttonStyle='btn--outline2' onClick={handleSubmit} specificStyle={{width: '260px'}}>Confirmar Pago</Button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmarPago
