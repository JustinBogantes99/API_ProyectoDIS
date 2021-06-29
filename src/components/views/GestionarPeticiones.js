import React, { useState } from 'react';
import { Button } from '../Button';
import Calendar from "react-range-calendar";
import { Controller } from '../Controller/Controller';
import { Sala } from '../Model/Sala';
import { VisitorClases } from '../Visitor/VisitorClases';
import { VisitorClasesStandby } from '../Visitor/VisitorClasesStandby';
import { Clase } from '../Model/Clase';
import { Notifier } from '../Observer/Notifier';
import { Subscriber } from '../Observer/Observer';

function GestionarPeticiones() {
    const controller = new Controller()
    const [visitorClases, setVisitorClases] = useState(new VisitorClases())
    const [visitorClasesStandby, setVisitorClasesStandby] = useState(new VisitorClasesStandby())
    const [accionRealizada, setAccionRealizada] = useState(false)

    const [listaSalas, setListaSalas] = useState([])
    const [salaActual, setSalaActual] = useState(new Sala())
    const [claseActual, setClaseActual] = useState(new Clase())
    const [claseIncluir, setClaseIncluir] = useState(new Clase())
    const [claseExcluir, setClaseExcluir] = useState(new Clase())
    const [listaClasesPendientes, setListaClasesPendientes] = useState([])
    const [listaClasesPendientesHandler, setListaClasesPendientesHandler] = useState([])
    const [listaClasesPendientesAccion, setListaClasesPendientesAccion] = useState([])
    const [listaClasesDia, setListaClasesDia] = useState([])
    
    const [diaOriginal, setDiaOriginal] = useState('')
    const [error, setError] = useState();

    const [charger, setCharger] = useState(() => {
        let userData = controller.getLocalSession()
        controller.checkRoleAdministrador(userData)

        controller.getListaSalas()
        .then(respuesta => {
            var listaSalasLocal = respuesta.data
            if(listaSalasLocal.length > 0){
                const listaClasesSala = []
                for(var i = 0; i < listaSalasLocal.length; i++){
                    listaClasesSala.push(new Sala(listaSalasLocal[i]))
                }

                setListaSalas(listaClasesSala)
                setSalaActual(listaClasesSala[0])
                
                controller.manejarVisitorSala(listaClasesSala[0], visitorClasesStandby)
                //controller.manejarVisitorSala(listaClasesSala[0], visitorClases)

                const clasesVisitorLocal = visitorClasesStandby.getClases()

                const clasesPenLocal = []
                const clasesPenHandlerLocal = []

                for(var i  = 0; i < clasesVisitorLocal.length; i++){
                    clasesPenLocal.push(clasesVisitorLocal[i])
                    clasesPenHandlerLocal.push(clasesVisitorLocal[i])
                }

                setListaClasesPendientes(clasesPenLocal)
                setListaClasesPendientesHandler(clasesPenHandlerLocal)
                if(clasesPenHandlerLocal.length > 0){
                    setClaseActual(clasesPenLocal[0])
                    setClaseIncluir(clasesPenHandlerLocal[0])
                }else{
                    setClaseActual(new Clase())
                    setClaseIncluir(new Clase())
                }
            }
        })
    })

    const handleCambiarSala = e => {
        for(var i = 0; i < listaSalas.length; i++){
            if(controller.getNombreSala(listaSalas[i]) === e){
                setSalaActual(listaSalas[i])
                
                controller.manejarVisitorSala(listaSalas[i], visitorClasesStandby)

                const clasesVisitorLocal = visitorClasesStandby.getClases()

                const clasesPenLocal = []
                const clasesPenHandlerLocal = []

                for(var j  = 0; j < clasesVisitorLocal.length; j++){
                    clasesPenLocal.push(clasesVisitorLocal[j])
                    clasesPenHandlerLocal.push(clasesVisitorLocal[j])
                }

                setListaClasesPendientes(clasesPenLocal)
                setListaClasesPendientesHandler(clasesPenHandlerLocal)
                if(clasesPenHandlerLocal.length > 0){
                    setClaseActual(clasesPenLocal[0])
                    setClaseIncluir(clasesPenHandlerLocal[0])
                }else{
                    setClaseActual(new Clase())
                    setClaseIncluir(new Clase())
                }
                
                setListaClasesPendientesAccion([])
                setClaseExcluir(new Clase())
                
                setDiaOriginal('')
                setListaClasesDia([])
            }
        }
    }

    const handleCambioClaseActual = e => {
        for(var i = 0; i < listaClasesPendientes.length; i++){
            if(controller.getNombreClase(listaClasesPendientes[i]) === e){
                setClaseActual(listaClasesPendientes[i])
                i = listaClasesPendientes.length
            }
        }
    }

    const handleCambioDia = e => {
        var dia = new Date(e)
        dia.setDate(dia.getDate()+1)
        dia.setHours(0,0,0,0);
        
        setDiaOriginal(e)

        controller.setFechaVisitorMisClases(visitorClases, dia)
        controller.manejarVisitorSala(salaActual, visitorClases)


        var listaClasesLocal = controller.getClasesVisitorMisClases(visitorClases)
        setListaClasesDia(listaClasesLocal)
    }

    const handleCambiarIncluir = e => {
        for(var i = 0; i < listaClasesPendientesHandler.length; i++){
            if(controller.getNombreClase(listaClasesPendientesHandler[i]) === e){
                setClaseIncluir(listaClasesPendientesHandler[i])
                i = listaClasesPendientesHandler.length
            }
        }
    }

    const handleCambiarExcluir = e => {
        for(var i = 0; i < listaClasesPendientesAccion.length; i++){
            if(controller.getNombreClase(listaClasesPendientesAccion[i]) === e){
                setClaseExcluir(listaClasesPendientesAccion[i])
                i = listaClasesPendientesAccion.length
            }
        }
    }


    const handleAgregarClase = () => {
        if(listaClasesPendientesHandler.length > 0){
            for(var i = 0; i < listaClasesPendientesHandler.length; i++){
                if(controller.getNombreClase(listaClasesPendientesHandler[i]) === controller.getNombreClase(claseIncluir)){
                    listaClasesPendientesAccion.push(listaClasesPendientesHandler[i])
                    listaClasesPendientesHandler.splice(i, 1)
                    if(listaClasesPendientesHandler.length > 0)setClaseIncluir(listaClasesPendientesHandler[0])
                    else setClaseIncluir(new Clase())
                    i = listaClasesPendientesHandler.length
                }
            }

            listaClasesPendientesAccion.sort(function(a,b){
                if(a.getNombre() < b.getNombre()) { return -1; }
                if(a.getNombre() > b.getNombre()) { return 1; }
                return 0;
            })
            setClaseExcluir(listaClasesPendientesAccion[0])
        }
    }

    const handleExcluirClase = () => {
        if(listaClasesPendientesAccion.length > 0){
            for(var i = 0; i < listaClasesPendientesAccion.length; i++){
                if(controller.getNombreClase(listaClasesPendientesAccion[i]) === controller.getNombreClase(claseExcluir)){
                    listaClasesPendientesHandler.push(listaClasesPendientesAccion[i])
                    listaClasesPendientesAccion.splice(i, 1)
                    if(listaClasesPendientesAccion.length > 0)setClaseExcluir(listaClasesPendientesAccion[0])
                    else setClaseExcluir(new Clase())
                    i = listaClasesPendientesAccion.length
                }
            }

            listaClasesPendientesHandler.sort(function(a,b){
                if(a.getNombre() < b.getNombre()) { return -1; }
                if(a.getNombre() > b.getNombre()) { return 1; }
                return 0;
            })
            setClaseIncluir(listaClasesPendientesHandler[0])
        }
    }

    const handleRechazar = () => {
        var nombreSala = controller.getNombreSala(salaActual)
        for(var i = 0; i < listaClasesPendientesAccion.length; i++){
            controller.pullClase(listaClasesPendientesAccion[i], nombreSala)
        }
        setAccionRealizada(true)
    }

    const handleSubmit = () => {
        if(listaClasesPendientesAccion.length > 0){
            setError('')

            var sinConflictos = true
            var claseConflicto = ''
            var segundaClaseConflicto = ''

            for(var i = 0; i < (listaClasesPendientesAccion.length-1); i++){
                if(controller.getDiaEjecucionClase(listaClasesPendientesAccion[i]) === controller.getDiaEjecucionClase(listaClasesPendientesAccion[i+1])){
                    if((controller.getHoraInicioClase(listaClasesPendientesAccion[i]) < controller.getHoraInicioClase(listaClasesPendientesAccion[i+1]) && 
                        controller.getHoraFinClase(listaClasesPendientesAccion[i]) < controller.getHoraFinClase(listaClasesPendientesAccion[i+1])) || 
                       (controller.getHoraInicioClase(listaClasesPendientesAccion[i]) >= controller.getHoraFinClase(listaClasesPendientesAccion[i+1]) &&
                        controller.getHoraFinClase(listaClasesPendientesAccion[i]) > controller.getHoraFinClase(listaClasesPendientesAccion[i+1]))){

                    }else{
                        sinConflictos = false
                        claseConflicto = listaClasesPendientesAccion[i]
                        segundaClaseConflicto = listaClasesPendientesAccion[i+1]
                    }
                }
            }

            if(sinConflictos){
                var sinConflictosClasesAutorizadas = true

                for(var i = 0; i < listaClasesPendientesAccion.length; i++){
                    controller.setFechaVisitorClases(visitorClases, new Date(controller.getDiaEjecucionClase(listaClasesPendientesAccion[i])))
                    controller.manejarVisitorSala(salaActual, visitorClases)
                    var listaClasesDia = controller.getClasesVisitorClases(visitorClases)

                    for(var j = 0; j < listaClasesDia.length; j++){
                        if(controller.getEstadoClase(listaClasesDia[j]) === 'Autorizado'){
                            if((controller.getHoraInicioClase(listaClasesPendientesAccion[i]) < controller.getHoraInicioClase(listaClasesDia[j]) && 
                                controller.getHoraFinClase(listaClasesPendientesAccion[i]) < controller.getHoraFinClase(listaClasesDia[j])) || 
                               (controller.getHoraInicioClase(listaClasesPendientesAccion[i]) >= controller.getHoraFinClase(listaClasesDia[j]) &&
                                controller.getHoraFinClase(listaClasesPendientesAccion[i]) > controller.getHoraFinClase(listaClasesDia[j]))){

                            }else{
                                sinConflictosClasesAutorizadas = false
                                claseConflicto = listaClasesPendientesAccion[i]
                                segundaClaseConflicto = listaClasesDia[j]
                            }
                        }
                    }
                }

                if(sinConflictosClasesAutorizadas){
                    setError('')
                    var notifier = new Notifier()
                    let mensaje= "Se ha aprobado la solicitud de una de sus peticiones de clase";

                    for(var i = 0; i < listaClasesPendientesAccion.length; i++){
                        notifier.subscribe(new Subscriber(controller.getInstructorClase(listaClasesPendientesAccion[i])));                        

                        controller.setEstadoClase(listaClasesPendientesAccion[i], 'Autorizado')
                        console.log(listaClasesPendientesAccion[i])
                        var claseObject = JSON.parse(JSON.stringify(listaClasesPendientesAccion[i]))

                        controller.setClase(claseObject, controller.getNombreSala(salaActual))
                    }

                    notifier.notify(mensaje);
                    notifier.clearSubscribers();
                            
                    setAccionRealizada(true)
                }else{
                    setError(`La clase ${controller.getNombreClase(claseConflicto)} posee un conflicto con la Clase Autorizada ${controller.getNombreClase(segundaClaseConflicto)}`)
                }
            }else{
                setError(`La clase ${controller.getNombreClase(claseConflicto)} posee un conflicto con la Petición ${controller.getNombreClase(segundaClaseConflicto)}`)
            }
        }else{
            setError('No se ha seleccionado ninguna clase a aprobar')
        }
    }

    return (
        <div style={{margin: '0px 0px 20px'}}>
            {
            !accionRealizada?
            (<>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0 45px'}}>
                <h1 style={{color:'#5A47AB'}}>
                    Gestionar Peticiones
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
                        value={salaActual.getNombre()}
                        onChange={e => handleCambiarSala(e.target.value)}
                        style={{width:"400px"}}>
                            {
                                listaSalas.map(e => controller.MakeOptions(controller.getNombreSala(e)))
                            }
                        </select>

                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Clases Sin Autorizar
                        </h2>
                        <select
                        required
                        className="form-control"
                        value={claseActual.getNombre()}
                        onChange={e => handleCambioClaseActual(e.target.value)}
                        style={{width:"400px"}}>
                            {
                                listaClasesPendientes.map(e => controller.MakeOptions(controller.getNombreClase(e)))
                            }
                        </select>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Clases Aprobadas del Día
                        </h2>
                        <input type="date" placeholder='Día de la Clase' name="diaClase" required
                        className="form-control" 
                        value={diaOriginal}
                        onChange={e => handleCambioDia(e.target.value)}
                        style={{width:"400px"}}>
                        </input>
                    </div>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{color:'#5A47AB', width:'350px'}}>
                            Clases Pendientes
                        </h2>
                        <select
                            name="partialBenefitList"
                            className="form-control"
                            value={claseIncluir.getNombre()}
                            onChange={e => handleCambiarIncluir(e.target.value)}
                        >
                            {
                                listaClasesPendientesHandler.map(e => controller.MakeOptions(controller.getNombreClase(e)))
                            }
                        </select>
                    </div>
                    <div className="form-group" style={{margin: '30px 30px 10px'}}>
                        <div className="row justify-content-center align-items-center" style={{margin: '0px 0px 10px'}}>
                            <Button buttonStyle='btn--outline2' onClick={handleAgregarClase}>{'→'}</Button>
                        </div>
                        <div className="row justify-content-center align-items-center" style={{margin: '0px 0px 10px'}}>
                            <Button buttonStyle='btn--outline2' onClick={handleExcluirClase}>{'←'}</Button>
                        </div>
                    </div>
                    <div className="form-group" style={{margin: '10px 10px 10px'}}>
                        <h2 style={{color:'#5A47AB', width:'350px'}}>
                            Clases para Acción
                        </h2>
                        <select
                            name="benefits"
                            className="form-control"
                            value={claseExcluir.getNombre()}
                            onChange={e => handleCambiarExcluir(e.target.value)}
                        >
                            {
                                listaClasesPendientesAccion.map(e => controller.MakeOptions(controller.getNombreClase(e)))
                            }
                        </select>
                    </div>
                </div>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '30px 0 20px'}}>
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{display: "flex", justifyContent: "center",color:'#5A47AB', margin: '10px 0 0px'}}>
                            Lista de Clases del Día
                        </h2>
                        <div className="container" style={{maxHeight: 350, overflow: 'auto', width:"400px", height:"800px", backgroundColor: '#000000', borderRadius: 10}}>
                            {
                                listaClasesDia.map(e => controller.cargarClases(e))
                            }
                        </div>
                    </div>
                </div>

                {
                listaClasesPendientes.length > 0?(
                <>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0 45px'}}>
                    <h1 style={{color:'#5A47AB'}}>
                        Detalles de la Petición Actual
                    </h1>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Nombre de la Clase
                        </h2>
                        <input type="text" placeholder='Nombre de la Clase' name="nombreClase" required
                        className="form-control" 
                        value={claseActual.getNombre()}
                        style={{width:"400px"}}>
                        </input>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                    <div className="form-group" style={{margin: '10px 10px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Día de la Clase
                        </h2>
                        <input type="date" placeholder='Día de la Clase' name="diaClase" required
                        className="form-control" 
                        value={`${new Date(claseActual.getDiaEjecucion()).getFullYear()}-${new Date(claseActual.getDiaEjecucion()).getMonth()>8?(new Date(claseActual.getDiaEjecucion()).getMonth()+1):('0'+(new Date(claseActual.getDiaEjecucion()).getMonth()+1))}-${new Date(claseActual.getDiaEjecucion()).getDate()}`}
                        style={{width:"400px"}}>
                        </input>
                    </div>
                </div>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Servicio
                        </h2>
                        <input type="text" placeholder='Nombre de la Clase' name="nombreClase" required
                        className="form-control" 
                        value={claseActual.getServicio().getNombre()}
                        style={{width:"400px"}}>
                        </input>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                    <div className="form-group" style={{margin: '10px 10px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Instructor
                        </h2>
                        <input type="text" placeholder='Nombre de la Clase' name="nombreClase" required
                        className="form-control" 
                        value={claseActual.getInstructor().getNombreCompleto()}
                        style={{width:"400px"}}>
                        </input>
                    </div>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Precio de la Clase
                        </h2>
                        <input type="number" placeholder='Precio de la Clase' name="precioDeLaClase" required
                        className="form-control" 
                        value={claseActual.getPrecio()}
                        style={{width:"400px"}}>
                        </input>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                    <div className="form-group" style={{margin: '10px 10px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Cupos de la Clase
                        </h2>
                        <input type="number" placeholder='Cupos de la Clase' name="cuposClase" required
                        className="form-control" 
                        value={claseActual.getCapacidadMaxima()}
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
                        value={claseActual.getHoraInicio()}
                        style={{width:"400px"}}>
                        </input>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="form-group" style={{margin: '10px 10px 10px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Hora de Finalización
                        </h2>
                        <input type="time" placeholder='Hora de Finalización' name="finClase" required
                        className="form-control" 
                        value={claseActual.getHoraFin()}
                        style={{width:"400px"}}>
                        </input>
                    </div>
                </div>  
                
                </>  
                ):(<></>)
                }


                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '30px 0 20px'}}>
                    <label>{error}</label>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0px 100px'}}>
                        <Button buttonStyle='btn--outline2' path='/menuClases' specificStyle={{width: '265px'}}>Volver al Menú de Clases</Button>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button buttonStyle='btn--outline2' onClick={handleRechazar} specificStyle={{width: '265px'}}>Rechazar Peticiones</Button>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button buttonStyle='btn--outline2' onClick={handleSubmit} specificStyle={{width: '265px'}}>Autorizar Peticiones</Button>
                </div>
            </div>
            </>):
            (<>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0 45px'}}>
                <h1 style={{color:'#5A47AB'}}>
                    ¡Acción Realizada Exitosamente!
                </h1>
            </div>
            <div className="container">
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0px 100px'}}>
                    <Button buttonStyle='btn--outline2' path='/menuClases' specificStyle={{width: '265px'}}>Volver al Menú de Clases</Button>
                </div>
            </div>
            
            </>)
            }
            
        </div>
    )
}

export default GestionarPeticiones
