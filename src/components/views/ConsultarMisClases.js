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

function cargarClientes(X){
    return (
    <div className="container" style={{width:'500px' , border:'2px solid #5A47AB', margin: '10px 0px 10px', borderRadius: 10}}>
        <div className="form-group" style={{margin: '10px 10px 20px'}}>
            <h4 style={{display: "flex", justifyContent: "left", color:'#5A47AB', margin: '10px 0 0px'}}>
                Nombre del Cliente
            </h4>
            <div className="container" style={{backgroundColor: '#5A47AB', borderRadius: 10, border:'2px solid #5A47AB', margin: '5px 0px 0px'}}>
                <text style={{textDecorationLine: 'underline', display: "flex", justifyContent: "left", color: 'white'}}>
                    {X.nombreCompleto}
                </text>
            </div>

            <h4 style={{display: "flex", justifyContent: "left", color:'#5A47AB', margin: '10px 0 0px'}}>
                Estado del Pago
            </h4>
            <div className="container" style={{backgroundColor: '#5A47AB', borderRadius: 10, border:'2px solid #5A47AB', margin: '5px 0px 0px'}}>
                <text style={{textDecorationLine: 'underline', display: "flex", justifyContent: "left", color: 'white'}}>
                    {X.estadoPago}
                </text>
            </div>
        </div>
    </div>)
}


