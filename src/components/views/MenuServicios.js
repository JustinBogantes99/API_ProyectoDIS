import React, { useState } from 'react';
import { Button } from '../Button';


function getLocalSession() {
    let userData = localStorage.getItem('token');
    userData = JSON.parse(userData)
    return userData
}


function MenuServicios() {
    const [role, setRole] = useState(() => {
        let userData = getLocalSession();
        if(!userData) window.location.replace('/login')
        if(userData.role === 'Administrador'){
            return userData.role
        }else{
            window.location.replace('/menuPrincipal')
        }
    })

    return (
        <div style={{margin: '0px 0px 20px'}}>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0 45px'}}>
                <h1 style={{color:'#5A47AB'}}>
                    Menú de Servicios
                </h1>
            </div>
            <div className="container">
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '100px 0px 100px'}}>
                    <Button buttonStyle='btn--outline2' path='/agregarServicio' specificStyle={{width: '230px'}}>Agregar Servicio</Button>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button buttonStyle='btn--outline2' path='/editarServicio' specificStyle={{width: '230px'}}>Editar Servicio</Button>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button buttonStyle='btn--outline2' path='/eliminarServicio' specificStyle={{width: '230px'}}>Eliminar Servicio</Button>              
                </div>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '100px 0px 100px'}}>
                    <Button buttonStyle='btn--outline2' path='/menuPrincipal' specificStyle={{width: '230px'}}>Volver al Menú Principal</Button>             
                </div>
            </div>
        </div>
    )
}

export default MenuServicios
