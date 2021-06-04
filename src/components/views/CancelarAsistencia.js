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


function CancelarAsistencia() {
    const [salaActual, setSalaActual] = useState({nombre:'', servicios:[]})
    const [listaSalas, setListaSalas] = useState([])
    const [diaOriginal, setDiaOriginal] = useState('')
    const [listaClientes, setListaClientes] = useState([])
    const [listaClientesParcial, setListaClientesParcial] = useState([])
    const [clienteActual, setClienteActual] = useState({nombreCompleto:'', cuenta:{nombreUsuario:''}})
    const [listaPagos, setListaPagos] = useState([])
    const [pagoActual, setPagoActual] = useState({monto:0, estado:''})
    const [listaClasesParcial, setListaClasesParcial] = useState([])
    const [claseActual, setClaseActual] = useState({nombre:''})

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
                if(new Date(salaActual.clases[i].diaEjecucion).getTime() === diaSeleccionado.getTime()){
                    clasesParciales.push(salaActual.clases[i])
                }
            }

            if(clasesParciales.length === 0){
                setError('No hay clases para el día seleccionado')
                setListaClasesParcial([])
                setClienteActual({nombreCompleto:'', cuenta:{nombreUsuario:''}, herencia:[0]})

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
                    const listaPagosLocal = []

                    for(var i = 0; i < clasesParciales[0].pagos.length; i++){
                        for(var j = 0; j < listaClientes.length; j++){
                            if(listaClientes[j].cuenta.nombreUsuario === clasesParciales[0].pagos[i].clienteNombreUsuario){
                                usuariosPago.push(listaClientes[j])
                                listaPagosLocal.push(clasesParciales[0].pagos[i])
                            }
                        }
                    }

                    setListaPagos(listaPagosLocal)
                    setListaClientesParcial(usuariosPago)
                    if(usuariosPago.length > 0) {
                        setError('')
                        setClienteActual(usuariosPago[0])
                        setPagoActual(listaPagosLocal[0])
                    }else{
                        setError('No hay ningun cliente que haya reservado pendiente de pago')
                        setClienteActual({nombreCompleto:'', cuenta:{nombreUsuario:''}, herencia:[0]})
                        setPagoActual({monto:0, estado:''})
                    }
                }else{
                    setError('No hay ningun cliente que haya reservado')
                    setListaClientesParcial([])
                    setClienteActual({nombreCompleto:'', cuenta:{nombreUsuario:''}, herencia:[0]})
                    setPagoActual({monto:0, estado:''})
                }
            }
        }else{
            setError('No hay ninguna clase este día')
            setListaClientesParcial([])
            setClienteActual({nombreCompleto:'', cuenta:{nombreUsuario:''}, herencia:[0]})
            setPagoActual({monto:0, estado:''})
        }
    }

    const handleCambiarClase = e => {
        for(var k = 0; k < listaClasesParcial.length;  k++){
            if(listaClasesParcial[k].nombre === e && listaClasesParcial[k].horaInicio !== claseActual.horaInicio){
                setClaseActual(listaClasesParcial[k])

                if(listaClasesParcial[k].pagos.length > 0){
                    const usuariosPago = []
                    const listaPagosLocal = []

                    for(var i = 0; i < listaClasesParcial[k].pagos.length; i++){
                        for(var j = 0; j < listaClientes.length; j++){
                            if(listaClientes[j].cuenta.nombreUsuario === listaClasesParcial[k].pagos[i].clienteNombreUsuario){
                                usuariosPago.push(listaClientes[j])
                                listaPagosLocal.push(listaClasesParcial[k].pagos[i])
                            }
                        }
                    }

                    setListaPagos(listaPagosLocal)
                    setListaClientesParcial(usuariosPago)
                    if(usuariosPago.length > 0) {
                        setError('')
                        setClienteActual(usuariosPago[0])
                        setPagoActual(listaPagosLocal[0])
                    }else{
                        setError('No hay ningun cliente que haya reservado')
                        setClienteActual({nombreCompleto:'', cuenta:{nombreUsuario:''}, herencia:[0]})
                        setPagoActual({monto:0, estado:''})
                    }
                }else{
                    setListaClientesParcial([])
                    setClienteActual({nombreCompleto:'', cuenta:{nombreUsuario:''}, herencia:[0]})
                    setPagoActual({monto:0, estado:''})
                }
            }
        }
    }

    const handleCambiarCliente = e => {
        for(var i = 0; i < listaClientesParcial.length; i++){
            if(listaClientesParcial[i].nombreCompleto === e && listaClientesParcial[i].cuenta.nombreUsuario !== clienteActual.cuenta.nombreUsuario){
                setClienteActual(listaClientesParcial[i])
                setPagoActual(listaPagos[i])
            }
        }
    }

    const handleSubmit = () =>{
        var diaDeHoy = new Date()
        var horas = diaDeHoy.getHours()
        var minutos = diaDeHoy.getMinutes()
        var horaMinutosClase = claseActual.horaInicio.split(':')
        diaDeHoy.setHours(0,0,0,0)

        var diaOriginalLocal = new Date(diaOriginal)
        if(listaSalas.length === 0 || !diaOriginal || listaClasesParcial.length === 0 || listaClientesParcial.length === 0){
            setError('Algunos de los campos está incompleto, no se puede cancelar la asistencia')
        }else if(diaDeHoy.getTime() > diaOriginalLocal.getTime()){
            setError('La clase ya ha sucedido o está en las 8 horas antes de su realización, no se puede cancelar su asistencia')
        }else if(diaDeHoy.getTime() === diaOriginalLocal.getTime() && Number(horaMinutosClase[0])-horas <= 8 && (Number(horaMinutosClase[0])-horas === 8 ? (Number(horaMinutosClase[1])-minutos < 0):(true))){
            setError('La clase ya ha sucedido o está en las 8 horas antes de su realización, no se puede cancelar su asistencia')
        }else{
            setError('')
            var claseActualLocal = claseActual
            for(var i = 0; i < claseActualLocal.pagos.length; i++){
                if(claseActualLocal.pagos[i] === pagoActual){
                    claseActualLocal.pagos.splice(i, 1)
                }
            }
            console.log(claseActualLocal)

            var usuarioActualLocal =clienteActual
            for(var i = 0; i < usuarioActualLocal.herencia[1].length; i++){
                if(usuarioActualLocal.herencia[1][i]._id === pagoActual._id){
                    usuarioActualLocal.herencia[1].splice(i, 1)
                }
            }

            if(pagoActual.estado === 'Pagado'){
                usuarioActualLocal.herencia[0] = usuarioActualLocal.herencia[0]+pagoActual.monto
            }

            const claseActualizada = {
                nombreSala: salaActual.nombre,
                claseOriginal: claseActual,
                editandoClase: claseActualLocal
            }
            axios.post('https://api-dis2021.herokuapp.com/Sala/editarClase', claseActualizada)
            .then(() => {
                const editandoUsuario = {
                    cedula: usuarioActualLocal.cedula,
                    nombreCompleto: usuarioActualLocal.nombreCompleto,
                    correo: usuarioActualLocal.correo,
                    telefono: usuarioActualLocal.telefono,
                    rol: usuarioActualLocal.rol,
                    cuenta: usuarioActualLocal.cuenta,
                    sala: usuarioActualLocal.sala,
                    estado:usuarioActualLocal.estado,
                    herencia: usuarioActualLocal.herencia
                }

                axios.post('https://api-dis2021.herokuapp.com/Usuario/editarUsuario', editandoUsuario)
                .then(() => {
                    alert('¡Asistencia Eliminada!')
                    window.location.replace('/menuClases')
                })
            })
        }
    }


    return (
        <div style={{margin: '0px 0px 20px'}}>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0 45px'}}>
                <h1 style={{color:'#5A47AB'}}>
                    Cancelar Asistencia
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
                            Estado del Pago
                        </h2>
                        <input type="text" placeholder='Estado del Pago' name="estadoPago" required
                        className="form-control" 
                        value={pagoActual.estado}
                        style={{width:"300px"}}>
                        </input>
                    </div>

                    {
                        pagoActual.estado === 'Pagado'?(
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Monto Pagado
                        </h2>
                        <input type="number" placeholder='Monto Pagado' name="montoPagado" required
                        className="form-control" 
                        value={pagoActual.monto}
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
                        <Button buttonStyle='btn--outline2' onClick={handleSubmit} specificStyle={{width: '260px'}}>Cancelar Asistencia</Button>
                </div>
            </div>
        </div>
    )
}

export default CancelarAsistencia
