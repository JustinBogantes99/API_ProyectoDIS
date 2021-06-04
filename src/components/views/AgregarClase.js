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


function AgregarClase() {
    const [salaActual, setSalaActual] = useState({nombre:''})
    const [listaSalas, setListaSalas] = useState([])
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
    const [repetible, setRepetible] = useState(false)
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
                setListaSalas(respuesta.data)
                setSalaActual(respuesta.data[0])
                setListaServicios(respuesta.data[0].servicios)

                if(respuesta.data[0].servicios.length > 0){
                    
                    respuesta.data[0].servicios.sort(function(a,b){
                        if(a.nombre < b.nombre) { return -1; }
                        if(a.nombre > b.nombre) { return 1; }
                        return 0;
                    })

                    setListaServiciosParcial(respuesta.data[0].servicios)
                    setServicioActual(respuesta.data[0].servicios[0])
                    setPrecio(respuesta.data[0].servicios[0].precio)
                    
                    var cuposAforo =  respuesta.data[0].aforo.porcentaje*0.01*respuesta.data[0].capacidadMaxima
                    if(cuposAforo < respuesta.data[0].servicios[0].maximoPersonas){
                        setCupoMaximo(cuposAforo)
                        setCupos(cuposAforo)
                    }else{
                        setCupoMaximo(respuesta.data[0].servicios[0].maximoPersonas)
                        setCupos(respuesta.data[0].servicios[0].maximoPersonas)
                    }

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
                                for(var j = 0; j < usuariosTrabajadores[i].herencia[0].length; j++){
                                    if(usuariosTrabajadores[i].herencia[0][j]._id === respuesta.data[0].servicios[0]._id)usuariosTrabajadoresParcial.push(usuariosTrabajadores[i])
                                }
                            }
                            setListaTrabajadoresParcial(usuariosTrabajadoresParcial)

                            if(usuariosTrabajadoresParcial.length > 0){
                                setTrabajadorActual(usuariosTrabajadoresParcial[0])
                                setError('')
                            }else{
                                setError('No hay ningún usuario que pueda impartir el servicio actual')
                            }
                        }
                    })
                }else{
                    setError('No hay ningún servicio actualmente, no se cargarán el resto de datos')
                }
            }
        })
    })

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

    const handleChangeSala = e =>{
        for(var i = 0; i < listaSalas.length; i++){
            if(listaSalas[i].nombre === e){
                setSalaActual(listaSalas[i])

                listaSalas[i].servicios.sort(function(a,b){
                    if(a.nombre < b.nombre) { return -1; }
                    if(a.nombre > b.nombre) { return 1; }
                    return 0;
                })

                setListaServicios(listaSalas[i].servicios)

                if(listaSalas[i].servicios.length > 0){
                    setListaServiciosParcial(listaSalas[i].servicios)
                    setServicioActual(listaSalas[i].servicios[0])
                    setPrecio(listaSalas[i].precio)

                    var cuposAforo =  listaSalas[i].aforo.porcentaje*0.01*listaSalas[i].capacidadMaxima
                    if(cuposAforo < listaSalas[i].servicios[0].maximoPersonas){
                        setCupoMaximo(cuposAforo)
                        setCupos(cuposAforo)
                    }else{
                        setCupoMaximo(listaSalas[i].servicios[0].maximoPersonas)
                        setCupos(listaSalas[i].servicios[0].maximoPersonas)
                    }


                    const usuariosTrabajadoresParcial = []
                    for(var k = 0; k < listaTrabajadores.length; k++){
                        for(var j = 0; j < listaTrabajadores[k].herencia[0].length; j++){
                            if(listaTrabajadores[k].herencia[0][j]._id === listaSalas[i].servicios[0]._id)usuariosTrabajadoresParcial.push(listaTrabajadores[k])
                        }
                    }
                    setListaTrabajadoresParcial(usuariosTrabajadoresParcial)

                    if(usuariosTrabajadoresParcial.length > 0){
                        setTrabajadorActual(usuariosTrabajadoresParcial[0])
                        setError('')
                    }else{
                        setError('No hay ningún usuario que pueda impartir el servicio actual')
                        setTrabajadorActual({nombreCompleto:''})
                    }

                }else{
                    setError('Aún no hay servicios en la sala actual')
                    setListaServiciosParcial(listaSalas[i].servicios)
                    setServicioActual({nombre:''})
                    setPrecio(0)
                    setCupoMaximo(0)
                    setCupos(0)
                    setListaTrabajadoresParcial([])
                    setTrabajadorActual({nombreCompleto:''})
                }
            }
        }
    }

    const handleCambiarInstructor = e =>{
        for(var i = 0; i < listaTrabajadoresParcial.length; i++){
            if(listaTrabajadoresParcial[i].nombreCompleto === e) setTrabajadorActual(listaTrabajadoresParcial[i])
        }
    }

    const handleCambiarServicio = e =>{
        for(var i = 0; i < listaServiciosParcial.length; i++){
            if(listaServiciosParcial[i].nombre === e) {
                setServicioActual(listaServiciosParcial[i])
                setPrecio(listaServiciosParcial[i].precio)
                
                var cuposAforo =  salaActual.aforo.porcentaje*0.01*salaActual.capacidadMaxima
                if(cuposAforo < listaServiciosParcial[i].maximoPersonas){
                    setCupoMaximo(cuposAforo)
                    setCupos(cuposAforo)
                }else{
                    setCupoMaximo(listaServiciosParcial[i].maximoPersonas)
                    setCupos(listaServiciosParcial[i].maximoPersonas)
                }


                const usuariosTrabajadoresParcial = []
                for(var k = 0; k < listaTrabajadores.length; k++){
                    for(var j = 0; j < listaTrabajadores[k].herencia[0].length; j++){
                        if(listaTrabajadores[k].herencia[0][j]._id === listaServiciosParcial[i]._id)usuariosTrabajadoresParcial.push(listaTrabajadores[k])
                    }
                }
                setListaTrabajadoresParcial(usuariosTrabajadoresParcial)

                if(usuariosTrabajadoresParcial.length > 0){
                    setTrabajadorActual(usuariosTrabajadoresParcial[0])
                    setError('')
                }else{
                    setError('No hay ningún usuario que pueda impartir el servicio actual')
                    setTrabajadorActual({nombreCompleto:''})
                }
            }
        }
    }

    const handleCambiarCupos = e =>{
        if(cupoMaximo >= e){
            setCupos(e)
            setError('')
        }else{
            setError(`El cupo ingresado es superior al máximo de la clase o la sala con el aforo. El máximo es de ${cupoMaximo} cupos`)
        }
    }

    const handleSubmit = () => {
        var mesDePublicado = new Date()
        mesDePublicado.setDate(mesDePublicado.getDate()+30)
        if(!nombreClase || !servicioActual || !trabajadorActual || !precio || !cupos || !inicioClase || !finClase || !dia
            || listaTrabajadoresParcial.length === 0 || listaServiciosParcial.length === 0 || listaSalas.length === 0){
            setError("Debe rellernar todos los campos para agregar una clase")
        }else if(precio <= 0){
            setError("El precio no puede ser menor o igual a 0")
        }else if(cupos <= 0){
            setError("Los cupos no pueden ser menores o iguales a 0")
        }else if(inicioClase >= finClase){
            setError("Las horas de inicio y cierre no pueden ser las mismas ni puede finalizar antes de empezar")
        }else if(dia[0].getTime() <= mesDePublicado.getTime()){
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
                    
                    if(repetible){
                        if(dia[0].getDate() > 7){
                            var diaNumero = dia[0].getDate()
                            var diaActualLocal = new Date(dia[0])

                            while(diaNumero > 7){
                                var diaActualLocal = new Date(dia[0])
                                diaActualLocal.setDate(diaNumero-7)
                                const nuevaClaseInter = {
                                    nombre: nombreClase,
                                    capacidadMaxima: cupos,
                                    diaEjecucion:diaActualLocal,
                                    instructor: trabajadorActual,
                                    servicio:servicioActual,
                                    horaInicio:inicioClase,
                                    horaFin: finClase,
                                    precio:precio
                                }
                                listaNuevasClases.push(nuevaClaseInter)
                                diaNumero = diaNumero-7
                            }
                        }

                        var diaNumero = dia[0].getDate()
                        diaNumero = diaNumero + 7
                        var diaActualLocal = new Date(dia[0])
                        diaActualLocal.setDate(diaNumero)

                        while(dia[0].getMonth() === diaActualLocal.getMonth()){
                            var diaActualLocal2 = new Date(dia[0])
                            diaActualLocal2.setDate(diaNumero)
                            const nuevaClaseInter = {
                                nombre: nombreClase,
                                capacidadMaxima: cupos,
                                diaEjecucion:diaActualLocal2,
                                instructor: trabajadorActual,
                                servicio:servicioActual,
                                horaInicio:inicioClase,
                                horaFin: finClase,
                                precio:precio
                            }
                            listaNuevasClases.push(nuevaClaseInter)
                            diaNumero = diaNumero+7
                            diaActualLocal.setDate(diaNumero)
                        }
                    }
                    
                    for(var i = 0; i < salaActual.clases.length && !conflictoHorario; i++){
                        for(var j = 0; j < listaNuevasClases.length && !conflictoHorario; j++){
                            if(listaNuevasClases[j].diaEjecucion.getTime() === new Date(salaActual.clases[i].diaEjecucion).getTime()){
                                if((listaNuevasClases[j].horaInicio < salaActual.clases[i].horaInicio && listaNuevasClases[j].horaFin <= salaActual.clases[i].horaInicio)
                                ||  listaNuevasClases[j].horaInicio >= salaActual.clases[i].horaFin && listaNuevasClases[j].horaFin > salaActual.clases[i].horaFin){

                                }else{
                                    conflictoHorario = true
                                    claseConflicto = salaActual.clases[i]
                                }
                            }
                        }
                    }

                    if(!conflictoHorario){
                        const nuevasClasesFinal = {
                            nombreSala: salaActual.nombre,
                            nuevasClases: listaNuevasClases
                        }

                        axios.post('https://api-dis2021.herokuapp.com/Sala/agregarClases', nuevasClasesFinal)
                        .then(() => {
                            alert('¡Clases Agregadas!')
                            window.location.replace('/menuClases')
                        })
                    }else{
                        setError(`Exite un conflicto con una clase: ${claseConflicto.nombre}, Hora de Inicio: ${claseConflicto.horaInicio}, Hora de Finalización: ${claseConflicto.horaFin}`)
                    }
                }
            }else{
                setError('Hubo un problema con el día seleccionado')
            }
        }
    }

    return (
        <div style={{margin: '0px 0px 20px'}}>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0 45px'}}>
                <h1 style={{color:'#5A47AB'}}>
                    Agregar Clase
                </h1>
            </div>
            <div className="container">
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Sala
                        </h2>
                        <select
                        required
                        className="form-control"
                        value={salaActual.nombre}
                        onChange={e => handleChangeSala(e.target.value)}
                        style={{width:"400px"}}>
                            {
                                listaSalas.map(e => MakeOptions(e.nombre))
                            }
                        </select>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

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
                    </div>
                </div>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
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
                                listaServiciosParcial.map(e => MakeOptions(e.nombre))
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

                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <text style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            ¿Repetir todas las semanas del mes?
                        </text>&nbsp;
                        <input type="checkbox" placeholder='Aforo Inicial' name="aforo" required
                        checked={repetible}
                        onChange={e => setRepetible(!repetible)}
                        style={{width:"20px",height:"20px"}}>
                        </input>
                    </div>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '30px 0 20px'}}>
                    <label>{error}</label>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0px 100px'}}>
                        <Button buttonStyle='btn--outline2' path='/menuClases' specificStyle={{width: '260px'}}>Volver al Menú de Clases</Button>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button buttonStyle='btn--outline2' onClick={handleSubmit} specificStyle={{width: '260px'}}>Agregar Clase</Button>
                </div>
            </div>
        </div>
    )
}

export default AgregarClase
