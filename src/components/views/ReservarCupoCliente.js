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

function ReservarCupoCliente() {
    const [salaActual, setSalaActual] = useState({nombre:'', clases:[]})
    const [clientActual, setClientActual] = useState('')
    const [listaClasesParcial, setListaClasesParcial] = useState([])
    const [claseActual, setClaseActual] = useState({nombre:'', instructor:{nombreCompleto:''}, precio:0, horaInicio:'00:00', horaFin:'00:00', capacidadMaxima:0,pagos:[]})
    const [dia, setDia] = useState([new Date()])
    const [error, setError] = useState('')

    const [charger, setCharger] = useState(() => {
        let userData = getLocalSession();
        if(!userData) window.location.replace('/login')
        if(userData.role !== 'Cliente'){
            window.location.replace('/menuPrincipal')
        }

        axios.get('http://localhost:5000/Sala/listaSalas')
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
                    if(new Date(salaActualLocal.clases[i].diaEjecucion).getTime() === dia[0].getTime())listaClasesParcialLocal.push(salaActualLocal.clases[i])
                }

                console.log(listaClasesParcialLocal)
                setListaClasesParcial(listaClasesParcialLocal)
                if(listaClasesParcialLocal.length > 0)setError('')
                else setError('No hay ninguna clase en el rango de fechas actuales')

                const nombreUsuario = {
                    nombreUsuario:userData.username
                }

                axios.post('http://localhost:5000/Usuario/encontrarNombreUsuario', nombreUsuario)
                .then(usuarios => {
                    if(usuarios.data.length > 0){
                        setClientActual(usuarios.data[0])
                    }
                })
            }
        })
    })

    const handleCambioDia = dia =>{
        setDia(dia)
        if(salaActual.clases.length > 0){
            const listaClasesParcialLocal = []

            for(var i = 0; i < salaActual.clases.length; i++){
                if(new Date(salaActual.clases[i].diaEjecucion).getTime() === dia[0].getTime())listaClasesParcialLocal.push(salaActual.clases[i])
            }

            setListaClasesParcial(listaClasesParcialLocal)
            if(listaClasesParcialLocal.length > 0){
                setError('')
                setClaseActual(listaClasesParcialLocal[0])
            }
            else {
                setError('No hay ninguna clase dia seleccionado')
                setClaseActual({nombre:'', instructor:{nombreCompleto:''}, precio:0, horaInicio:'00:00', horaFin:'00:00', capacidadMaxima:0,pagos:[]})
            }
        }
    }

    const handleCambioClase = e => {
        for(var i = 0; i < listaClasesParcial.length; i++){
            if(listaClasesParcial[i].nombre === e && new Date(listaClasesParcial[i].diaEjecucion).getTime() === dia[0].getTime() 
            && listaClasesParcial[i].horaInicio !== claseActual.horaInicio) {
                setClaseActual(listaClasesParcial[i])
            }
        }
    }

    const handleSubmit = () =>{
        if(!salaActual || listaClasesParcial.length === 0 || !clientActual){
            setError('No se puede reservar un cupo en las condiciones actuales')
        }else{
            let userData = getLocalSession();

            var alDia = true
            var noInscrito = true
            for(var i = 0; i < clientActual.herencia[1].length; i++){
                if(clientActual.herencia[1][i].estado === 'Moroso')alDia = false
            }

            for(var i = 0; i < claseActual.pagos.length; i++){
                if(claseActual.pagos[i].clienteNombreUsuario === userData.username)noInscrito = false
            }

            if(!noInscrito){
                setError('Ya está registrado para esta clase')
            }else if(alDia){
                const nuevoPagoCliente = {
                    fechaPago:'',
                    clienteNombreUsuario: clientActual.cuenta.nombreUsuario,
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

                axios.post('http://localhost:5000/Sala/editarClase', editandoClase)
                .then(() => {
                    
                    const nombreSala ={
                        nombre: salaActual.nombre
                    }

                    axios.post('http://localhost:5000/Sala/encontrarSala', nombreSala)
                    .then(salas =>{
                        var nclaseActual = ''
                        for(var i = 0; i < salas.data[0].clases.length; i++){
                            if(salas.data[0].clases[i]._id === claseActual._id)nclaseActual=salas.data[0].clases[i]
                        }

                        if(nclaseActual){
                            var nuevaHerencia = clientActual.herencia

                            nuevaHerencia[1].push(nclaseActual.pagos[nclaseActual.pagos.length-1])

                            const editandoUsuario = {
                                cedula: clientActual.cedula,
                                nombreCompleto: clientActual.nombreCompleto,
                                correo: clientActual.correo,
                                telefono: clientActual.telefono,
                                rol: clientActual.rol,
                                cuenta: clientActual.cuenta,
                                sala: clientActual.sala,
                                estado:clientActual.estado,
                                herencia: nuevaHerencia
                            }

                            axios.post('http://localhost:5000/Usuario/editarUsuario', editandoUsuario)
                            .then(() => {
                                alert('Reserva Realizada!')
                                window.location.replace('/menuPrincipal')
                            })
                        }
                    })
                })

            }else setError('Tiene una cuenta pendiente, no se puede reservar si tiene un pago moroso')
        }
    }

    return (
        <div style={{margin: '0px 0px 20px'}}>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0 45px'}}>
                <h1 style={{color:'#5A47AB'}}>
                    Reservar Cupo
                </h1>
            </div>
            <div className="container">
            <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <div className="form-group" style={{margin: '10px 10px 20px'}}>
                    <h2 style={{display: "flex", justifyContent: "center", color:'#5A47AB', margin: '10px 0 0px'}}>
                        Nombre de la Clase
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
                    {listaClasesParcial.length > 0?(
                        <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{display: "flex", justifyContent: "center",color:'#5A47AB', margin: '10px 0 0px'}}>
                            Lista de Clases
                        </h2>
                        <div className="container" style={{maxHeight: 350, overflow: 'auto', width:"400px", height:"800px", backgroundColor: '#000000', borderRadius: 10}}>
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
                                        Precio por Hora
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
                    </div>):(<></>)
                    }
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '30px 0 20px'}}>
                    <label>{error}</label>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0px 100px'}}>
                        <Button buttonStyle='btn--outline2' path='/' specificStyle={{width: '260px'}}>Volver al Menú Principal</Button>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button buttonStyle='btn--outline2' onClick={handleSubmit} specificStyle={{width: '260px'}}>Reservar Cupo</Button>
                </div>
            </div>
        </div>
    )
}

export default ReservarCupoCliente
