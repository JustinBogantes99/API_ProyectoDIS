import React, { useState } from 'react';
import { Button } from '../Button';
import { Controller } from '../Controller/Controller';

function getLocalSession() {
    let userData = localStorage.getItem('token');
    userData = JSON.parse(userData)
    return userData
}

function Menu() {
    const controller = new Controller()

    const [role, setRole] = useState(() => {
        let userData = getLocalSession();
        if(userData){
            return userData.role
        }else{
            window.location.replace('/login')
        }
    })

    const [usuario, setUsuario] = useState()
    const [notificaciones, setNotificaciones] = useState([])

    const [charger, setCharger] = useState(() => {
        var userData = controller.getLocalSession()

        controller.getUsuarioRaw(controller.getUsernameLocalSession(userData))
        .then(usuario => {
            if(usuario.notificaciones.length > 0){
                setNotificaciones(usuario.notificaciones)
                setUsuario(usuario)
            }
        })
    })

    return (
        <div style={{margin: '0px 0px 20px'}}>
            {
            notificaciones.length > 0?(
            <>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0 45px'}}>
                <h1 style={{color:'#5A47AB'}}>
                    Tiene {notificaciones.length > 1?(notificaciones.length+' notificaciones nuevas'):(notificaciones.length+' notificación nueva')}
                </h1>
            </div>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0 45px'}}>
                <h2>
                    {notificaciones[notificaciones.length-1]}
                </h2>
            </div>
            <div className="container">
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '100px 0px 100px'}}>
                    <Button buttonStyle='btn--outline2' onClick={() => {
                        notificaciones.pop()
                        if(notificaciones.length === 0) controller.deletenotificaciones(usuario)
                    }} specificStyle={{width: '200px'}}>Aceptar</Button>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button buttonStyle='btn--outline2' onClick={() => setNotificaciones([])} specificStyle={{width: '200px'}}>Aceptar todos</Button>
                </div>
            </div>  
            </>
            ):(
            <>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0 45px'}}>
                <h1 style={{color:'#5A47AB'}}>
                    Menú Principal
                </h1>
            </div>
            <div className="container">
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '100px 0px 100px'}}>
                    {
                        role==='Administrador'?(
                            <>
                            <Button buttonStyle='btn--outline2' path='/menuServicios' specificStyle={{width: '200px'}}>Menú de Servicios</Button>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button buttonStyle='btn--outline2' path='/menuSalas' specificStyle={{width: '200px'}}>Menú de Salas</Button>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button buttonStyle='btn--outline2' path='/menuUsuarios' specificStyle={{width: '200px'}}>Menú de Usuarios</Button>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button buttonStyle='btn--outline2' path='/menuClases' specificStyle={{width: '200px'}}>Menú de Clases</Button>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button buttonStyle='btn--outline2' path='/verMisClases' specificStyle={{width: '200px'}}>Consultar mis Clases</Button>
                            </>
                        ):(<></>)                  
                    }
                    {
                        (role==='Instructor' || role==='Instructor Temporal')?(
                            <>
                            <Button buttonStyle='btn--outline2' path='/verMisClases' specificStyle={{width: '200px'}}>Consultar mis Clases</Button>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                            {role==='Instructor'?(<Button buttonStyle='btn--outline2' path='/menuPeticion' specificStyle={{width: '200px'}}>Menú Peticiones</Button>):(<></>)}
                            </>
                        ):(<></>)
                    }
                    {
                        role==='Cliente'?(
                            <>
                            <Button buttonStyle='btn--outline2' path='/consultarCalendario' specificStyle={{width: '200px'}}>Consultar el Calendario</Button>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button buttonStyle='btn--outline2' path='/reservarCupoenClase' specificStyle={{width: '200px'}}>Reservar un Cupo en Clases</Button>
                            </>
                        ):(<></>)                  
                    }
                    
                </div>
            </div>
            </>
            )
            }
        </div>
    )
}

export default Menu
