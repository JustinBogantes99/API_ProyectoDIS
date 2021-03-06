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

function EditarServicio() {
    const [servicio, setServicio] = useState('');
    const [precioServicio, setPrecioServicio] = useState(0);
    const [capacidadMaxima, setCapacidadMaxima] = useState(0);
    const [salaActual, setSalaActual] = useState({nombre:''});
    const [listaSalas, setListaSalas] = useState([{nombre:''}]);
    const [error, setError] = useState();

    const [servicioActual, setServicioActual] = useState({nombre:''});
    const [listaServicios, setListaServicios] = useState([{nombre:''}]);

    const [charger, setCharger] = useState(() => {
        let userData = getLocalSession();
        if(!userData) window.location.replace('/login')
        if(userData.role !== 'Administrador'){
            window.location.replace('/menuPrincipal')
        }

        axios.get('https://api-dis2021.herokuapp.com/Sala/listaSalas')
        .then(respuesta => {
            if(respuesta.data.length > 0){
                console.log(respuesta.data)
                setListaSalas(respuesta.data)
                setSalaActual(respuesta.data[0])

                setListaServicios(respuesta.data[0].servicios)
                if(respuesta.data[0].servicios.length > 0){
                    setServicioActual(respuesta.data[0].servicios[0])
                    setServicio(respuesta.data[0].servicios[0].nombre)
                    setPrecioServicio(respuesta.data[0].servicios[0].precio)
                    setCapacidadMaxima(respuesta.data[0].servicios[0].maximoPersonas)
                }

            }
        })
    });

    const handleCambiarSala = e =>{
        for(var i = 0; i < listaSalas.length; i++){
            if(listaSalas[i].nombre === e){
                setSalaActual(listaSalas[i])
                setListaServicios(listaSalas[i].servicios)
                if(listaSalas[i].servicios.length > 0){
                    setServicio(listaSalas[i].servicios[0].nombre)
                    setPrecioServicio(listaSalas[i].servicios[0].precio)
                    setCapacidadMaxima(listaSalas[i].servicios[0].maximoPersonas)
                    setServicioActual(listaSalas[i].servicios[0])

                }else{
                    setServicio('')
                    setPrecioServicio(0)
                    setCapacidadMaxima(0)
                    setServicioActual('')
                }

            }
        }
    }

    const handleServiceChange = e => {
        for (var i = 0; i < listaServicios.length; i++){
            if(listaServicios[i].nombre === e){
                setServicioActual(listaServicios[i])
                setServicio(listaServicios[i].nombre)
                setPrecioServicio(listaServicios[i].precio)
                setCapacidadMaxima(listaServicios[i].maximoPersonas)
            }
        }
    }

    const handleSubmit = () => {
        if(!servicio || !precioServicio || !capacidadMaxima || !salaActual || listaSalas.length === 0 || listaServicios.length === 0){
            setError('Debe de rellenar todos los espacios disponibles')
        }else if(capacidadMaxima <=0){
            setError('La capacidad m??xima del servicio no puede ser menor o igual a cero')
        }else if(precioServicio <=0){
            setError('El precio recomendado del servicio no puede ser menor o igual a cero')
        }else{
            setError('')

            const editandoServicio = {
                nombreSala:salaActual.nombre,
                nombreOriginal:servicioActual.nombre,
                nombre: servicio,
                editandoServicio: {
                    nombre: servicio,
                    precio: precioServicio,
                    maximoPersonas: capacidadMaxima
                }
            }

            axios.post('https://api-dis2021.herokuapp.com/Sala/encontrarServicio', editandoServicio)
            .then(respuestaServicio => {
                if(respuestaServicio.data[0].servicios.length === 0 || servicioActual.nombre === servicio){
                    axios.post('https://api-dis2021.herokuapp.com/Sala/editarServicio', editandoServicio)
                    .then(() => {
                        alert('??Servicio editado!')
                        window.location.replace('/menuServicios')
                    })
                }else{
                    setError('Ya existe un servicio con el mismo nombre')
                }
            })
        }
    }

    return (
        <div style={{margin: '0px 0px 20px'}}>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0 45px'}}>
                <h1 style={{color:'#5A47AB'}}>
                    Editar Servicio
                </h1>
            </div>

            <div className="container">
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 10px'}}>
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
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="form-group" style={{margin: '10px 10px 10px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Servicio a Editar
                        </h2>
                        <select
                        required
                        className="form-control"
                        value={servicioActual.nombre}
                        onChange={e => handleServiceChange(e.target.value)}
                        style={{width:"400px"}}>
                            {
                                listaServicios.map(e => MakeOptions(e.nombre))
                            }
                        </select>
                    </div>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Nombre del Servicio
                        </h2>
                        <input type="text" placeholder='Nombre del Servicio' name="nombreServicio" required
                        className="form-control" 
                        value={servicio}
                        onChange={e => setServicio(e.target.value)}
                        style={{width:"400px"}}>
                        </input>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                    <div className="form-group" style={{margin: '10px 10px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Precio del Servicio
                        </h2>
                        <input type="number" placeholder='Precio del Servicio' name="precioServicio" required
                        className="form-control" 
                        value={precioServicio}
                        onChange={e => setPrecioServicio(e.target.value)}
                        style={{width:"400px"}}>
                        </input>
                    </div>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 10px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Capacidad M??xima del Servicio
                        </h2>
                        <input type="number" placeholder='Capacidad M??xima del Servicio' name="capacidadMaxima" required
                        className="form-control" 
                        value={capacidadMaxima}
                        onChange={e => setCapacidadMaxima(e.target.value)}
                        style={{width:"430px"}}>
                        </input>
                    </div>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '30px 0 20px'}}>
                    <label>{error}</label>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '100px 0px 100px'}}>
                        <Button buttonStyle='btn--outline2' path='/menuServicios' specificStyle={{width: '260px'}}>Volver al Men?? de Servicios</Button>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button buttonStyle='btn--outline2' onClick={handleSubmit} specificStyle={{width: '260px'}}>Editar Servicio</Button>
                </div>
            </div>
        </div>
    )
}

export default EditarServicio
