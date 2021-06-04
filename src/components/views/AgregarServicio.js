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

function AgregarServicio() {
    const [servicio, setServicio] = useState('');
    const [precioServicio, setPrecioServicio] = useState(0);
    const [capacidadMaxima, setCapacidadMaxima] = useState(0);
    const [salaActual, setSalaActual] = useState({nombre:''});
    const [listaSalas, setListaSalas] = useState([{nombre:''}]);
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
                console.log(respuesta.data)
                setListaSalas(respuesta.data)
                setSalaActual(respuesta.data[0])
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

    const handleSubmit = () => {
        if(!servicio || !precioServicio || !capacidadMaxima || !salaActual || listaSalas.length === 0){
            setError('Debe de rellenar todos los espacios disponibles')
        }else if(capacidadMaxima <=0){
            setError('La capacidad máxima del servicio no puede ser menor o igual a cero')
        }else if(precioServicio <=0){
            setError('El precio recomendado del servicio no puede ser menor o igual a cero')
        }else{
            setError('')

            const nuevoServicio = {
                nombreSala:salaActual.nombre,
                nombre: servicio,
                nuevoServicio: {
                    nombre: servicio,
                    precio: precioServicio,
                    maximoPersonas: capacidadMaxima
                }
            }
            console.log(nuevoServicio)
            axios.post('https://api-dis2021.herokuapp.com/Sala/encontrarServicio', nuevoServicio)
            .then(respuestaServicio => {
                if(respuestaServicio.data[0].servicios.length === 0){
                    axios.post('https://api-dis2021.herokuapp.com/Sala/agregarServicio', nuevoServicio)
                    .then(() => {
                        alert('¡Servicio agregado!')
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
                    Agregar Servicio
                </h1>
            </div>

            <div className="container">
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
                            Precio Recomendado c/hora
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
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Capacidad Máxima del Servicio
                        </h2>
                        <input type="int" placeholder='Capacidad Máxima del Servicio' name="capacidadMaxima" required
                        className="form-control" 
                        value={capacidadMaxima}
                        onChange={e => setCapacidadMaxima(e.target.value)}
                        style={{width:"430px"}}>
                        </input>
                    </div>&nbsp;&nbsp;
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
                    </div>&nbsp;&nbsp;&nbsp;
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '30px 0 20px'}}>
                    <label>{error}</label>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '100px 0px 100px'}}>
                        <Button buttonStyle='btn--outline2' path='/menuServicios' specificStyle={{width: '260px'}}>Volver al Menú de Servicios</Button>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button buttonStyle='btn--outline2' onClick={handleSubmit} specificStyle={{width: '260px'}}>Agregar Servicio</Button>
                </div>
            </div>
            
        </div>
    )
}

export default AgregarServicio
