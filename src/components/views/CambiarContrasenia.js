import React, { useState } from 'react';
import { Button } from '../Button';
import axios from 'axios';

function getLocalSession() {
    let userData = localStorage.getItem('token');
    userData = JSON.parse(userData)
    return userData
}


function CambiarContrasenia() {
    const [contrasenia, setContrasenia] = useState()
    const [nuevaContrasenia, setNuevaContrasenia] = useState([])
    const [confirmarContrasenia, setConfirmarContrasenia] = useState()
    const [error, setError] = useState('')

    const [charger, setCharger] = useState(() => {
        let userData = localStorage.getItem('token');
        if(!userData) window.location.replace('/login')
    })

    const handleSubmit = () =>{
        if(!contrasenia || !nuevaContrasenia || !confirmarContrasenia){
            setError('Debe rellenar todos los campos')
        }else if(nuevaContrasenia !== confirmarContrasenia){
            setError('La nueva contraseña y la confirmación no coinciden')
        }else{
            setError('')

            //backend para cambiar contraseña
            let userData = getLocalSession();
            
            const usuario = {
                nombreUsuario: userData.username
            }

            axios.post('https://api-dis2021.herokuapp.com/Usuario/encontrarNombreUsuario', usuario)
            .then(usuario => {
                if(usuario.data.length > 0){
                    const comprobarContrasenia = {
                        contrasenia:nuevaContrasenia,
                        contraseniaInsertada: contrasenia,
                        contraseniaReal: usuario.data[0].cuenta.contrasenia
                    }

                    axios.post('https://api-dis2021.herokuapp.com/Seguridad/checking', comprobarContrasenia)
                    .then(respuestaContrasenia => {
                        if(respuestaContrasenia){
                            axios.post('https://api-dis2021.herokuapp.com/Seguridad/salting', comprobarContrasenia)
                            .then(respuestaContraseniaSalteada => {
                                const editandoUsuario = {
                                    cedula: usuario.data[0].cedula,
                                    nombreCompleto: usuario.data[0].nombreCompleto,
                                    correo: usuario.data[0].correo,
                                    telefono: usuario.data[0].telefono,
                                    rol: usuario.data[0].rol,
                                    cuenta: {nombreUsuario:usuario.data[0].cuenta.nombreUsuario, contrasenia:respuestaContraseniaSalteada.data},
                                    sala: usuario.data[0].sala,
                                    estado: usuario.data[0].estado,
                                    notificaciones: usuario.data[0].notificaciones,
                                    herencia: usuario.data[0].herencia,
                                }
                                axios.post('https://api-dis2021.herokuapp.com/Usuario/editarUsuario', editandoUsuario)
                                .then(() => {
                                    alert('¡Contraseña editada!')
                                    window.location.replace('/miPerfil')
                                })
                            })
                        }else{
                            setError('La contraseña ingresada no es la correcta')
                        }
                    })
                }else{
                    setError('El usuario actual no se ha encontrado')
                }
            })
        }
    }

    return (
        <div style={{margin: '0px 0px 20px'}}>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0 45px'}}>
                <h1 style={{color:'#5A47AB'}}>
                    Cambiar Contraseña
                </h1>
            </div>

            <div className="container">
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="container" style={{maxHeight: 500, overflow: 'auto', width:"800px", height:"400px", backgroundColor: '#000000', borderRadius: 10}}>
                        <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <div className="container" style={{border:'2px solid #5A47AB', margin: '10px 10px 10px', borderRadius: 10}}>
                                <div className="form-group" style={{margin: '10px 10px 20px'}}>
                                    <h4 style={{display: "flex", justifyContent: "left", color:'white', margin: '10px 0 0px'}}>
                                        Contraseña
                                    </h4>
                                    <div className="container" style={{backgroundColor: '#5A47AB', borderRadius: 10, border:'2px solid #5A47AB', margin: '5px 0px 0px'}}>
                                        <input type="password" placeholder='Contraseña' name="contrasenia" required
                                        className="form-control" 
                                        value={contrasenia}
                                        onChange={e => setContrasenia(e.target.value)}
                                        style={{backgroundColor: '#5A47AB', color:'#ffffff'}}>
                                        </input>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <div className="container" style={{border:'2px solid #5A47AB', margin: '10px 10px 10px', borderRadius: 10}}>
                                <div className="form-group" style={{margin: '10px 10px 20px'}}>
                                    <h4 style={{display: "flex", justifyContent: "left", color:'white', margin: '10px 0 0px'}}>
                                        Nueva Contraseña
                                    </h4>
                                    <div className="container" style={{backgroundColor: '#5A47AB', borderRadius: 10, border:'2px solid #5A47AB', margin: '5px 0px 0px'}}>
                                        <input type="password" placeholder='Nueva Contraseña' name="nuevaContrasenia" required
                                        className="form-control" 
                                        value={nuevaContrasenia}
                                        onChange={e => setNuevaContrasenia(e.target.value)}
                                        style={{backgroundColor: '#5A47AB', color:'#ffffff'}}>
                                        </input>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <div className="container" style={{border:'2px solid #5A47AB', margin: '10px 10px 10px', borderRadius: 10}}>
                                <div className="form-group" style={{margin: '10px 10px 20px'}}>
                                    <h4 style={{display: "flex", justifyContent: "left", color:'white', margin: '10px 0 0px'}}>
                                        Confirmar la Nueva Contraseña
                                    </h4>
                                    <div className="container" style={{backgroundColor: '#5A47AB', borderRadius: 10, border:'2px solid #5A47AB', margin: '5px 0px 0px'}}>
                                        <input type="password" placeholder='Confirmar la Nueva Contraseña' name="confirmarContrasenia" required
                                        className="form-control" 
                                        value={confirmarContrasenia}
                                        onChange={e => setConfirmarContrasenia(e.target.value)}
                                        style={{backgroundColor: '#5A47AB', color:'#ffffff'}}>
                                        </input>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '30px 0 20px'}}>
                    <label>{error}</label>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0px 100px'}}>
                        <Button buttonStyle='btn--outline2' path='/miPerfil' specificStyle={{width: '260px'}}>Volver a Mi Perfil</Button>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button buttonStyle='btn--outline2' onClick={handleSubmit} specificStyle={{width: '260px'}}>Aceptar cambio</Button>
                </div>
            </div>
            
        </div>
    )
}

export default CambiarContrasenia
