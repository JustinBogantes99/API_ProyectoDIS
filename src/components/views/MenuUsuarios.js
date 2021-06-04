import React, { useState } from 'react';
import { Button } from '../Button';


function getLocalSession() {
    let userData = localStorage.getItem('token');
    userData = JSON.parse(userData)
    return userData
}


function MenuUsuarios() {
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
                    Menú de Usuarios
                </h1>
            </div>
            <div className="container">
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '100px 0px 30px'}}>
                    <Button buttonStyle='btn--outline2' path='/agregarUsuario' specificStyle={{width: '265px'}}>Agregar Usuario</Button>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button buttonStyle='btn--outline2' path='/editarUsuario' specificStyle={{width: '265px'}}>Editar Usuario</Button>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button buttonStyle='btn--outline2' path='/reservarCupoParaUsuario' specificStyle={{width: '265px'}}>Reservar Cupo para Usuario</Button>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button buttonStyle='btn--outline2' path='/consultarClientesXEstado' specificStyle={{width: '265px'}}>Consultar Estado de Clientes</Button>
                                
                </div>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '30px 0px 100px'}}>
                <Button buttonStyle='btn--outline2' path='/habilitarDesUsuario' specificStyle={{width: '275px'}}>Habilitar/Deshabilitar Usuario</Button>
                </div>
                
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '100px 0px 100px'}}>
                    <Button buttonStyle='btn--outline2' path='/menuPrincipal' specificStyle={{width: '265px'}}>Volver al Menú Principal</Button>             
                </div>
            </div>
        </div>
    )
}

export default MenuUsuarios
