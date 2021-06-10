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


function EditarUsuario() {
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [cedula, setCedula] = useState('');
    const [correoElectronico, setCorreoElectronico] = useState('');
    const [telefono, setTelefono] = useState('');
    const [rol, setRol] = useState('Administrador');
    const [salaPertenece, setSalaPertenece] = useState({nombre:''});

    const [salaActual, setSalaActual] = useState({nombre:''});
    const [listaSalas, setListaSalas] = useState([{nombre:''}]);
    const [servicioActual, setServicioActual] = useState({nombre:''});
    const [listaServicios, setListaServicios] = useState([]);
    const [listaServiciosEntera, setListaServiciosEntera] = useState([]);
    const [servicioExcluir, setServicioExcluir] = useState({nombre:''});
    const [serviciosInstructor, setServiciosInstructor] = useState([]);
    const [serviciosAdministrador, setServiciosAdministrador] = useState([]);
    const [listaUsuariosEntera, setListaUsuariosEntera] = useState([]);
    const [listaUsuarios, setListaUsuarios] = useState([]);
    const [usuarioActual, setUsuarioActual] = useState({nombreCompleto:'', cuenta:{nombreUsuario:''}});

    const [error, setError] = useState();

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

                respuesta.data[0].servicios.sort(function(a,b){
                    if(a.nombre < b.nombre) { return -1; }
                    if(a.nombre > b.nombre) { return 1; }
                    return 0;
                })

                setListaServiciosEntera(respuesta.data[0].servicios)

                axios.get('https://api-dis2021.herokuapp.com/Usuario/listaUsuarios')
                .then(respuestaListaUsuarios => {

                    respuestaListaUsuarios.data.sort(function(a,b){
                        if(a.nombreCompleto < b.nombreCompleto) { return -1; }
                        if(a.nombreCompleto > b.nombreCompleto) { return 1; }
                        return 0;
                    })


                    setListaUsuariosEntera(respuestaListaUsuarios.data)
                    if(respuestaListaUsuarios.data.length > 0){
                        const listaParcialUsuarios = []
                        for(var i = 0; i < respuestaListaUsuarios.data.length; i++){
                            if(respuestaListaUsuarios.data[i].sala.idSala === respuesta.data[0]._id || respuesta.data[0].rol === 'Administrador'){
                                if(respuestaListaUsuarios.data[i].estado)listaParcialUsuarios.push(respuestaListaUsuarios.data[i])
                            }
                        }

                        listaParcialUsuarios.sort(function(a,b){
                            if(a.nombreCompleto < b.nombreCompleto) { return -1; }
                            if(a.nombreCompleto > b.nombreCompleto) { return 1; }
                            return 0;
                        })

                        setListaUsuarios(listaParcialUsuarios)
                        if(listaParcialUsuarios.length > 0){
                            
                            setUsuarioActual(listaParcialUsuarios[0])
                            setNombreCompleto(listaParcialUsuarios[0].nombreCompleto)
                            setCedula(listaParcialUsuarios[0].cedula)
                            setCorreoElectronico(listaParcialUsuarios[0].correo)
                            setTelefono(listaParcialUsuarios[0].telefono)
                            setRol(listaParcialUsuarios[0].rol)
                            setSalaPertenece(listaParcialUsuarios[0].sala)


                            if(listaParcialUsuarios[0].rol === 'Instructor' || listaParcialUsuarios[0].rol === 'Instructor Temporal' || listaParcialUsuarios[0].rol === 'Administrador'){
                                const listaServiciosInstructor = []
                                for(var i = 0; i < respuesta.data[0].servicios.length; i++){
                                    for(var j = 0; j < listaParcialUsuarios[0].herencia[0].length; j++){
                                        if(respuesta.data[0].servicios[i]._id === listaParcialUsuarios[0].herencia[0][j]._id){
                                            listaServiciosInstructor.push(respuesta.data[0].servicios[i])
                                        }
                                    }
                                }
                                setServiciosInstructor(listaServiciosInstructor)
                                if(listaServiciosInstructor.length > 0)setServicioExcluir(listaServiciosInstructor[0])


                                const listaServiciosParcial = []
                                for(var i= 0; i < respuesta.data[0].servicios.length; i++){
                                    var included = false
                                    for(var j = 0; j < listaServiciosInstructor.length; j++){
                                        if(respuesta.data[0].servicios[i]._id === listaServiciosInstructor[j]._id){
                                            included = true
                                        }
                                        if(j === (listaServiciosInstructor.length-1) && !included){
                                            listaServiciosParcial.push(respuesta.data[0].servicios[i])
                                        }
                                    }
                                }

                                setListaServicios(listaServiciosParcial)
                                if(listaServiciosParcial.length > 0) setServicioActual(listaServiciosParcial[0])

                                if(listaParcialUsuarios[0].rol === 'Administrador'){

                                    const listaServiciosAdministradorLocal = []

                                    for(var i= 0; i < listaParcialUsuarios[0].herencia[0].length; i++){
                                        var included = false
                                        for(var j = 0; j < respuesta.data[0].servicios.length; j++){
                                            if(respuesta.data[0].servicios[j]._id === listaParcialUsuarios[0].herencia[0][i]._id){
                                                included = true
                                            }
                                            if(j === (respuesta.data[0].servicios.length-1) && !included){
                                                listaServiciosAdministradorLocal.push(listaParcialUsuarios[0].herencia[0][i])
                                            }
                                        }
                                    }

                                    setServiciosAdministrador(listaServiciosAdministradorLocal)
                                }
                            }else{
                                setListaServicios(respuesta.data[0].servicios)
                                if(respuesta.data[0].servicios.length > 0) setServicioActual(respuesta.data[0].servicios[0])
                            }
                        }
                    }
                })
            }
        })
    });

    const handleCambiarSala = e => {
        for(var i = 0; i < listaSalas.length; i++){
            if(listaSalas[i].nombre === e){
                setSalaActual(listaSalas[i])

                const listaUsuariosParcialLocal = []
                for(var k = 0; k < listaUsuariosEntera.length; k++){
                    if(listaUsuariosEntera[k].sala.idSala === listaSalas[i]._id && listaUsuariosEntera[k].estado)listaUsuariosParcialLocal.push(listaUsuariosEntera[k])
                }
                
                setListaUsuarios(listaUsuariosParcialLocal)
                if(listaUsuariosParcialLocal.length > 0){
                    setUsuarioActual(listaUsuariosParcialLocal[0])
                    setNombreCompleto(listaUsuariosParcialLocal[0].nombreCompleto)
                    setCedula(listaUsuariosParcialLocal[0].cedula)
                    setCorreoElectronico(listaUsuariosParcialLocal[0].correo)
                    setTelefono(listaUsuariosParcialLocal[0].telefono)
                    setRol(listaUsuariosParcialLocal[0].rol)
                    setSalaPertenece(listaUsuariosParcialLocal[0].sala)

                    listaSalas[i].servicios.sort(function(a,b){
                        if(a.nombre < b.nombre) { return -1; }
                        if(a.nombre > b.nombre) { return 1; }
                        return 0;
                    })

                    setListaServiciosEntera(listaSalas[i].servicios)

                    if(listaUsuariosParcialLocal[0].rol === 'Instructor' || listaUsuariosParcialLocal[0].rol === 'Instructor Temporal' || listaUsuariosParcialLocal[0].rol === 'Administrador'){

                        const listaServiciosInstructor = []
                        for(var k = 0; k < listaSalas[i].servicios.length; k++){
                            for(var j = 0; j < listaUsuariosParcialLocal[0].herencia[0].length; j++){
                                if(listaSalas[i].servicios[k]._id === listaUsuariosParcialLocal[0].herencia[0][j]._id){
                                    listaServiciosInstructor.push(listaSalas[i].servicios[k])
                                }
                            }
                        }
                        setServiciosInstructor(listaServiciosInstructor)
                        if(listaServiciosInstructor.length > 0)setServicioExcluir(listaServiciosInstructor[0])
                        else setServicioExcluir({nombre:''})

                        const listaServiciosParcial = []
                        for(var k = 0; k < listaSalas[i].servicios.length; k++){
                            var included = false
                            for(var j = 0; j < listaServiciosInstructor.length; j++){
                                if(listaSalas[i].servicios[k]._id === listaServiciosInstructor[j]._id){
                                    included = true
                                }
                                if(j === (listaServiciosInstructor.length-1) && !included){
                                    listaServiciosParcial.push(listaSalas[i].servicios[k])
                                }
                            }
                        }

                        setListaServicios(listaServiciosParcial)
                        if(listaServiciosParcial.length > 0) setServicioActual(listaServiciosParcial[0])

                        if(listaUsuariosParcialLocal[0].rol === 'Administrador'){

                            const listaServiciosAdministradorLocal = []

                            for(var k = 0; k < listaUsuariosParcialLocal[0].herencia[0].length; k++){
                                var included = false
                                for(var j = 0; j < listaSalas[i].servicios.length; j++){
                                    if(listaSalas[i].servicios[j]._id === listaUsuariosParcialLocal[0].herencia[0][k]._id){
                                        included = true
                                    }
                                    if(j === (listaSalas[i].servicios.length-1) && !included){
                                        listaServiciosAdministradorLocal.push(listaUsuariosParcialLocal[0].herencia[0][k])
                                    }
                                }
                            }

                            setServiciosAdministrador(listaServiciosAdministradorLocal)
                        }
                    }else{
                        const listalocal = []
                        for(var k = 0; k < listaSalas[i].servicios.length; k++){
                            listalocal.push(listaSalas[i].servicios[k])
                        }
                        setListaServicios(listalocal)
                        if(listalocal.length > 0) setServicioActual(listalocal[0])
                        setServiciosInstructor([])
                        setServicioExcluir({nombre:''})
                        setServiciosAdministrador([])
                    }



                }else{
                    setUsuarioActual({nombreCompleto:'', cuenta:{nombreUsuario:''}})
                    setNombreCompleto('')
                    setCedula('')
                    setCorreoElectronico('')
                    setTelefono(0)
                    setRol('')
                }
            }
        }
    }

    const handleCambiarCliente = e => {
        console.log(listaServiciosEntera)
        for(var i = 0; i < listaUsuarios.length; i++){
            if(listaUsuarios[i].nombreCompleto === e && listaUsuarios[i].cedula !== usuarioActual.cedula){
                setUsuarioActual(listaUsuarios[i])
                setNombreCompleto(listaUsuarios[i].nombreCompleto)
                setCedula(listaUsuarios[i].cedula)
                setCorreoElectronico(listaUsuarios[i].correo)
                setTelefono(listaUsuarios[i].telefono)
                setRol(listaUsuarios[i].rol)

                if(listaUsuarios[i].rol === 'Instructor' || listaUsuarios[i].rol === 'Instructor Temporal' || listaUsuarios[i].rol === 'Administrador'){
                    const listaServiciosInstructor = []
                    for(var k = 0; k < salaActual.servicios.length; k++){
                        for(var j = 0; j < listaUsuarios[i].herencia[0].length; j++){
                            if(salaActual.servicios[k]._id === listaUsuarios[i].herencia[0][j]._id){
                                console.log(salaActual.servicios[k])
                                listaServiciosInstructor.push(salaActual.servicios[k])
                            }
                        }
                    }
                    console.log(listaServiciosInstructor)
                    setServiciosInstructor(listaServiciosInstructor)
                    if(listaServiciosInstructor.length > 0)setServicioExcluir(listaServiciosInstructor[0])
                    else setServicioExcluir({nombre:''})

                    const listaServiciosParcial = []
                    for(var k = 0; k < salaActual.servicios.length; k++){
                        var included = false
                        for(var j = 0; j < listaServiciosInstructor.length; j++){
                            if(salaActual.servicios[k]._id === listaServiciosInstructor[j]._id){
                                included = true
                            }
                            if(j === (listaServiciosInstructor.length-1) && !included){
                                listaServiciosParcial.push(salaActual.servicios[k])
                            }
                        }
                    }

                    setListaServicios(listaServiciosParcial)
                    if(listaServiciosParcial.length > 0) setServicioActual(listaServiciosParcial[0])

                    if(listaUsuarios[i].rol === 'Administrador'){

                        const listaServiciosAdministradorLocal = []

                        for(var k = 0; k < listaUsuarios[i].herencia[0].length; k++){
                            var included = false
                            for(var j = 0; j < salaActual.servicios.length; j++){
                                if(salaActual.servicios[j]._id === listaUsuarios[i].herencia[0][k]._id){
                                    included = true
                                }
                                if(j === (salaActual.servicios.length-1) && !included){
                                    listaServiciosAdministradorLocal.push(listaUsuarios[i].herencia[0][k])
                                }
                            }
                        }

                        setServiciosAdministrador(listaServiciosAdministradorLocal)
                    }

                }else{
                    const listalocal = []
                    for(var k = 0; k < listaServiciosEntera.length; k++){
                        listalocal.push(listaServiciosEntera[k])
                    }
                    setListaServicios(listalocal)
                    if(listalocal.length > 0) setServicioActual(listalocal[0])
                    setServiciosInstructor([])
                    setServicioExcluir({nombre:''})
                    setServiciosAdministrador([])
                }
            }
        }
    }

    const handleCambiarSalaPertenece = e =>{
        for(var i = 0; i < listaSalas.length; i++){
            if(listaSalas[i].nombre === e){
                setSalaPertenece(listaSalas[i])
                setListaServiciosEntera(listaSalas[i].servicios)

                if(usuarioActual.rol === 'Instructor' || usuarioActual.rol === 'Instructor Temporal' || usuarioActual.rol === 'Administrador'){

                    const listaServiciosInstructor = []
                    for(var k = 0; k < listaSalas[i].servicios.length; k++){
                        for(var j = 0; j < usuarioActual.herencia[0].length; j++){
                            if(listaSalas[i].servicios[k]._id === usuarioActual.herencia[0][j]._id){
                                listaServiciosInstructor.push(listaSalas[i].servicios[k])
                            }
                        }
                    }
                    setServiciosInstructor(listaServiciosInstructor)
                    if(listaServiciosInstructor.length > 0)setServicioExcluir(listaServiciosInstructor[0])
                    else setServicioExcluir({nombre:''})

                    const listaServiciosParcial = []
                    for(var k = 0; k < listaSalas[i].servicios.length; k++){
                        var included = false
                        for(var j = 0; j < listaServiciosInstructor.length; j++){
                            if(listaSalas[i].servicios[k]._id === listaServiciosInstructor[j]._id){
                                included = true
                            }
                            if(j === (listaServiciosInstructor.length-1) && !included){
                                listaServiciosParcial.push(listaSalas[i].servicios[k])
                            }
                        }
                    }

                    setListaServicios(listaServiciosParcial)
                    if(listaServiciosParcial.length > 0) setServicioActual(listaServiciosParcial[0])

                    if(usuarioActual.rol === 'Administrador'){

                        const listaServiciosAdministradorLocal = []

                        for(var k = 0; k < usuarioActual.herencia[0].length; k++){
                            var included = false
                            for(var j = 0; j < listaSalas[i].servicios.length; j++){
                                if(listaSalas[i].servicios[j]._id === usuarioActual.herencia[0][k]._id){
                                    included = true
                                }
                                if(j === (listaSalas[i].servicios.length-1) && !included){
                                    listaServiciosAdministradorLocal.push(usuarioActual.herencia[0][k])
                                }
                            }
                        }

                        setServiciosAdministrador(listaServiciosAdministradorLocal)
                    }
                }else{
                    const listalocal = []
                    for(var k = 0; k < listaSalas[i].servicios.length; k++){
                        listalocal.push(listaSalas[i].servicios[k])
                    }
                    setListaServicios(listalocal)
                    if(listalocal.length > 0) setServicioActual(listalocal[0])
                    setServiciosInstructor([])
                    setServicioExcluir({nombre:''})
                    setServiciosAdministrador([])
                }
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
        if(!nombreCompleto || !cedula || !correoElectronico || !telefono || !rol || !salaPertenece || !usuarioActual || !salaActual || listaSalas.length === 0){
            setError('Alguno de los campos obligatorios está vacío')
        }else if((rol === 'Instructor' || rol === 'Instructor Temporal' || rol === 'Administrador') && serviciosInstructor.length < 0){
            setError('El usuario debe de tener al menos un servicio que poder impartir')
        }else if(usuarioActual.rol === 'Cliente' && rol !== 'Cliente'){
            setError('Un usuario cliente no puede volverse un instructor o administrador')
        }else{
            setError('')

            var editandoUsuario;
            if(rol === 'Administrador'){
                const listaServiciosAdminLocal = serviciosInstructor
                for(var i = 0; i < serviciosAdministrador.length; i++) listaServiciosAdminLocal.push(serviciosAdministrador[i])

                editandoUsuario = {
                    cedula: cedula,
                    nombreCompleto:nombreCompleto,
                    correo:correoElectronico,
                    telefono:telefono,
                    rol:rol,
                    cuenta:{nombreUsuario:usuarioActual.cuenta.nombreUsuario, contrasenia:usuarioActual.cuenta.contrasenia},
                    sala:{idSala:salaPertenece.idSala, nombreSala:salaPertenece.nombreSala},
                    herencia:[listaServiciosAdminLocal]
                }

            }else if(rol === 'Instructor' || rol === 'Instructor Temporal'){
                editandoUsuario = {
                    cedula: cedula,
                    nombreCompleto:nombreCompleto,
                    correo:correoElectronico,
                    telefono:telefono,
                    rol:rol,
                    cuenta:{nombreUsuario:usuarioActual.cuenta.nombreUsuario, contrasenia:usuarioActual.cuenta.contrasenia},
                    sala:{idSala:salaPertenece.idSala, nombreSala:salaPertenece.nombreSala},
                    herencia:[serviciosInstructor]
                }
            }else{
                editandoUsuario = {
                    cedula: cedula,
                    nombreCompleto:nombreCompleto,
                    correo:correoElectronico,
                    telefono:telefono,
                    rol:rol,
                    cuenta:{nombreUsuario:usuarioActual.cuenta.nombreUsuario, contrasenia:usuarioActual.cuenta.contrasenia},
                    sala:{idSala:salaPertenece.idSala, nombreSala:salaPertenece.nombreSala},
                    herencia:usuarioActual.herencia
                }
            }

            axios.post('https://api-dis2021.herokuapp.com/Usuario/editarUsuario', editandoUsuario)
            .then(() => {
                alert('Usuario editado!')
                window.location.replace('/menuUsuarios')
            })
            
        }
    }

    return (
        <div style={{margin: '0px 0px 20px'}}>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0 45px'}}>
                <h1 style={{color:'#5A47AB'}}>
                    Editar Usuario
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
                        onChange={e => handleCambiarSala(e.target.value)}
                        style={{width:"350px"}}>
                            {
                                listaSalas.map(e => MakeOptions(e.nombre))
                            }
                        </select>

                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Usuario
                        </h2>
                        <select
                        required
                        className="form-control"
                        value={usuarioActual.nombreCompleto}
                        onChange={e => handleCambiarCliente(e.target.value)}
                        style={{width:"350px"}}>
                            {
                                listaUsuarios.map(e => MakeOptions(e.nombreCompleto))
                            }
                        </select>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 

                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Nombre de Usuario
                        </h2>
                        <input type="text" placeholder='Nombre de Usuario' name="nombreUsuario" required
                        className="form-control" 
                        value={usuarioActual.cuenta.nombreUsuario}
                        style={{width:"350px"}}>
                        </input>
                    </div>
                </div>

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
                        value={salaPertenece.nombre}
                        onChange={e => handleCambiarSalaPertenece(e.target.value)}
                        style={{width:"350px"}}>
                            {
                                listaSalas.map(e => MakeOptions(e.nombre))
                            
                            }
                        </select>
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
                        <Button buttonStyle='btn--outline2' onClick={handleSubmit} specificStyle={{width: '260px'}}>Editar Usuario</Button>
                </div>
            </div>
        </div>
    )
}

export default EditarUsuario
