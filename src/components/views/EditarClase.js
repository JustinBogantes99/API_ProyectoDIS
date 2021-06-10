import React, { useState } from 'react';
import { Button } from '../Button';
import axios from 'axios';
import Calendar from "react-range-calendar";

function getLocalSession() {
    let userData = localStorage.getItem('token');
    userData = JSON.parse(userData)
    return userData
}

function MakeOptions(X){
    return <option>{X}</option>
}


function EditarClase() {
    const [salaActual, setSalaActual] = useState({nombre:'', servicios:[]})
    const [listaSalas, setListaSalas] = useState([])
    const [diaOriginal, setDiaOriginal] = useState('')
    const [listaClasesParcial, setListaClasesParcial] = useState([])
    const [claseActual, setClaseActual] = useState({nombre:''})
    const [listaServicios, setListaServicios] = useState([])
    const [listaServiciosParcial, setListaServiciosParcial] = useState([])
    const [servicioActual, setServicioActual] = useState({nombre:''})
    const [listaTrabajadores, setListaTrabajadores] = useState([])
    const [listaTrabajadoresParcial, setListaTrabajadoresParcial] = useState([])
    const [trabajadorActual, setTrabajadorActual] = useState({nombreCompleto:''})
    const [cupoMaximo, setCupoMaximo] = useState(0)

    const [nombreClase, setNombreClase] = useState('')
    const [precio, setPrecio] = useState(0)
    const [cupos, setCupos] = useState(0)
    const [dia, setDia] = useState([new Date()])
    const [inicioClase, setInicioClase] = useState('07:00');
    const [finClase, setFinClase] = useState('07:00');
    const [error, setError] = useState();

    const [charger, setCharger] = useState(() => {
        let userData = getLocalSession();
        if(!userData) window.location.replace('/login')
        if(userData.role !== 'Administrador'){
            window.location.replace('/menuPrincipal')
        }

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
                setListaServicios(respuesta.data[0].servicios)

                if(respuesta.data[0].servicios.length > 0)setListaServicios(respuesta.data[0].servicios)
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
                            if(respuestaListaUsuarios.data[i].rol !== 'Cliente') usuariosTrabajadores.push(respuestaListaUsuarios.data[i])
                        }

                        setListaTrabajadores(usuariosTrabajadores)

                        const usuariosTrabajadoresParcial = []
                        for(var i = 0; i < usuariosTrabajadores.length; i++){
                            if(usuariosTrabajadores[i].sala.idSala === respuesta.data[0]._id)usuariosTrabajadoresParcial.push(usuariosTrabajadores[i])
                        }

                        setListaTrabajadoresParcial(usuariosTrabajadoresParcial)
                        if(usuariosTrabajadoresParcial.length > 0) setTrabajadorActual(usuariosTrabajadoresParcial[0])
                    }
                })
            }
        })
    })

    const handleCambiarSala = e =>{
        for(var k = 0; k < listaSalas.length; k++){
            if(listaSalas[k].nombre === e){
                setSalaActual(listaSalas[k])
                setListaServicios(listaSalas[k].servicios)
                setDiaOriginal('')
                setListaClasesParcial([])
                setClaseActual({nombre:''})
                setNombreClase('')

                setServicioActual({nombre:''})
                setPrecio(0)
                setCupoMaximo(0)
                setCupos(0)
                setInicioClase('07:00')
                setFinClase('07:00')
                setListaTrabajadoresParcial([])
                setTrabajadorActual({nombreCompleto:''})
            }
        }
    }

    const handleCambioDia = e =>{
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
                setClaseActual({nombre:''})
                setNombreClase('')

                setServicioActual({nombre:''})
                setPrecio(0)
                setCupoMaximo(0)
                setCupos(0)
                setInicioClase('07:00')
                setFinClase('07:00')
                setListaTrabajadoresParcial([])
                setTrabajadorActual({nombreCompleto:''})
            }else{
                setError('')
                setListaClasesParcial(clasesParciales)
                setClaseActual(clasesParciales[0])
                setNombreClase(clasesParciales[0].nombre)

                setServicioActual(clasesParciales[0].servicio)
                setPrecio(clasesParciales[0].precio)

                var cuposAforo =  salaActual.aforo.porcentaje*0.01*salaActual.capacidadMaxima
                if(cuposAforo < clasesParciales[0].servicio.maximoPersonas){
                    setCupoMaximo(cuposAforo)
                    setCupos(cuposAforo)
                }else{
                    setCupoMaximo(clasesParciales[0].servicio.maximoPersonas)
                    setCupos(clasesParciales[0].servicio.maximoPersonas)
                }

                setInicioClase(clasesParciales[0].horaInicio)
                setFinClase(clasesParciales[0].horaFin)

                const trabajadoresParcialesLocal = []
                for(var i = 0; i < listaTrabajadores.length; i++){
                    for(var j = 0; j < listaTrabajadores[i].herencia[0].length; j++){
                        if(listaTrabajadores[i].sala.idSala === salaActual._id && listaTrabajadores[i].herencia[0][j].nombre === clasesParciales[0].servicio.nombre)trabajadoresParcialesLocal.push(listaTrabajadores[i])
                    }
                }

                setListaTrabajadoresParcial(trabajadoresParcialesLocal)
                if(trabajadoresParcialesLocal.length){
                    for(var i = 0; i < trabajadoresParcialesLocal.length; i++){
                        if(trabajadoresParcialesLocal[i].cuenta.nombreUsuario === clasesParciales[0].instructor.cuenta.nombreUsuario)setTrabajadorActual(trabajadoresParcialesLocal[i])
                    }
                }

                setDia([new Date(clasesParciales[0].diaEjecucion)])
            }
        }
    }

    const handleCambiarClase = e =>{
        for(var k = 0; k < listaClasesParcial.length; k++){
            if(listaClasesParcial[k].nombre === e && listaClasesParcial[k].horaInicio !== claseActual.horaInicio){
                setClaseActual(listaClasesParcial[k])
                setNombreClase(listaClasesParcial[k].nombre)

                setServicioActual(listaClasesParcial[k].servicio)
                setPrecio(listaClasesParcial[k].precio)

                var cuposAforo =  salaActual.aforo.porcentaje*0.01*salaActual.capacidadMaxima
                if(cuposAforo < listaClasesParcial[k].servicio.maximoPersonas){
                    setCupoMaximo(cuposAforo)
                    setCupos(cuposAforo)
                }else{
                    setCupoMaximo(listaClasesParcial[k].servicio.maximoPersonas)
                    setCupos(listaClasesParcial[k].servicio.maximoPersonas)
                }

                setInicioClase(listaClasesParcial[k].horaInicio)
                setFinClase(listaClasesParcial[k].horaFin)

                const trabajadoresParcialesLocal = []
                for(var i = 0; i < listaTrabajadores.length; i++){
                    for(var j = 0; j < listaTrabajadores[i].herencia[0].length; j++){
                        if(listaTrabajadores[i].sala.idSala === salaActual._id && listaTrabajadores[i].herencia[0][j].nombre === listaClasesParcial[k].servicio.nombre)trabajadoresParcialesLocal.push(listaTrabajadores[i])
                    }
                }

                setListaTrabajadoresParcial(trabajadoresParcialesLocal)
                if(trabajadoresParcialesLocal.length > 0){
                    for(var i = 0; i < trabajadoresParcialesLocal.length; i++){
                        if(trabajadoresParcialesLocal[i].cuenta.nombreUsuario === listaClasesParcial[k].instructor.cuenta.nombreUsuario)setTrabajadorActual(trabajadoresParcialesLocal[i])
                    }
                }
            }
        }
    }

    const handleCambiarServicio = e => {
        console.log()
        for(var k = 0; k < salaActual.servicios.length; k++){
            console.log(salaActual.servicios[k].nombre)
            console.log(e)
            if(salaActual.servicios[k].nombre === e){
                setServicioActual(salaActual.servicios[k])

                const trabajadoresParcialesLocal = []
                for(var i = 0; i < listaTrabajadores.length; i++){
                    for(var j = 0; j < listaTrabajadores[i].herencia[0].length; j++){
                        if(listaTrabajadores[i].sala.idSala === salaActual._id && listaTrabajadores[i].herencia[0][j].nombre === salaActual.servicios[k].nombre)trabajadoresParcialesLocal.push(listaTrabajadores[i])
                    }
                }

                setListaTrabajadoresParcial(trabajadoresParcialesLocal)
                if(trabajadoresParcialesLocal.length > 0){
                    setTrabajadorActual(trabajadoresParcialesLocal[0])
                }
            }
        }
    }

    const handleCambiarInstructor = e =>{
        for(var k = 0; k < listaTrabajadoresParcial.length; k++){
            if(listaTrabajadoresParcial[k].nombreCompleto === e){
                setTrabajadorActual(listaTrabajadoresParcial[k])
            }
        }
    }

    const handleCambiarCupos = e => {
        if(cupoMaximo >= e){
            setCupos(e)
            setError('')
        }else{
            setError(`El cupo ingresado es superior al máximo de la clase o la sala con el aforo. El máximo es de ${cupoMaximo} cupos`)
        }
    }

    const handleInicioClase = e => {
        if(e < finClase){
            setError('')
            setInicioClase(e)
        }else{
            setError('La hora de inicio no puede ser después a la hora de finalización')
        }
    }

    const handleFinClase = e => {
        if(e > inicioClase){
            setError('')
            setFinClase(e)
        }else{
            setError('La hora de finalización no puede ser antes a la hora de inicio')
        }
    }

    const handleSubmit = () => {
        var mesDePublicado = new Date()
        mesDePublicado.setDate(mesDePublicado.getDate()+30)
        if(!nombreClase || !servicioActual || !trabajadorActual || !precio || !cupos || !inicioClase || !finClase || !dia
            || listaTrabajadoresParcial.length === 0 || salaActual.servicios.length === 0 || listaSalas.length === 0){
            setError("Debe rellernar todos los campos para agregar una clase")
        }else if(precio <= 0){
            setError("El precio no puede ser menor o igual a 0")
        }else if(cupos <= 0){
            setError("Los cupos no pueden ser menores o iguales a 0")
        }else if(inicioClase >= finClase){
            setError("Las horas de inicio y cierre no pueden ser las mismas ni puede finalizar antes de empezar")
        }else if(dia[0].getTime() <= mesDePublicado.getTime() && dia[0].getTime() !== new Date(claseActual.diaEjecucion).getTime()){
            setError("Las clases deben de hacerse con al menos un mes de antelación para no interferir con las clases publicadas")
        }else{
            const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
            const diaActual = diasSemana[dia[0].getDay()]
            var horarioDia = null
            for(var i = 0; i < salaActual.horario.length; i++){
                if(salaActual.horario[i].dia === diaActual){
                    horarioDia = salaActual.horario[i]
                }
            }


            if(horarioDia){
                if(dia[0]<=new Date()){
                    setError('No se puede agregar una clase para el dia actual o anterior')
                }else if(horarioDia.inicio === horarioDia.cierre ){
                    setError('La sala no está abierta el día de la semana selecionado')
                }else if(inicioClase < horarioDia.inicio || inicioClase > horarioDia.cierre || inicioClase > horarioDia.cierre || finClase > horarioDia.cierre){
                    setError(`Alguna de las horas sobrepasa el horario de la sala. ${horarioDia.inicio} - ${horarioDia.cierre}`)
                }else{
                    setError('')
                    var conflictoHorario = false
                    var claseConflicto = ''
                    const nuevaClase = {
                        nombre: nombreClase,
                        capacidadMaxima: cupos,
                        diaEjecucion:dia[0],
                        instructor: trabajadorActual,
                        servicio:servicioActual,
                        horaInicio:inicioClase,
                        horaFin: finClase,
                        precio:precio
                    }

                    const listaNuevasClases = []
                    listaNuevasClases.push(nuevaClase)

                    for(var i = 0; i < salaActual.clases.length && !conflictoHorario; i++){
                        for(var j = 0; j < listaNuevasClases.length && !conflictoHorario; j++){
                            if(listaNuevasClases[j].diaEjecucion.getTime() === new Date(salaActual.clases[i].diaEjecucion).getTime()){
                                if((claseActual.nombre ===  salaActual.clases[i].nombre && claseActual.horaInicio ===  salaActual.clases[i].horaInicio) || ((listaNuevasClases[j].horaInicio < salaActual.clases[i].horaInicio && listaNuevasClases[j].horaFin <= salaActual.clases[i].horaInicio)
                                ||  (listaNuevasClases[j].horaInicio >= salaActual.clases[i].horaFin && listaNuevasClases[j].horaFin > salaActual.clases[i].horaFin))){

                                }else{
                                    conflictoHorario = true
                                    claseConflicto = salaActual.clases[i]
                                    console.log('conflicto')
                                    console.log()
                                }
                            }
                        }
                    }

                    if(!conflictoHorario){
                        const editandoClase = {
                            nombreSala: salaActual.nombre,
                            claseOriginal: claseActual,
                            editandoClase: listaNuevasClases[0]
                        }
                        console.log(editandoClase)
                        axios.post('https://api-dis2021.herokuapp.com/Sala/editarClase', editandoClase)
                        .then(() => {
                            alert('¡Clase Editada!')
                            window.location.replace('/menuClases')
                        })
                    }else{
                        setError(`Exite un conflicto con una clase: ${claseConflicto.nombre}, Hora de Inicio: ${claseConflicto.horaInicio}, Hora de Finalización: ${claseConflicto.horaFin}`)
                    }
                
                
                }
            }
        }
    }

    return (
        <div style={{margin: '0px 0px 20px'}}>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0 45px'}}>
                <h1 style={{color:'#5A47AB'}}>
                    Editar Clase
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
                        style={{width:"400px"}}>
                            {
                                listaSalas.map(e => MakeOptions(e.nombre))
                            }
                        </select>

                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Día de la Clase
                        </h2>
                        <input type="date" placeholder='Día de la Clase' name="diaClase" required
                        className="form-control" 
                        value={diaOriginal}
                        onChange={e => handleCambioDia(e.target.value)}
                        style={{width:"400px"}}>
                        </input>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Clase
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
                
                {
                    listaClasesParcial.length > 0?(
                <>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Nombre de la Clase
                        </h2>
                        <input type="text" placeholder='Nombre de la Clase' name="nombreClase" required
                        className="form-control" 
                        value={nombreClase}
                        onChange={e => setNombreClase(e.target.value)}
                        style={{width:"400px"}}>
                        </input>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                    <div className="form-group" style={{margin: '10px 10px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Servicio
                        </h2>
                        <select
                        required
                        className="form-control"
                        value={servicioActual.nombre}
                        onChange={e => handleCambiarServicio(e.target.value)}
                        style={{width:"400px"}}>
                            {
                                salaActual.servicios.map(e => MakeOptions(e.nombre))
                            }
                        </select>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                    <div className="form-group" style={{margin: '10px 10px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Instructor
                        </h2>
                        <select
                        required
                        className="form-control"
                        value={trabajadorActual.nombreCompleto}
                        onChange={e => handleCambiarInstructor(e.target.value)}
                        style={{width:"400px"}}>
                            {
                                listaTrabajadoresParcial.map(e => MakeOptions(e.nombreCompleto))
                            }
                        </select>
                    </div>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Precio de la Clase
                        </h2>
                        <input type="number" placeholder='Precio de la Clase' name="precioDeLaClase" required
                        className="form-control" 
                        value={precio}
                        onChange={e => setPrecio(e.target.value)}
                        style={{width:"400px"}}>
                        </input>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                    <div className="form-group" style={{margin: '10px 10px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Cupos de la Clase
                        </h2>
                        <input type="number" placeholder='Cupos de la Clase' name="cuposClase" required
                        className="form-control" 
                        value={cupos}
                        onChange={e => handleCambiarCupos(e.target.value)}
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
                        value={inicioClase}
                        onChange={e => handleInicioClase(e.target.value)}
                        style={{width:"400px"}}>
                        </input>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="form-group" style={{margin: '10px 10px 10px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Hora de Finalización
                        </h2>
                        <input type="time" placeholder='Hora de Finalización' name="finClase" required
                        className="form-control" 
                        value={finClase}
                        onChange={e => handleFinClase(e.target.value)}
                        style={{width:"400px"}}>
                        </input>
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
                            onDateClick={dia => setDia([dia])}
                            type="single"
                        />
                    </div>
                </div>
                </>
                    ):(<></>)
                }

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '30px 0 20px'}}>
                    <label>{error}</label>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0px 100px'}}>
                        <Button buttonStyle='btn--outline2' path='/menuClases' specificStyle={{width: '260px'}}>Volver al Menú de Clases</Button>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button buttonStyle='btn--outline2' onClick={handleSubmit} specificStyle={{width: '260px'}}>Editar Clase</Button>
                </div>
            </div>
        </div>
    )
}

export default EditarClase
