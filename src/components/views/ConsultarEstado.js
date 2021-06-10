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

function MakeClientes(X){
    return (
        <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
            <div className="container" style={{border:'2px solid #5A47AB', margin: '10px 10px 10px', borderRadius: 10}}>
                <div className="form-group" style={{margin: '10px 10px 20px'}}>
                    <h4 style={{display: "flex", justifyContent: "left", color:'white', margin: '10px 0 0px'}}>
                        Nombre Completo
                    </h4>
                    <div className="container" style={{backgroundColor: '#5A47AB', borderRadius: 10, border:'2px solid #5A47AB', margin: '5px 0px 0px'}}>
                        <text style={{textDecorationLine: 'underline', display: "flex", justifyContent: "left", color: 'white'}}>
                            {X.nombreCompleto}
                        </text>
                    </div>
                </div>
            </div>
            <div className="container" style={{border:'2px solid #5A47AB', margin: '10px 10px 10px', borderRadius: 10}}>
                <div className="form-group" style={{margin: '10px 10px 20px'}}>
                    <h4 style={{display: "flex", justifyContent: "left", color:'white', margin: '10px 0 0px'}}>
                        Nombre de Usuario
                    </h4>
                    <div className="container" style={{backgroundColor: '#5A47AB', borderRadius: 10, border:'2px solid #5A47AB', margin: '5px 0px 0px'}}>
                        <text style={{textDecorationLine: 'underline', display: "flex", justifyContent: "left", color: 'white'}}>
                            {X.cuenta.nombreUsuario}
                        </text>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ConsultarEstado() {
    const [salaActual, setSalaActual] = useState({nombre:''})
    const [listaSalas, setListaSalas] = useState([])
    const [estadoActual, setEstadoActual] = useState('Al día')
    const [listaClientes, setListaClientes] = useState([])
    const [usuariosAlDia, setUsuariosAlDia] = useState([])
    const [usuariosMorosos, setUsuariosMorosos] = useState([])
    const [error, setError] = useState('')

    const [charger, setCharger] = useState(() => {
        let userData = getLocalSession();
        if(!userData) window.location.replace('/login')
        if(userData.role !== 'Administrador'){
            window.location.replace('/menuPrincipal')
        }

        axios.get('https://api-dis2021.herokuapp.com/Sala/listaSalas')
        .then(respuesta => {
            if(respuesta.data.length > 0){
                setListaSalas(respuesta.data)
                setSalaActual(respuesta.data[0])

                axios.get('https://api-dis2021.herokuapp.com/Usuario/listaUsuarios')
                .then(respuestaListaUsuarios => {
                    if(respuestaListaUsuarios.data.length > 0){
                        respuestaListaUsuarios.data.sort(function(a,b){
                            if(a.nombreCompleto < b.nombreCompleto) { return -1; }
                            if(a.nombreCompleto > b.nombreCompleto) { return 1; }
                            return 0;
                        })

                        const usuariosClientes = []

                        for( var i = 0; i < respuestaListaUsuarios.data.length; i++){
                            if(respuestaListaUsuarios.data[i].rol === 'Cliente' && respuestaListaUsuarios.data[i].estado) usuariosClientes.push(respuestaListaUsuarios.data[i])
                        }

                        setListaClientes(usuariosClientes)

                        const usuariosDeSala = []

                        for( var i = 0; i < usuariosClientes.length; i++){
                            if(usuariosClientes[i].sala.idSala === respuesta.data[0]._id) usuariosDeSala.push(usuariosClientes[i])
                        }

                        const usuariosAlDíaLocal = []
                        const usuariosMorososLocal = []

                        for(var i = 0; i < usuariosDeSala.length; i++){
                            var moroso = false
                            for(var j = 0; j < usuariosDeSala[i].herencia[1].length; j++){
                                if(usuariosDeSala[i].herencia[1][j].estado === 'Moroso'){
                                    moroso = true
                                }
                            }
                            if(moroso) usuariosMorososLocal.push(usuariosDeSala[i])
                            else usuariosAlDíaLocal.push(usuariosDeSala[i])
                        }

                        setUsuariosAlDia(usuariosAlDíaLocal)
                        setUsuariosMorosos(usuariosMorososLocal)
                    }
                })
            }
        })
    })

    const handleChangeSala = e => {
        for(var k = 0; k < listaSalas.length; k++){
            if(listaSalas[k].nombre === e){
                setSalaActual(listaSalas[k])

                const usuariosDeSala = []

                for( var i = 0; i < listaClientes.length; i++){
                    if(listaClientes[i].sala.idSala === listaSalas[k]._id) usuariosDeSala.push(listaClientes[i])
                }

                const usuariosAlDíaLocal = []
                const usuariosMorososLocal = []

                for(var i = 0; i < usuariosDeSala.length; i++){
                    var moroso = false
                    for(var j = 0; j < usuariosDeSala[i].herencia[1].length; j++){
                        if(usuariosDeSala[i].herencia[1][j].estado === 'Moroso'){
                            moroso = true
                        }
                    }
                    if(moroso) usuariosMorososLocal.push(usuariosDeSala[i])
                    else usuariosAlDíaLocal.push(usuariosDeSala[i])
                }

                setUsuariosAlDia(usuariosAlDíaLocal)
                setUsuariosMorosos(usuariosMorososLocal)
            }
        }
    }
    

    return (
        <div style={{margin: '0px 0px 20px'}}>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0 45px'}}>
                <h1 style={{color:'#5A47AB'}}>
                    Consultar Clientes por Estado
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
                        value={salaActual.nombre}
                        onChange={e => handleChangeSala(e.target.value)}
                        style={{width:"300px"}}>
                            {
                                listaSalas.map(e => MakeOptions(e.nombre))
                            }
                        </select>

                    </div>
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Estado
                        </h2>
                        <select
                        required
                        className="form-control"
                        value={estadoActual}
                        onChange={e => setEstadoActual(e.target.value)}
                        style={{width:"300px"}}>
                            <option>Al día</option>
                            <option>Moroso</option>
                        </select>
                    </div>
                </div> 

                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{display: "flex", justifyContent: "center",color:'#5A47AB', margin: '10px 0 0px'}}>
                            Lista de Clientes
                        </h2>
                        <div className="container" style={{maxHeight: 500, overflow: 'auto', width:"800px", height:"400px", backgroundColor: '#000000', borderRadius: 10}}>
                            {
                                estadoActual==='Al día'?(usuariosAlDia.map(MakeClientes)):(usuariosMorosos.map(MakeClientes))
                            }
                        </div>
                    </div>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '30px 0 20px'}}>
                    <label>{error}</label>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0px 20px'}}>
                        <Button buttonStyle='btn--outline2' path='/menuUsuarios' specificStyle={{width: '260px'}}>Volver al Menú de Usuarios</Button>
                </div>
            </div> 
            
        </div>
    )
}

export default ConsultarEstado
