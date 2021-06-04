import React, { useState } from 'react';
import { Button } from '../Button';

function getLocalSession() {
    let userData = localStorage.getItem('token');
    userData = JSON.parse(userData)
    return userData
}

function Menu() {
    const [role, setRole] = useState(() => {
        let userData = getLocalSession();
        if(userData){
            return userData.role
        }else{
            window.location.replace('/login')
        }
    })

    return (
        <div style={{margin: '0px 0px 20px'}}>
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
                        (role==='Instructor' || role==='Instructo rTemporal')?(
                            <>
                            <Button buttonStyle='btn--outline2' path='/verMisClases' specificStyle={{width: '200px'}}>Consultar mis Clases</Button>
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
        </div>
    )
}

export default Menu
