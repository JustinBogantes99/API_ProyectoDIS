import React, { useState } from 'react';
import { Button } from '../Button';
import Calendar from "react-range-calendar";
import axios from 'axios';
import {Sala} from '../Model/Sala';
import {VisitorClases} from '../Visitor/VisitorClases';
import {Controller} from '../Controller/Controller'
import { Instructor } from '../Model/Instructor';
import { Servicio } from '../Model/Servicio';
import { Clase } from '../Model/Clase';
import {StrategyManager} from '../Strategy/Stategy'
import { Subscriber } from '../Observer/Observer';
import { Notifier } from '../Observer/Notifier';

function AgregarPeticion() {
    const controller = new Controller()

    const [newClase, setNewClase] = useState(new Clase())
    const visitorSala = new VisitorClases(new Date())
    const [listaClases, setListaClases] = useState([])
    const [accionRealizada, setAccionRealizada] = useState(false)

    const [salaActual, setSalaActual] = useState({nombre:''})
    const [listaServiciosParcial, setListaServiciosParcial] = useState([])
    const [servicioActual, setServicioActual] = useState(new Servicio())
    const [listaTrabajadoresParcial, setListaTrabajadoresParcial] = useState([])
    const [trabajadorActual, setTrabajadorActual] = useState(new Instructor())
    const [cupoMaximo, setCupoMaximo] = useState(0)

    const [nombreClase, setNombreClase] = useState('')
    const [precio, setPrecio] = useState(0)
    const [cupos, setCupos] = useState(0)
    const [dia, setDia] = useState([new Date()])
    const [inicioClase, setInicioClase] = useState('07:00');
    const [finClase, setFinClase] = useState('07:00');
    const [error, setError] = useState();

    //Se crean los objetos del patrón observer
    const notifier = new Notifier()

    const [charger, setCharger] = useState(() => {
        let userData = controller.getLocalSession()
        controller.checkRoleInstructor(userData)

        controller.getListaSalas()
        .then(respuesta => {
            var salaActualLocal = ''
            for(var i = 0; i < respuesta.data.length; i++){
                if(respuesta.data[i]._id === userData.idSala){
                    salaActualLocal = respuesta.data[i]
                }
            }

            if(salaActualLocal){
                var salaActualClase = new Sala(salaActualLocal)
                setSalaActual(salaActualClase)

                controller.manejarVisitorSala(salaActualClase, visitorSala)

                setListaClases(visitorSala.getClases())
            }

            controller.getUsuario(userData.username)
            .then(respuesta => {
                var instructorLocal = new Instructor(respuesta.data[0], true)
                setTrabajadorActual(instructorLocal)

                controller.setInstructorClase(newClase, instructorLocal)

                listaTrabajadoresParcial.push(instructorLocal)

                var serviciosInstructor = controller.getServiciosInstructor(instructorLocal)
                setListaServiciosParcial(serviciosInstructor)
                
                if(serviciosInstructor.length > 0){
                    setServicioActual(instructorLocal.getServicios()[0])
                    setPrecio(instructorLocal.getServicios()[0].getPrecio())

                    controller.setServicioClase(newClase, instructorLocal.getServicios()[0])
                    controller.setPrecioClase(newClase, instructorLocal.getServicios()[0].getPrecio())

                    var cuposAforo = controller.getAforoMontoSala(salaActualClase)*0.01*controller.getCapacidadMaximaSala(salaActualClase)
                    if(cuposAforo < instructorLocal.getServicios()[0].getMaximoPersonas()){
                        setCupoMaximo(cuposAforo)
                        setCupos(cuposAforo)

                        controller.setCapacidadMaximaClase(newClase, cuposAforo)
                    }else{
                        setCupoMaximo(instructorLocal.getServicios()[0].getMaximoPersonas())
                        setCupos(instructorLocal.getServicios()[0].getMaximoPersonas())

                        controller.setCapacidadMaximaClase(newClase, instructorLocal.getServicios()[0].getMaximoPersonas())   
                    }

                    setNewClase(newClase)
                }
            })
        })
    })

    const cambiarNombre = e => {
        setError('')
        setNombreClase(e)
        controller.setNombreClase(newClase, e)
    }

    const cambiarServicio = e => {
        setError('')
        var servicios = controller.getServiciosInstructor(controller.getInstructorClase(newClase))
        for(var i = 0; i < servicios.length; i++){
            if(controller.getNombreServicio(servicios[i]) === e){
                setServicioActual(servicios[i])
                setPrecio(controller.getPrecioServicio(servicios[i]))

                controller.setServicioClase(newClase, servicios[i])
                controller.setPrecioClase(newClase, controller.getPrecioServicio(servicios[i]))

                var cuposAforo = controller.getAforoMontoSala(salaActual)*0.01*controller.getCapacidadMaximaSala(salaActual)
                if(cuposAforo < servicios[i].getMaximoPersonas()){
                    setCupoMaximo(cuposAforo)
                    setCupos(cuposAforo)

                    controller.setCapacidadMaximaClase(newClase, cuposAforo)
                }else{
                    setCupoMaximo(servicios[i].getMaximoPersonas())
                    setCupos(servicios[i].getMaximoPersonas())

                    controller.setCapacidadMaximaClase(newClase, servicios[i].getMaximoPersonas())   
                }
            }
        }
    }

    const cambiarPrecio = e => {
        setError('')
        setPrecio(e)
        controller.setPrecioClase(newClase, e)
    }

    const cambiarCupos = e => {
        if(e <= cupoMaximo){
            setError('')

            setCupos(e)
            controller.setCapacidadMaximaClase(newClase, Number(e))
        }else{
            setError('El máximo de cupos permitido es de '+cupoMaximo)
        }
    }

    const cambiarHoraInicio = e => {
        var listaHorario = controller.getHorarioSala(salaActual)

        const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
        const diaActual = diasSemana[dia[0].getDay()]
        var horarioDia = null

        for(var i = 0; i < listaHorario.length; i++){
            if(listaHorario[i].dia === diaActual){
                horarioDia = salaActual.horario[i]
            }
        }

        if(e > finClase){
            setError('La hora de Inicio ingresada no puede ser mayor a la hora de Finalización')
        }else if(e < controller.getInicioHorario(horarioDia)){
            setError('La hora de Inicio ingresada sucede antes que la sala abra '+controller.getInicioHorario(horarioDia)+'-'+controller.getCierreHorario(horarioDia))
        }else{
            setError('')
            setInicioClase(e)
            controller.setHoraInicioClase(newClase, e)
        }
    }

    const cambiarHoraFin = e => {
        var listaHorario = controller.getHorarioSala(salaActual)

        const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
        const diaActual = diasSemana[dia[0].getDay()]
        var horarioDia = null

        for(var i = 0; i < listaHorario.length; i++){
            if(listaHorario[i].dia === diaActual){
                horarioDia = salaActual.horario[i]
            }
        }

        if(e < inicioClase){
            setError('La hora de Finalización ingresada no puede ser menor a la hora de Inicio')
        }else if(e > controller.getCierreHorario(horarioDia)){
            setError('La hora de Finalización ingresada sucede después que la sala cierre '+controller.getInicioHorario(horarioDia)+'-'+controller.getCierreHorario(horarioDia))
        }else{
            setError('')
            setFinClase(e)
            controller.setHoraFinClase(newClase, e)
        }
    }

    const cambiarDia = dia => {
        if(dia.getTime() > new Date().getTime()){
            setError('')
            
            setDia([dia])
            controller.setDiaEjecucionClase(newClase, dia)

            setInicioClase('07:00')
            setFinClase('07:00')
            controller.setHoraInicioClase(newClase, '07:00')
            controller.setHoraFinClase(newClase, '07:00')

            controller.setFechaVisitorClases(visitorSala, dia)
            controller.manejarVisitorSala(salaActual, visitorSala)

            setListaClases(controller.getClasesVisitorClases(visitorSala))
        }else{
            setError('El dia de la clase no puede ser el día actual o anterior')
        }
        
    }

    const handleSubmit = () => {
        if(!nombreClase || listaServiciosParcial.length < 0 || !precio || !cupos){
            setError("Debe rellernar todos los campos para hacer una solicitud de clase")
        }else if(precio <= 0){
            setError('El precio no puede ser menor o igual a 0')
        }else if(cupos <= 0){
            setError("Los cupos totales no pueden ser menores o iguales a 0")
        }else if(inicioClase === finClase){
            setError("Las horas de Incio y Finalización no pueden ser las mismas")
        }else{
            setError('')

            var noProblem = true
            var claseConflicto = ''

            for(var i = 0; i < listaClases.length; i++){
                if((inicioClase < controller.getHoraInicioClase(listaClases[i]) && finClase < controller.getHoraFinClase(listaClases[i])) ||
                    (inicioClase >= controller.getHoraFinClase(listaClases[i]) && finClase > controller.getHoraFinClase(listaClases[i]))){

                }else{
                    noProblem = false
                    claseConflicto = listaClases[i]
                }
            }

            if(noProblem){
                controller.pushClaseSala(salaActual, newClase)

                var strategyInstructor = new StrategyManager("Instructor")

                strategyInstructor.setClase(newClase)
                strategyInstructor.setNombreSala(salaActual.nombre)
                strategyInstructor.execute()

                strategyInstructor.sleep(500)
                .then(() => {
                    alert('¡Petición Agregada!')
                    window.location.replace('/menuPeticion')
                })

                setAccionRealizada(true)
                /* axios.post('https://api-dis2021.herokuapp.com/Sala/agregarClases', nuevasClasesFinal)
                .then(() => {
                    // Se obtiene la lista de administradores relacionados a la clase a la cual se le está haciendo la petición
                    // falta agregar como se consiguen
                    let administradores=[];
                    administradores.forEach(administrador => {
                        notifier.subscribe(new Subscriber(administrador));
                    })
                    //Se manda la notificacion al administrador.
                    let mensaje = " a solicitado la creación de un nuevo servicio, para la clase: "+clase.nombre;
                    notifier.notify(mensaje)

                    notifier.clearSubscribers();
                    //

                    alert('¡Petición Agregada!')
                    window.location.replace('/menuPeticion')
                }) */
            }else{
                setError(`Existe un conflicto con una clase Aprobada: ${controller.getNombreClase(claseConflicto)}, Hora de Inicio: ${controller.getHoraInicioClase(claseConflicto)}, Hora de Finalización: ${controller.getHoraFinClase(claseConflicto)}`)
            }
            
        }

    }

    return (
        <div style={{margin: '0px 0px 20px'}}>
        {
            !accionRealizada?(
            <>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0 45px'}}>
                <h1 style={{color:'#5A47AB'}}>
                    Agregar Petición
                </h1>
            </div>
            <div className="container">
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Nombre de la Clase
                        </h2>
                        <input type="text" placeholder='Nombre de la Clase' name="nombreClase" required
                        className="form-control" 
                        value={nombreClase}
                        onChange={e => cambiarNombre(e.target.value)}
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
                        value={servicioActual.getNombre()}
                        onChange={e => cambiarServicio(e.target.value)}
                        style={{width:"400px"}}>
                            {
                                trabajadorActual.getServicios().map(e => controller.MakeOptions(e.getNombre()))
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
                        value={controller.getNombreCompletoInstructor(controller.getInstructorClase(newClase))}
                        style={{width:"400px"}}>
                            {
                                listaTrabajadoresParcial.map(e => controller.MakeOptions(e.getNombreCompleto()))
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
                        onChange={e => cambiarPrecio(e.target.value)}
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
                        onChange={e => cambiarCupos(e.target.value)}
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
                        onChange={e => cambiarHoraInicio(e.target.value)}
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
                        onChange={e => cambiarHoraFin(e.target.value)}
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
                            onDateClick={dia => cambiarDia(dia)}
                            type="single"
                        />
                    </div>

                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{display: "flex", justifyContent: "center",color:'#5A47AB', margin: '10px 0 0px'}}>
                            Lista de Clases
                        </h2>
                        <div className="container" style={{maxHeight: 350, overflow: 'auto', width:"400px", height:"800px", backgroundColor: '#000000', borderRadius: 10}}>
                            {
                                listaClases.map(e => controller.cargarClases(e))
                            }
                        </div>
                    </div>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '30px 0 20px'}}>
                    <label>{error}</label>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0px 100px'}}>
                        <Button buttonStyle='btn--outline2' path='/menuPeticion' specificStyle={{width: '265px'}}>Volver al Menú de Peticiones</Button>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button buttonStyle='btn--outline2' onClick={handleSubmit} specificStyle={{width: '265px'}}>Agregar Petición</Button>
                </div>
            </div>
            </>):(
            <>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0 45px'}}>
                <h1 style={{color:'#5A47AB'}}>
                    ¡Agregar Realizada Exitosamente!
                </h1>
            </div>
            <div className="container">
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0px 100px'}}>
                    <Button buttonStyle='btn--outline2' path='/menuPeticion' specificStyle={{width: '265px'}}>Volver al Menú de Peticiones</Button>
                </div>
            </div>
            
            </>
            )
        }
            
        </div>
    )
}

export default AgregarPeticion
