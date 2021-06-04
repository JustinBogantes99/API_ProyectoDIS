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

function AgregarUsuario() {
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [cedula, setCedula] = useState('');
    const [correoElectronico, setCorreoElectronico] = useState('');
    const [telefono, setTelefono] = useState('');
    const [rol, setRol] = useState('Administrador');
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [salaActual, setSalaActual] = useState({nombre:''});
    const [listaSalas, setListaSalas] = useState([{nombre:''}]);
    const [servicioActual, setServicioActual] = useState({nombre:''});
    const [listaServicios, setListaServicios] = useState([]);
    const [servicioExcluir, setServicioExcluir] = useState({nombre:''});
    const [serviciosInstructor, setServiciosInstructor] = useState([]);
    const [error, setError] = useState();

    const [charger, setCharger] = useState(() => {
        let userData = getLocalSession();
        if(!userData) window.location.replace('/login')
        if(userData.role !== 'Administrador'){
            window.location.replace('/menuPrincipal')
        }

        axios.get('http://localhost:5000/Sala/listaSalas')
        .then(respuesta => {
            if(respuesta.data.length > 0){
                setListaSalas(respuesta.data)
                setSalaActual(respuesta.data[0])

                respuesta.data[0].servicios.sort(function(a,b){
                    if(a.nombre < b.nombre) { return -1; }
                    if(a.nombre > b.nombre) { return 1; }
                    return 0;
                })

                setListaServicios(respuesta.data[0].servicios)
                
                if(respuesta.data[0].servicios.length > 0){
                    setServicioActual(respuesta.data[0].servicios[0])
                }
            }
        })
    });

    const handleCambiarSala = e =>{
        for(var i = 0; i < listaSalas.length; i++){
            if(listaSalas[i].nombre === e){
                setSalaActual(listaSalas[i])
            }
        }
    }

    const handleAgregarServicio = () => {
        if(listaServicios.length > 0){
            const listServciosInstructorLocal = serviciosInstructor
            for(var i = 0; i < listaServicios.length; i++){
                if(listaServicios[i] === servicioActual){
                    listServciosInstructorLocal.push(listaServicios[i])
                    listaServicios.splice(i, 1)
                    if(listaServicios.length > 0)setServicioActual(listaServicios[0])
                    else setServicioActual('')
                    i = listaServicios.length
                }
            }
            listServciosInstructorLocal.sort(function(a,b){
                if(a.nombre < b.nombre) { return -1; }
                if(a.nombre > b.nombre) { return 1; }
                return 0;
            })
            setServiciosInstructor(listServciosInstructorLocal)
            setServicioExcluir(listServciosInstructorLocal[0])
        }
    }

    const handleExcluirServicio = () => {
        if(serviciosInstructor.length > 0){
            const listaServiciosLocal = listaServicios
            for (var i = 0; i < serviciosInstructor.length; i++){
                console.log(serviciosInstructor[i])
                console.log(servicioExcluir)
                if(serviciosInstructor[i] === servicioExcluir){
                    listaServiciosLocal.push(serviciosInstructor[i])
                    serviciosInstructor.splice(i, 1)
                    if(serviciosInstructor.length > 0)setServicioExcluir(serviciosInstructor[0])
                    else setServicioExcluir('')
                    i = serviciosInstructor.length
                }
            }
            listaServiciosLocal.sort(function(a,b){
                if(a.nombre < b.nombre) { return -1; }
                if(a.nombre > b.nombre) { return 1; }
                return 0;
            })
            setListaServicios(listaServiciosLocal)
            setServicioActual(listaServiciosLocal[0])
        }
    }

    const cambiarAgregar = e => {
        if(listaServicios.length > 0){
            for(var i = 0; i < listaServicios.length; i++){
                if(listaServicios[i].nombre === e){
                    setServicioActual(listaServicios[i])
                    i = listaServicios.length
                }
            }
        }
    }

    const cambiarExcluir = e => {
        if(serviciosInstructor.length > 0){
            for(var i = 0; i < serviciosInstructor.length; i++){
                if(serviciosInstructor[i].nombre === e){
                    setServicioExcluir(serviciosInstructor[i])
                    i = serviciosInstructor.length
                }
            }
        }
    }

    const handleSubmit = () => {
        if(!nombreCompleto || !cedula || !correoElectronico || !telefono || !rol || !nombreUsuario || !contrasenia){
            setError('Debe de rellenar todos los espacios')
        }else if((rol === 'Instructor' || rol === 'Instructor Temporal' || rol === 'Administrador') && serviciosInstructor.length < 0){
            setError('El usuario debe de tener al menos un servicio que poder impartir')
        }else{
            setError('')

            const cedulaLocal = {
                cedula:cedula
            }

            axios.post('http://localhost:5000/Usuario/encontrarCedula', cedulaLocal)
            .then(respuestaCedula => {
                if(respuestaCedula.data.length === 0){
                    const nombreUsuarioLocal = {
                        nombreUsuario:nombreUsuario
                    }

                    axios.post('http://localhost:5000/Usuario/encontrarNombreUsuario', nombreUsuarioLocal)
                    .then(respuestaNombreUsuario => {
                        if(respuestaNombreUsuario.data.length === 0){

                            const contraseniaLocal = {
                                contrasenia:contrasenia
                            }

                            axios.post('http://localhost:5000/Seguridad/salting', contraseniaLocal)
                            .then(contraseniaSalteada => {
                                
                                var nuevoUsuario;
                                if(rol === 'Administrador'){
                                    nuevoUsuario = {
                                        cedula: cedula,
                                        nombreCompleto:nombreCompleto,
                                        correo:correoElectronico,
                                        telefono:telefono,
                                        rol:rol,
                                        cuenta:{nombreUsuario:nombreUsuario, contrasenia:contraseniaSalteada.data},
                                        sala:{idSala:salaActual._id,nombreSala:salaActual.nombre},
                                        herencia:[serviciosInstructor]
                                    }

                                }else if(rol === 'Instructor' || rol === 'Instructor Temporal'){
                                    nuevoUsuario = {
                                        cedula: cedula,
                                        nombreCompleto:nombreCompleto,
                                        correo:correoElectronico,
                                        telefono:telefono,
                                        rol:rol,
                                        cuenta:{nombreUsuario:nombreUsuario, contrasenia:contraseniaSalteada.data},
                                        sala:{idSala:salaActual._id,nombreSala:salaActual.nombre},
                                        herencia:[serviciosInstructor]
                                    }
                                }else{
                                    nuevoUsuario = {
                                        cedula: cedula,
                                        nombreCompleto:nombreCompleto,
                                        correo:correoElectronico,
                                        telefono:telefono,
                                        rol:rol,
                                        cuenta:{nombreUsuario:nombreUsuario, contrasenia:contraseniaSalteada.data},
                                        sala:{idSala:salaActual._id,nombreSala:salaActual.nombre},
                                        herencia:[0, []]
                                    }
                                }

                                axios.post('http://localhost:5000/Usuario/agregarUsuario', nuevoUsuario)
                                .then(() => {
                                    alert('¡Usuario Agregado!')
                                    window.location.replace('/menuUsuarios')
                                })

                            })
                        }else{
                            setError('Ya existe un usuario con el nombre de usuario ingresado')
                        }
                    })
                }else{
                    setError('Ya existe un usuario con la cédula ingresada')
                }
            })
        }
    }

    return (
        <div style={{margin: '0px 0px 20px'}}>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0 45px'}}>
                <h1 style={{color:'#5A47AB'}}>
                    Agregar Usuario
                </h1>
            </div>

            <div className="container">
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                                Nombre Completo
                            </h2>
                            <input type="text" placeholder='Nombre' name="nombre" required
                            className="form-control" 
                            value={nombreCompleto}
                            onChange={e => setNombreCompleto(e.target.value)}
                            style={{width:"350px"}}>
                        </input>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                                Cédula
                            </h2>
                            <input type="text" placeholder='Cédula' name="cedula" required
                            className="form-control" 
                            value={cedula}
                            onChange={e => setCedula(e.target.value)}
                            style={{width:"350px"}}>
                        </input>
                    </div>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                                Correo Electrónico
                            </h2>
                            <input type="text" placeholder='Correo Electrónico' name="correoElectronico" required
                            className="form-control" 
                            value={correoElectronico}
                            onChange={e => setCorreoElectronico(e.target.value)}
                            style={{width:"350px"}}>
                        </input>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                                Teléfono
                            </h2>
                            <input type="number" placeholder='Teléfono' name="telefono" required
                            className="form-control" 
                            value={telefono}
                            onChange={e => setTelefono(e.target.value)}
                            style={{width:"350px"}}>
                        </input>
                    </div>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                                Rol en la Organización
                        </h2>
                        <select
                        required
                        className="form-control"
                        value={rol}
                        onChange={e => setRol(e.target.value)}
                        style={{width:"350px"}}>
                            {<>
                                <option>Administrador</option>
                                <option>Instructor</option>
                                <option>Instructor Temporal</option>
                                <option>Cliente</option>
                            </>
                            }
                        </select>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                                Sala a la que pertenece
                        </h2>
                        <select
                        required
                        className="form-control"
                        value={salaActual.nombre}
                        onChange={e => handleCambiarSala(e.target.value)}
                        style={{width:"350px"}}>
                            {
                                listaSalas.map(e => MakeOptions(e.nombre))
                            
                            }
                        </select>
                    </div>
                </div>
                
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Nombre de Usuario
                        </h2>
                        <input type="text" placeholder='Nombre de Usuario' name="nombreUsuario" required
                        className="form-control" 
                        value={nombreUsuario}
                        onChange={e => setNombreUsuario(e.target.value)}
                        style={{width:"350px"}}>
                        </input>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Contraseña
                        </h2>
                        <input type="password" placeholder='Contraseña' name="contrasenia" required
                        className="form-control" 
                        value={contrasenia}
                        onChange={e => setContrasenia(e.target.value)}
                        style={{width:"350px"}}>
                        </input>
                    </div>
                </div>

                {rol === 'Instructor' || rol === 'Instructor Temporal' || rol === 'Administrador'?(
                    <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{color:'#5A47AB', width:'350px'}}>
                            Servicios Disponibles
                        </h2>
                        <select
                            name="partialBenefitList"
                            className="form-control"
                            value={servicioActual.nombre}
                            onChange={e => cambiarAgregar(e.target.value)}
                        >
                            {
                                listaServicios.map(e => MakeOptions(e.nombre))
                            }
                        </select>
                    </div>
                    <div className="form-group" style={{margin: '30px 30px 10px'}}>
                        <div className="row justify-content-center align-items-center" style={{margin: '0px 0px 10px'}}>
                            <Button buttonStyle='btn--outline2' onClick={handleAgregarServicio}>{'→'}</Button>
                        </div>
                        <div className="row justify-content-center align-items-center" style={{margin: '0px 0px 10px'}}>
                            <Button buttonStyle='btn--outline2' onClick={handleExcluirServicio}>{'←'}</Button>
                        </div>
                    </div>
                    <div className="form-group" style={{margin: '10px 10px 10px'}}>
                        <h2 style={{color:'#5A47AB', width:'350px'}}>
                            Capacitado para Impartir
                        </h2>
                        <select
                            name="benefits"
                            className="form-control"
                            value={servicioExcluir.nombre}
                            onChange={e => cambiarExcluir(e.target.value)}
                        >
                            {
                                serviciosInstructor.map(e => MakeOptions(e.nombre))
                            }
                        </select>
                    </div>
                </div>
                ):(<></>)}

                
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '30px 0 20px'}}>
                    <label>{error}</label>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0px 100px'}}>
                        <Button buttonStyle='btn--outline2' path='/menuUsuarios' specificStyle={{width: '260px'}}>Volver al Menú de Usuarios</Button>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button buttonStyle='btn--outline2' onClick={handleSubmit} specificStyle={{width: '260px'}}>Agregar Usuario</Button>
                </div>
            </div>
        </div>
    )
}

export default AgregarUsuario
