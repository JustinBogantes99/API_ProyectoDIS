import React, { useState } from 'react';
import { Button } from '../Button';
import axios from 'axios';

function getLocalSession() {
    let userData = localStorage.getItem('token');
    userData = JSON.parse(userData)
    return userData
}


function MiPerfil() {
    const [nombreCompleto, setNombreCompleto] = useState();
    const [cedula, setCedula] = useState();
    const [telefono, setTelefono] = useState();
    const [correo, setCorreo] = useState();
    const [rol, setRol] = useState();
    const [nombreUsuario, setNombreUsuario] = useState();

    const [charger, setCharger] = useState(() => {
        let userData = getLocalSession();
        if(!userData) window.location.replace('/login')
        
        const usuario = {
            nombreUsuario: userData.username
        }

        axios.post('https://api-dis2021.herokuapp.com/Usuario/encontrarNombreUsuario', usuario)
        .then(respuesta => {
            console.log(respuesta)
            if(respuesta.data.length > 0){
                const localUser = respuesta.data[0]
                setNombreCompleto(localUser.nombreCompleto)
                setCedula(localUser.cedula)
                setTelefono(localUser.telefono)
                setCorreo(localUser.correo)
                setRol(localUser.rol)
                setNombreUsuario(localUser.cuenta.nombreUsuario)
            }
        })

    });


    return (
        <div style={{margin: '0px 0px 20px'}}>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0 45px'}}>
                <h1 style={{color:'#5A47AB'}}>
                    Mi Perfil
                </h1>
            </div>

            <div className="container">
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Nombre Completo
                        </h2>
                        <input type="text" placeholder='Nombre Completo' name="nombreCompleto" required
                        className="form-control" 
                        value={nombreCompleto}
                        style={{width:"400px"}}>
                        </input>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                    <div className="form-group" style={{margin: '10px 10px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Cédula
                        </h2>
                        <input type="text" placeholder='Cédula' name="cedula" required
                        className="form-control" 
                        value={cedula}
                        style={{width:"400px"}}>
                        </input>
                    </div>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Teléfono
                        </h2>
                        <input type="number" placeholder='Teléfono' name="telefono" required
                        className="form-control" 
                        value={telefono}
                        style={{width:"400px"}}>
                        </input>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                    <div className="form-group" style={{margin: '10px 10px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Correo Electrónico
                        </h2>
                        <input type="text" placeholder='Correo Electrónico' name="correo" required
                        className="form-control" 
                        value={correo}
                        style={{width:"400px"}}>
                        </input>
                    </div>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Rol
                        </h2>
                        <input type="text" placeholder='Rol' name="rol" required
                        className="form-control" 
                        value={rol}
                        style={{width:"400px"}}>
                        </input>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                    <div className="form-group" style={{margin: '10px 10px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Nombre Usuario
                        </h2>
                        <input type="text" placeholder='Nombre Usuario' name="nombreUsuario" required
                        className="form-control" 
                        value={nombreUsuario}
                        style={{width:"400px"}}>
                        </input>
                    </div>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0px 100px'}}>
                        <Button buttonStyle='btn--outline2' path='/menuPrincipal' specificStyle={{width: '260px'}}>Volver al Menú Principal</Button>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button buttonStyle='btn--outline2' path='/cambiarContrasenia' specificStyle={{width: '260px'}}>Cambiar Contraseña</Button>
                </div>

            </div>
        </div>
    )
}

export default MiPerfil
