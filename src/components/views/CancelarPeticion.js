import React, { useState } from 'react';
import { Button } from '../Button';
import {Controller} from '../Controller/Controller'
import { Clase } from '../Model/Clase';
import { Instructor } from '../Model/Instructor';
import { Sala } from '../Model/Sala';
import { VisitorMisClases } from '../Visitor/VisitorMisClases';
import axios from 'axios';

function CancelarPeticion() {
    const controller = new Controller()

    const [salaActual, setSalaActual] = useState(new Sala())
    const [instructorActual, setInstructorActual] = useState(new Instructor())
    const visitorMisClases = new VisitorMisClases(new Date())
    const [accionRealizada, setAccionRealizada] = useState(false)

    const [diaOriginal, setDiaOriginal] = useState('')
    const [listaClases, setListaClases] = useState([])
    const [claseActual, setClaseActual] = useState(new Clase())

    const [error, setError] = useState('')

    const [charger, setCharger] = useState(() => {
        let userData = controller.getLocalSession()
        controller.checkRoleInstructor(userData)
        var username = controller.getUsernameLocalSession(userData)

        controller.getUsuarioRaw(username)
        .then(respuesta => {
            var instructorLocal = new Instructor(respuesta, true)
            setInstructorActual(instructorLocal)

            controller.setNombreUsuarioVisitorMisClases(visitorMisClases, username)
            visitorMisClases.setNombreUsuario(username)

            var idSala = controller.getSalaIdLocalSession(userData)
            controller.getSalaConID(idSala)
            .then(sala => {
                var salaActualLocal = new Sala(sala)
                setSalaActual(salaActualLocal)
            })
        })
    })

    const handleCambioDia = e => {
        var dia = new Date(e)
        dia.setDate(dia.getDate()+1)
        dia.setHours(0,0,0,0);
        if(dia.getTime() > new Date().getTime()){
            setError('')
            
            setDiaOriginal(e)
            controller.setNombreUsuarioVisitorMisClases(visitorMisClases, controller.getNombreUsuarioInstructor(instructorActual))
            controller.setFechaVisitorMisClases(visitorMisClases, dia)
            controller.manejarVisitorSala(salaActual, visitorMisClases)


            var listaClasesLocal = controller.getClasesVisitorMisClases(visitorMisClases)
            setListaClases(listaClasesLocal)

            if(listaClasesLocal.length > 0){
                setClaseActual(listaClasesLocal[0])
            }else{
                setClaseActual(new Clase())
            }
        }else{
            setError('El dia de la clase a cancelar no puede ser el día actual o anterior')
        }
    }

    const handleSubmit = () => {
        /*console.log(salaActual)
        console.log(instructorActual)
        console.log(claseActual)
        console.log(listaClases)
        console.log(visitorMisClases)*/

        var mesDePublicado = new Date()
        mesDePublicado.setDate(mesDePublicado.getDate()+30)

        var diaOriginalLocal = new Date(diaOriginal)

        if(!diaOriginal || listaClases.length === 0){
            setError('No se puede eliminar clases que no existen')
        }else if(claseActual.getPagos() > 0){ //Agregar check de estado, si está en standby se puede eliminar aunque esté en fecha
            setError("Las clases publicadas no cancelarse si tienen al menos una persona en reserva")
        }else{
            setError('')

            //ESTA PARTE SE TIENE QUE MANDAR AL CONTROLLER
            const eliminandoClase = {
                nombreSala: controller.getNombreSala(salaActual),
                _id: controller.getIdClase(claseActual)
            }
            console.log(eliminandoClase)
            axios.post('https://api-dis2021.herokuapp.com/Sala/eliminarClase', eliminandoClase)
            .then(() => {
                alert('Clase eliminada!')
                window.location.replace('/menuClases')
            })
            setAccionRealizada(true)
        }
    }

    return (
        <div style={{margin: '0px 0px 20px'}}>
        {
        !accionRealizada?(
            <>
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0 45px'}}>
            <h1 style={{color:'#5A47AB'}}>
                Cancelar Petición
            </h1>
        </div>

        <div className="container">
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

                    style={{width:"300px"}}>
                        {
                            listaClases.map(e => controller.MakeOptions(controller.getNombreClase(e)))
                        }
                    </select>
                </div>
            </div>

            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '30px 0 20px'}}>
                <label>{error}</label>
            </div>

            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0px 100px'}}>
                    <Button buttonStyle='btn--outline2' path='/menuPeticion' specificStyle={{width: '260px'}}>Volver al Menú de Clases</Button>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button buttonStyle='btn--outline2' onClick={handleSubmit} specificStyle={{width: '260px'}}>Eliminar Clase</Button>
            </div>
        </div>
        </>
        ):(
            <>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0 45px'}}>
                <h1 style={{color:'#5A47AB'}}>
                    ¡Cancelación Realizada Exitosamente!
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

export default CancelarPeticion
