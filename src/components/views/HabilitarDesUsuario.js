import React, { useState } from 'react';
import { Button } from '../Button';
import axios from 'axios';

function getLocalSession() {
    let userData = localStorage.getItem('token');
    userData = JSON.parse(userData)
    return userData
}

function MakeOptions(X){
    return <option>{X}</option>
}


function HabilitarDesUsuario() {
    const [salaActual, setSalaActual] = useState({nombre:''});
    const [listaSalas, setListaSalas] = useState([{nombre:''}]);
    const [listaUsuarios, setListaUsuarios] = useState([])
    const [listaUsuariosParcial, setListaUsuariosParcial] = useState([])
    const [usuarioActual, setUsuarioActual] = useState({nombreCompleto:'',cedula:'', cuenta:{nombreUsuario:''}})
    const [error, setError] = useState('')

    const [charger, setCharger] = useState(() => {
        let userData = getLocalSession();
        if(!userData) window.location.replace('/login')
        if(userData.role !== 'Administrador'){
            window.location.replace('/menuPrincipal')
        }

        axios.get('http://localhost:5000/Sala/listaSalas')
        .then(respuesta => {
            if(respuesta.data.length > 0){
                console.log(respuesta.data)
                setListaSalas(respuesta.data)
                setSalaActual(respuesta.data[0])

                axios.get('http://localhost:5000/Usuario/listaUsuarios')
                .then(respuestaUsuarios => {
                    if(respuestaUsuarios.data.length > 0){
                        setListaUsuarios(respuestaUsuarios.data)
                        const listaParcialLocal = []
                        for(var i = 0; i < respuestaUsuarios.data.length; i++){
                            if(respuesta.data[0]._id === respuestaUsuarios.data[i].sala.idSala || respuesta.data[0].nombre === respuestaUsuarios.data[i].sala.nombreSala){
                                listaParcialLocal.push(respuestaUsuarios.data[i])
                            }
                        }
                        if(listaParcialLocal.length > 0)setUsuarioActual(listaParcialLocal[0])
                        setListaUsuariosParcial(listaParcialLocal)
                    }
                })
            }
        })
    });

    const handleCambiarSala = e =>{
        for(var i = 0; i < listaSalas.length; i++){
            if(listaSalas[i].nombre === e){
                setSalaActual(listaSalas[i])
                const listaParcialLocal = []
                for(var j = 0; j < listaUsuarios.length; j++){
                    if(listaSalas[i]._id === listaUsuarios[j].sala.idSala || listaSalas[i].nombre === listaUsuarios[j].sala.nombreSala){
                        listaParcialLocal.push(listaUsuarios[j])
                    }
                }
                if(listaParcialLocal.length > 0)setUsuarioActual(listaParcialLocal[0])
                else {
                    setUsuarioActual({nombreCompleto:'',cedula:'', cuenta:{nombreUsuario:''}})
                }
                setListaUsuariosParcial(listaParcialLocal)
            }
        }
    }

    const handleCambioUsuario = e => {
        for(var i = 0; i < listaUsuariosParcial.length; i++){
            if(listaUsuariosParcial[i].nombreCompleto === e && listaUsuariosParcial[i].cedula !== usuarioActual.cedula){
                setUsuarioActual(listaUsuariosParcial[i])
            }
        }
    }

    const handleSubmit = () =>{
        if(!salaActual || listaSalas.length === 0 || listaUsuarios.length === 0 || listaUsuariosParcial.length ===0 || !usuarioActual){
            setError('Alguno de los campos está vacío, recurde que deben de haber salas y usuarios para desactivar')
        }else{
            const editandoUsuario = {
                cedula: usuarioActual.cedula,
                nombreCompleto: usuarioActual.nombreCompleto,
                correo: usuarioActual.correo,
                telefono: usuarioActual.telefono,
                rol: usuarioActual.rol,
                cuenta: usuarioActual.cuenta,
                sala: usuarioActual.sala,
                estado: !usuarioActual.estado,
                herencia: usuarioActual.herencia
            }
            axios.post('http://localhost:5000/Usuario/editarUsuario', editandoUsuario)
            .then(() => {
                alert('¡Usuario '+(!usuarioActual.estado?('Activado!'):('Desactivado!')))
                window.location.replace('/menuUsuarios')
            })
        }
        
    }

    return (
        <div style={{margin: '0px 0px 20px'}}>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0 45px'}}>
                <h1 style={{color:'#5A47AB'}}>
                    Habilitar/Deshabilitar Usuario
                </h1>
            </div>
            <div className="container">
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                    <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                                Sala a la que pertenece
                        </h2>
                        <select
                        required
                        className="form-control"
                        value={salaActual.nombre}
                        onChange={e => handleCambiarSala(e.target.value)}
                        style={{width:"400px"}}>
                            {
                                listaSalas.map(e => MakeOptions(e.nombre))
                            
                            }
                        </select>
                    </div>
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Nombre Completo
                        </h2>
                        <select
                        required
                        className="form-control"
                        value={usuarioActual.nombreCompleto}
                        onChange={e => handleCambioUsuario(e.target.value)}
                        style={{width:"400px"}}>
                            {
                                listaUsuariosParcial.map(e => MakeOptions(e.nombreCompleto))
                            }
                        </select>
                    </div>
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Nombre de Usuario
                        </h2>
                        <input type="text" placeholder='Nombre de Usuario' name="nombreUsuario" required
                        className="form-control" 
                        value={usuarioActual.cuenta.nombreUsuario}
                        style={{width:"400px"}}>
                        </input>
                    </div>
                    
                </div> 

                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Estado Actual
                        </h2>
                        <input type="text" placeholder='Estado Actual' name="estadoActual" required
                        className="form-control" 
                        value={usuarioActual.estado?('Activo'):('Desactivado')}
                        style={{width:"400px"}}>
                        </input>
                    </div>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '30px 0 20px'}}>
                    <label>{error}</label>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0px 100px'}}>
                        <Button buttonStyle='btn--outline2' path='/menuUsuarios' specificStyle={{width: '260px'}}>Volver al Menú de Usuarios</Button>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button buttonStyle='btn--outline2' onClick={handleSubmit} specificStyle={{width: '260px'}}>Cambiar Estado de Usuario</Button>
                </div>
            </div>   
        </div>
    )
}

export default HabilitarDesUsuario