function ConsultarMisClases() {
    const [salaActual, setSalaActual] = useState({nombre:'', clases:[]})
    const [listaClientes, setListaClientes] = useState([])
    const [listaClientesParcial, setListaClientesParcial] = useState([])
    const [listaClasesParcial, setListaClasesParcial] = useState([])
    const [clienteActual, setClienteActual] = useState()
    const [claseActual, setClaseActual] = useState({nombre:'', instructor:{nombreCompleto:''}, precio:0, horaInicio:'00:00', horaFin:'00:00', capacidadMaxima:0,pagos:[], servicio:{nombre:''}})
    const [dia, setDia] = useState([new Date()])
    const [error, setError] = useState('')

    const [charger, setCharger] = useState(() => {
        let userData = getLocalSession();
        if(!userData) window.location.replace('/login')
        if(userData.role === 'Cliente'){
            window.location.replace('/menuPrincipal')
        }

        axios.get('https://api-dis2021.herokuapp.com/Sala/listaSalas')
        .then(respuesta => {
            var salaActualLocal = ''
            for(var i = 0; i < respuesta.data.length; i++){
                if(respuesta.data[i]._id === userData.idSala){
                    salaActualLocal = respuesta.data[i]
                }
            }

            if(respuesta.data.length > 0 && salaActualLocal){
                setSalaActual(salaActualLocal)
                const listaClasesParcialLocal = []
                for(var i = 0; i < salaActualLocal.clases.length; i++){
                    if(new Date(salaActualLocal.clases[i].diaEjecucion).getTime() === dia[0].getTime() && salaActualLocal.clases[i].instructor.cuenta.nombreUsuario === userData.username)listaClasesParcialLocal.push(salaActualLocal.clases[i])
                }

                console.log(listaClasesParcialLocal)
                setListaClasesParcial(listaClasesParcialLocal)
                if(listaClasesParcialLocal.length > 0)setError('')
                else setError('No hay ninguna clase en la fecha actual')


                axios.get('https://api-dis2021.herokuapp.com/Usuario/listaUsuarios')
                .then(usuarios => {
                    if(usuarios.data.length > 0){
                        const usuariosSala = []

                        for(var i = 0; i < usuarios.data.length; i++){
                            if(salaActualLocal._id === usuarios.data[i].sala.idSala){
                                usuariosSala.push(usuarios.data[i])
                                if(userData.username === usuarios.data[i].cuenta.nombreUsuario)setClienteActual(usuarios.data[i])
                            }
                        }

                        setListaClientes(usuariosSala)
                    }
                })
            }
        })
    })

    const handleCambioDia = e => {
        setDia(e)
        if(salaActual.clases.length > 0){
            var diaSeleccionado= new Date(e)
            diaSeleccionado.setDate(diaSeleccionado.getDate()+1)
            diaSeleccionado.setHours(0,0,0,0);

            const clasesParciales = []

            for(var i = 0; i < salaActual.clases.length; i++){
                if(new Date(salaActual.clases[i].diaEjecucion).getTime() === diaSeleccionado.getTime() && salaActual.clases[i].instructor.cuenta.nombreUsuario === clienteActual.cuenta.nombreUsuario){
                    clasesParciales.push(salaActual.clases[i])
                }
            }

            if(clasesParciales.length === 0){
                setError('No hay clases para el día seleccionado')
                setListaClasesParcial([])
                setClaseActual({nombre:'', instructor:{nombreCompleto:''}, precio:0, horaInicio:'00:00', horaFin:'00:00', capacidadMaxima:0,pagos:[], servicio:{nombre:''}})
                setListaClientesParcial([])
            }else{
                setError('')

                clasesParciales.sort(function(a,b){
                    if(a.nombre < b.nombre) { return -1; }
                    if(a.nombre > b.nombre) { return 1; }
                    return 0;
                })

                setListaClasesParcial(clasesParciales)
                setClaseActual(clasesParciales[0])
                setError('')
                if(clasesParciales[0].pagos.length > 0){
                    const usuariosPago = []

                    for(var i = 0; i < clasesParciales[0].pagos.length; i++){
                        for(var j = 0; j < listaClientes.length; j++){
                            if(listaClientes[j].cuenta.nombreUsuario === clasesParciales[0].pagos[i].clienteNombreUsuario){
                                const usuario = {
                                    nombreCompleto:listaClientes[j].nombreCompleto,
                                    estadoPago: clasesParciales[0].pagos[i].estado
                                }
                                
                                usuariosPago.push(usuario)
                            }
                        }
                    }

                    setListaClientesParcial(usuariosPago)
                }
            }
        }else{
            setError('No hay ninguna clase este día')
            setListaClasesParcial([])
            setClaseActual({nombre:'', instructor:{nombreCompleto:''}, precio:0, horaInicio:'00:00', horaFin:'00:00', capacidadMaxima:0,pagos:[], servicio:{nombre:''}})
            setListaClientesParcial([])
        }
    }

    const handleCambiarClase = e => {
        for(var k = 0; k < listaClasesParcial.length; k++){
            if(listaClasesParcial[k].nombre === e){
                setClaseActual(listaClasesParcial[k])

                const usuariosPago = []

                for(var i = 0; i < listaClasesParcial[k].pagos.length; i++){
                    for(var j = 0; j < listaClientes.length; j++){
                        if(listaClientes[j].cuenta.nombreUsuario === listaClasesParcial[k].pagos[i].clienteNombreUsuario){
                            const usuario = {
                                nombreCompleto:listaClientes[j].nombreCompleto,
                                estadoPago: listaClasesParcial[k].pagos[i].estado
                            }
                            
                            usuariosPago.push(usuario)
                        }
                    }
                }

                setListaClientesParcial(usuariosPago)
            }
        }
    }

    return (
        <div style={{margin: '0px 0px 20px'}}>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0 45px'}}>
                <h1 style={{color:'#5A47AB'}}>
                    Consultar Mis Clases
                </h1>
            </div>
            <div className="container">
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Día de las Clases
                        </h2>
                        <input type="date" placeholder='Día de las Clase' name="diaClases" required
                        className="form-control" 
                        value={dia}
                        onChange={e => handleCambioDia(e.target.value)}
                        style={{width:"400px"}}>
                        </input>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="form-group" style={{margin: '10px 10px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Mis Clases
                        </h2>
                        <select
                        required
                        className="form-control"
                        value={claseActual.nombre}
                        onChange={e => handleCambiarClase(e.target.value)}
                        style={{width:"400px"}}>
                            {
                                listaClasesParcial.map(e => MakeOptions(e.nombre))
                            }
                        </select>
                    </div>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Servicio
                        </h2>
                        <input type="text" placeholder='Día de las Clase' name="diaClases" required
                        className="form-control" 
                        value={claseActual.servicio.nombre}

                        style={{width:"400px"}}>
                        </input>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="form-group" style={{margin: '10px 10px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Precio de la Clase
                        </h2>
                        <input type="number" placeholder='Precio de la Clase' name="precioDeLaClase" required
                        className="form-control" 
                        value={claseActual.precio}

                        style={{width:"400px"}}>
                        </input>
                    </div>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 10px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Hora de Inicio
                        </h2>
                        <input type="time" placeholder='Hora de Inicio' name="inicioClase" required
                        className="form-control" 
                        value={claseActual.horaInicio}

                        style={{width:"400px"}}>
                        </input>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="form-group" style={{margin: '10px 10px 10px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Hora de Finalización
                        </h2>
                        <input type="time" placeholder='Hora de Finalización' name="finClase" required
                        className="form-control" 
                        value={claseActual.horaFin}

                        style={{width:"400px"}}>
                        </input>
                    </div>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Cupos de la Clase
                        </h2>
                        <input type="number" placeholder='Cupos de la Clase' name="cuposClase" required
                        className="form-control" 
                        value={claseActual.capacidadMaxima}

                        style={{width:"400px"}}>
                        </input>
                    </div>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                        Lista de Participantes
                    </h2>
                </div>
                
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    {
                        listaClientesParcial.map(e => cargarClientes(e))
                    }
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '30px 0 20px'}}>
                    <label>{error}</label>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0px 100px'}}>
                        <Button buttonStyle='btn--outline2' path='/' specificStyle={{width: '260px'}}>Volver al Menú Principal</Button>
                </div>
            </div>
        </div>
    )
}

export default ConsultarMisClases
