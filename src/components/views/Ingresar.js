import React, { useState } from 'react';
import { Button } from '../Button';
import { Link } from 'react-router-dom';
import axios from 'axios';

function setToken(userToken) {
    localStorage.setItem('token', JSON.stringify(userToken));
}

function getToken () {
    let data = localStorage.getItem('token');
    console.log(data)
}

function Ingresar() {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();


    const handleSubmit = async e => {
        if(!username || !password){
            setError('Todos los campos deben ser rellenados')
        }else{
            const nombreUsuarioLocal = {
                nombreUsuario: username
            }

            axios.post('http://localhost:5000/Usuario/encontrarNombreUsuario', nombreUsuarioLocal)
            .then(respuestaNombreUsuario =>{
                if(respuestaNombreUsuario.data.length === 0){
                    setError('El usuario ingresado no existe')
                }else{
                    const posibleUsuario ={
                        contraseniaInsertada: password,
                        contraseniaReal: respuestaNombreUsuario.data[0].cuenta.contrasenia
                    }
                    axios.post('http://localhost:5000/Seguridad/checking/', posibleUsuario)
                    .then(answer => {
                        console.log(posibleUsuario)
                        if(answer.data){
                            const token = {
                                username,
                                idSala:respuestaNombreUsuario.data[0].sala.idSala,
                                role: respuestaNombreUsuario.data[0].rol
                            };
                            setToken(token);
                            window.location.replace('/menuPrincipal')
                        }else{
                            setError('La combinación entre Nombre de Usuario y Contraseña no coincide')
                        }
                    })
                }
            })
        }
    }

    return (
        <div style={{margin: '0px 0px 20px'}}>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0 45px'}}>
                <h1 style={{color:'#5A47AB'}}>
                    Ingresar
                </h1>
            </div>
            <div className="container" style={{width: '500px', border:'2px solid #5A47AB'}}>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 10px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Nombre de Usuario
                        </h2>
                        <input type="text" placeholder='Nombre de Usuario' name="username" required
                        className="form-control" 
                        onChange={e => setUserName(e.target.value)}
                        style={{width:"400px"}}>
                        </input>
                    </div>
                </div> 
                
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 10px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                                Contraseña
                        </h2>
                        <input type="password" placeholder='Contraseña' name="password" required
                        className="form-control"
                        onChange={e => setPassword(e.target.value)}
                        style={{width:"400px"}}>
                        </input>
                    </div>    
                </div> 

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '30px 0 20px'}}>
                    <label>{error}</label>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <Button buttonStyle='btn--outline2' onClick={handleSubmit}>Ingresar</Button>
                    </div>    
                </div> 
            </div>
            
        </div>
    )
}

export default Ingresar
