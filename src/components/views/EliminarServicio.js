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


function EliminarServicio() {
    const [error, setError] = useState();
    const [salaActual, setSalaActual] = useState({nombre:''});
    const [listaSalas, setListaSalas] = useState([{nombre:''}]);

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
                if(respuesta.data[0].servicios.length > 0)setServicioActual(respuesta.data[0].servicios[0])
                

            }
        })
    });

    const handleServiceChange = e => {
        for (var i = 0; i < listaServicios.length; i++){
            if(listaServicios[i].nombre === e){
                setServicioActual(listaServicios[i])
            }
        }
    }


    const handleCambiarSala = e =>{
        for(var i = 0; i < listaSalas.length; i++){
            if(listaSalas[i].nombre === e){
                setSalaActual(listaSalas[i])
                setListaServicios(listaSalas[i].servicios)
                if(listaSalas[i].servicios.length > 0){
                    setServicioActual(listaSalas[i].servicios[0])
                }else{
                    setServicioActual('')
                }

            }
        }
    }

    const handleSubmit = () => {
        if(!salaActual || listaSalas.length === 0 || listaServicios.length === 0 || !servicioActual){
            setError('No hay salas o la sala seleccionada no tiene servicios que eliminar')
        }else{
            const eliminandoServicio = {
                nombreSala: salaActual.nombre,
                nombre: servicioActual.nombre
            }

            axios.post('https://api-dis2021.herokuapp.com/Sala/eliminarServicio', eliminandoServicio)
            .then(() => {
                alert('¡Servicio eliminado!')
                window.location.replace('/menuServicios')
            })
        }
    }


    return (
        <div style={{margin: '0px 0px 20px'}}>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0 45px'}}>
                <h1 style={{color:'#5A47AB'}}>
                    Eliminar Servicio
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
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px', width:"400px", justifyContent: "center", display: "flex"}}>
                            Servicio a Eliminar
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

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '30px 0 20px'}}>
                    <label>{error}</label>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '100px 0px 100px'}}>
                        <Button buttonStyle='btn--outline2' path='/menuServicios' specificStyle={{width: '260px'}}>Volver al Menú de Servicios</Button>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button buttonStyle='btn--outline2' onClick={handleSubmit} specificStyle={{width: '260px'}}>Eliminar Servicio</Button>
                </div>
            </div>
        </div>
    )
}

export default EliminarServicio
