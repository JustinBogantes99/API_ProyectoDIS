import React, { useState } from 'react';
import { Button } from '../Button';
import { Controller } from '../Controller/Controller';
import { Clase } from '../Model/Clase';
import { Instructor } from '../Model/Instructor';
import { Sala } from '../Model/Sala';
import { VisitorClasesDecorator } from '../Visitor/VisitorClasesDecorator';
import Calendar from "react-range-calendar";
import { DecoratorEstado } from '../Decorator/DecoratorEstado';
import { Servicio } from '../Model/Servicio';
import { Notifier } from '../Observer/Notifier';
import { Subscriber } from '../Observer/Observer';

function EditarPeticion() {
    const controller = new Controller()
    const [visitorDecorator, setVisitorDecorator] = useState(new VisitorClasesDecorator())
    const [claseBloqueada, setClaseBloqueada] = useState(false)
    const [accionRealizada, setAccionRealizada] = useState(false)

    const [salaActual, setSalaActual] = useState(new Sala())
    const [instructorActual, setInstructorActual] = useState(new Instructor())

    const [diaOriginal, setDiaOriginal] = useState('')
    const [listaClases, setListaClases] = useState([])
    const [claseActual, setClaseActual] = useState(new DecoratorEstado(new Clase(), 'SoloLectura'))
    const [claseOriginal, setClaseOriginal] = useState(new DecoratorEstado(new Clase(), 'SoloLectura'))
    const [listaServicios, setListaServicios] = useState([])
    const [servicioActual, setServicioActual] = useState(new Servicio())
    const [instructorClase, setInstructorClase] = useState(new Instructor())
    const [listaClasesBloqueo, setListaClasesBloqueo] = useState([])

    const [cupoMaximo, setCupoMaximo] = useState(0)
    const [nombreClase, setNombreClase] = useState('')
    const [precio, setPrecio] = useState(0)
    const [cupos, setCupos] = useState(0)
    const [dia, setDia] = useState([new Date()])
    const [inicioClase, setInicioClase] = useState('07:00');
    const [finClase, setFinClase] = useState('07:00');
    const [error, setError] = useState();

    const notifier = new Notifier();

    const [charger, setCharger] = useState(() => {
        let userData = controller.getLocalSession()
        controller.checkRoleInstructor(userData)

        var username = controller.getUsernameLocalSession(userData)
        controller.getUsuarioRaw(username)
        .then(respuesta => {
            var instructorLocal = new Instructor(respuesta, true)
            setInstructorActual(instructorLocal)
            visitorDecorator.setNombreUsuario(username)

            var idSala = controller.getSalaIdLocalSession(userData)
            controller.getSalaConID(idSala)
            .then(sala => {
                var salaActualLocal = new Sala(sala)

                salaActualLocal.getServicios().sort(function(a,b){
                    if(a.getNombre() < b.getNombre()) { return -1; }
                    if(a.getNombre() > b.getNombre()) { return 1; }
                    return 0;
                })

                setSalaActual(salaActualLocal)
            })
        })
    })

    const handleCambioDia = e => {
        setDiaOriginal(e)
        var diaSeleccionado= new Date(e)
        diaSeleccionado.setDate(diaSeleccionado.getDate()+1)
        diaSeleccionado.setHours(0,0,0,0);

        controller.setFechaVisitorClases(visitorDecorator, diaSeleccionado)
        visitorDecorator.execute(salaActual)

        var listaClasesLocal = controller.getClasesVisitorClases(visitorDecorator)
        setListaClases(listaClasesLocal)

        if(listaClasesLocal.length > 0){
            var claseActualLocal = listaClasesLocal[0]
            setClaseActual(claseActualLocal)
            setNombreClase(controller.getNombreClase(claseActualLocal))
            setListaServicios(controller.getServiciosSala(salaActual))
            setServicioActual(controller.getServicioClase(claseActualLocal))
            setInstructorClase(controller.getInstructorClase(claseActualLocal))
            setPrecio(controller.getPrecioClase(claseActualLocal))
            setCupos(controller.getCapacidadMaximaClase(claseActualLocal))
            setInicioClase(controller.getHoraInicioClase(claseActualLocal))
            setFinClase(controller.getHoraFinClase(claseActualLocal))
            setDia([new Date(controller.getDiaEjecucionClase(claseActualLocal))])
        }else{
            setClaseActual(new DecoratorEstado(new Clase(), 'SoloLectura'))
        }
    }

    const handleCambiarClase = e => {
        for(var i = 0; i < listaClases.length; i++){
            if(listaClases[i].getNombre() === e){
                var claseActualLocal = listaClases[i]
                setClaseActual(claseActualLocal)
                setNombreClase(controller.getNombreClase(claseActualLocal))
                setListaServicios(controller.getServiciosSala(salaActual))
                setServicioActual(controller.getServicioClase(claseActualLocal))
                setInstructorClase(controller.getInstructorClase(claseActualLocal))
                setPrecio(controller.getPrecioClase(claseActualLocal))
                setCupos(controller.getCapacidadMaximaClase(claseActualLocal))
                setInicioClase(controller.getHoraInicioClase(claseActualLocal))
                setFinClase(controller.getHoraFinClase(claseActualLocal))
                setDia([new Date(controller.getDiaEjecucionClase(claseActualLocal))])
            }
        }
    }

    const handleCambiarNombre = e => {
        if(claseBloqueada){
            setError('')
            setNombreClase(e)
            controller.setNombreClase(claseActual, e)
            console.log(claseActual)
        }
    }

    const handleCambiarServicio = e => {
        if(claseBloqueada){
            for(var i = 0; i < listaServicios.length; i++){
                if(controller.getNombreServicio(listaServicios[i]) === e){
                    setError('')
                    setServicioActual(listaServicios[i])
                    controller.setServicioClase(claseActual, listaServicios[i])

                    var cuposAforo = controller.getAforoMontoSala(salaActual)*0.01*controller.getCapacidadMaximaSala(salaActual)
                    if(cuposAforo < controller.getMaximoPersonasServicio(listaServicios[i])){
                        setCupoMaximo(cuposAforo)
                        setCupos(cuposAforo)
    
                        controller.setCapacidadMaximaClase(claseActual, cuposAforo)
                    }else{
                        setCupoMaximo(controller.getMaximoPersonasServicio(listaServicios[i]))
                        setCupos(controller.getMaximoPersonasServicio(listaServicios[i]))
    
                        controller.setCapacidadMaximaClase(claseActual, controller.getMaximoPersonasServicio(listaServicios[i]))   
                    }

                    setPrecio(controller.getPrecioServicio(listaServicios[i]))
                    controller.setPrecioClase(claseActual, controller.getPrecioServicio(listaServicios[i]))

                    console.log(claseActual)
                }
            }
        }
    }

    const handlePrecio = e => {
        if(claseBloqueada){
            setError('')
            setPrecio(Number(e))
            controller.setPrecioClase(claseActual, Number(e))
            console.log(claseActual)
        }
    }

    const handleCambiarCupos = e => {
        if(claseBloqueada){
            var cuposLocal = Number(e)
            if(cuposLocal <= cupoMaximo){
                setError('')
                setCupos(cuposLocal)
                controller.setCapacidadMaximaClase(claseActual, cuposLocal)
                console.log(claseActual)
            }else{
                setError('La cantidad máxima permitida para esta clase es '+cupoMaximo)
            }
        }
    }

    const handleCambiarInicioClase = e => {
        if(claseBloqueada){
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
                controller.setHoraInicioClase(claseActual, e)
                console.log(e)
                console.log(claseActual)
            }
        }
    }

    const handleCambiarFinClase = e => {
        if(claseBloqueada){
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
                controller.setHoraFinClase(claseActual, e)
                console.log(e)
                console.log(claseActual)
            }
        }
    }

    const handleCambiarDiaBloqueo = dia => {
        if(claseBloqueada){
            if(dia.getTime() >= new Date().getTime()){
                setError('')
                
                setDia([dia])
                controller.setDiaEjecucionClase(claseActual, dia)
    
                setInicioClase('07:00')
                setFinClase('07:00')
                controller.setHoraInicioClase(claseActual, '07:00')
                controller.setHoraFinClase(claseActual, '07:00')
    
                controller.setFechaVisitorClases(visitorDecorator, dia)
                controller.manejarVisitorSala(salaActual, visitorDecorator)
    
                setListaClasesBloqueo(controller.getClasesVisitorClases(visitorDecorator))
                console.log(claseActual)
                console.log(visitorDecorator)
            }else{
                setError('El dia de la clase no puede ser el día actual o anterior')
            }
        }
    }

    const handleBloqueo = () => {
        var claseObject = JSON.parse(JSON.stringify(claseActual.getClase()))
        setClaseOriginal(claseObject)
        controller.setEstadoClase(claseActual, 'Bloqueado')
        claseObject = JSON.parse(JSON.stringify(claseActual.getClase()))
        controller.setClase(claseObject, controller.getNombreSala(salaActual))

        setListaServicios(controller.getServiciosInstructor(instructorActual))

        var cuposAforo = controller.getAforoMontoSala(salaActual)*0.01*controller.getCapacidadMaximaSala(salaActual)
        if(cuposAforo < controller.getMaximoPersonasServicio(controller.getServicioClase(claseActual))){
            setCupoMaximo(cuposAforo)
            if(controller.getMaximoPersonasServicio(controller.getServicioClase(claseActual)) < cuposAforo)setCupos(cuposAforo)

            controller.setCapacidadMaximaClase(claseActual, cuposAforo)
        }else{
            setCupoMaximo(controller.getMaximoPersonasServicio(controller.getServicioClase(claseActual)))   
        }

        controller.setFechaVisitorClases(visitorDecorator, dia[0])
        controller.manejarVisitorSala(salaActual, visitorDecorator)

        setListaClasesBloqueo(controller.getClasesVisitorClases(visitorDecorator))

        setClaseBloqueada(true)
    }

    const restaurarClase = () => {
        controller.setClase(claseOriginal, controller.getNombreSala(salaActual))
    }

    const handleDesbloqueo = () => {
        restaurarClase()
        window.location.reload()   
    }

    const handleSubmit = () => {
        if(!nombreClase || listaServicios.length <= 0 || !precio || !cupos){
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

            for(var i = 0; i < listaClasesBloqueo.length; i++){
                if(listaClasesBloqueo[i].getEstado() === 'Autorizado'){
                    if((inicioClase < controller.getHoraInicioClase(listaClasesBloqueo[i]) && finClase < controller.getHoraFinClase(listaClasesBloqueo[i])) ||
                    (inicioClase >= controller.getHoraFinClase(listaClasesBloqueo[i]) && finClase > controller.getHoraFinClase(listaClasesBloqueo[i]))){

                    }else{
                        noProblem = false
                        claseConflicto = listaClasesBloqueo[i]
                    }
                }
            }

            if(noProblem){
                controller.setEstadoClase(claseActual, 'Standby')
                var claseObject = JSON.parse(JSON.stringify(claseActual.getClase()))
                console.log(claseObject)

                controller.setClase(claseObject, controller.getNombreSala(salaActual))
                
                
                //NOTIFICAR CON EL OBSERVER VA AQUÍ
                controller.getAdministradoresSala(controller.getNombreSala(salaActual))
                .then(listaAdministradores => {
                    console.log(listaAdministradores)
                    for(var i = 0; i < listaAdministradores.length; i++){
                        notifier.subscribe(new Subscriber(listaAdministradores[i]));
                    }

                    let mensaje= "El instructor "+controller.getNombreCompletoInstructor(instructorActual)+" solicitó la aprobación de la edición de la clase: "+ controller.getNombreClase(claseActual);
                    
                    notifier.notify(mensaje);

                    notifier.clearSubscribers();
    
                    setAccionRealizada(true)
                })
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
                    Editar Petición
                </h1>
            </div>
            <div className="container">
                {
                claseBloqueada?(<></>):(

                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
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
                        value={claseActual.getNombre()}
                        onChange={e => handleCambiarClase(e.target.value)}
                        style={{width:"400px"}}>
                            {
                                listaClases.map(e => controller.MakeOptions(e.getNombre()))
                            }
                        </select>
                    </div>
                </div>   

                )
                }

                {
                listaClases.length > 0?(
                <>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Nombre de la Clase
                        </h2>
                        <input type="text" placeholder='Nombre de la Clase' name="nombreClase" required
                        className="form-control" 
                        value={nombreClase}
                        onChange={e => handleCambiarNombre(e.target.value)}
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
                        value={servicioActual.getNombre()}
                        onChange={e => handleCambiarServicio(e.target.value)}
                        style={{width:"400px"}}>
                            {
                                listaServicios.map(e => controller.MakeOptions(e.getNombre()))
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
                        value={instructorClase.getNombreCompleto()}
                        style={{width:"400px"}}>
                            {
                                controller.MakeOptions(controller.getNombreCompletoInstructor(instructorClase))
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
                        onChange={e => handlePrecio(e.target.value)}
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
                        onChange={e => handleCambiarInicioClase(e.target.value)}
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
                        onChange={e => handleCambiarFinClase(e.target.value)}
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
                            onDateClick={dia => handleCambiarDiaBloqueo(dia)}
                            type="single"
                        />
                    </div>
                    {
                    claseBloqueada?(
                    
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{display: "flex", justifyContent: "center",color:'#5A47AB', margin: '10px 0 0px'}}>
                            Lista de Clases
                        </h2>
                        <div className="container" style={{maxHeight: 350, overflow: 'auto', width:"400px", height:"800px", backgroundColor: '#000000', borderRadius: 10}}>
                            {
                                listaClasesBloqueo.map(e => {
                                    if(e.getEstado() === 'Autorizado'){
                                        return controller.cargarClases(e.getClase())
                                    }
                                })
                            }
                        </div>
                    </div>

                    ):(<></>)
                    }
                </div>

                </>):(<></>)
                }


                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '30px 0 20px'}}>
                    <label>{error}</label>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0px 100px'}}>
                        {
                            claseBloqueada?(
                                <>
                                <Button buttonStyle='btn--outline2' onClick={handleDesbloqueo} specificStyle={{width: '265px'}}>Cancelar Edición</Button>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                                <Button buttonStyle='btn--outline2' onClick={handleSubmit} specificStyle={{width: '265px'}}>Editar Petición</Button>
                                </>
                            ):(
                                <>
                                <Button buttonStyle='btn--outline2' path='/menuPeticion' specificStyle={{width: '265px'}}>Volver al Menú de Peticiones</Button>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                                {(claseActual.getModo()==='Editable')?(<Button buttonStyle='btn--outline2' onClick={handleBloqueo} specificStyle={{width: '265px'}}>Bloquear Clase</Button>):(<></>)}
                                </>
                            )
                        }
                </div>
            </div>
            </>
            ):(
            <>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0 45px'}}>
                <h1 style={{color:'#5A47AB'}}>
                    ¡Edición Realizada Exitosamente!
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

export default EditarPeticion
