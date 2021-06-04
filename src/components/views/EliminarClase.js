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


function EliminarClase() {
    const [salaActual, setSalaActual] = useState({nombre:'', servicios:[]})
    const [listaSalas, setListaSalas] = useState([])
    const [diaOriginal, setDiaOriginal] = useState('')
    const [listaClasesParcial, setListaClasesParcial] = useState([])
    const [claseActual, setClaseActual] = useState({nombre:''})
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
                respuesta.data[0].servicios.sort(function(a,b){
                    if(a.nombre < b.nombre) { return -1; }
                    if(a.nombre > b.nombre) { return 1; }
                    return 0;
                })

                setListaSalas(respuesta.data)
                setSalaActual(respuesta.data[0])
            }
        })
    })

    const handleCambiarSala = e => {
        for(var k = 0; k < listaSalas.length; k++){
            if(listaSalas[k].nombre === e){
                setSalaActual(listaSalas[k])
                setDiaOriginal('')
                setListaClasesParcial([])
                setClaseActual({nombre:''})
            }
        }
    }

    const handleCambioDia = e => {
        setDiaOriginal(e)
        if(salaActual.clases.length > 0){
            var diaSeleccionado= new Date(e)
            diaSeleccionado.setDate(diaSeleccionado.getDate()+1)
            diaSeleccionado.setHours(0,0,0,0);

            const clasesParciales = []

            for(var i = 0; i < salaActual.clases.length; i++){
                if(new Date(salaActual.clases[i].diaEjecucion).getTime() === diaSeleccionado.getTime()){
                    clasesParciales.push(salaActual.clases[i])
                }
            }

            if(clasesParciales.length === 0){
                setError('No hay clases para el día seleccionado')
                setListaClasesParcial([])
                setClaseActual({nombre:''})

            }else{
                setError('')
                setListaClasesParcial(clasesParciales)
                setClaseActual(clasesParciales[0])
            }
        }
    }

    const handleCambiarClase = e => {
        for( var i = 0; i < listaClasesParcial.length; i++){
            if(listaClasesParcial[i].nombre === e){
                setClaseActual(listaClasesParcial[i])
            }
        }
    }

    const handleSubmit = () =>{
        var mesDePublicado = new Date()
        mesDePublicado.setDate(mesDePublicado.getDate()+30)

        var diaOriginalLocal = new Date(diaOriginal)

        if(listaSalas.length === 0 || !diaOriginal || listaClasesParcial.length === 0){
            setError('No se puede eliminar clases que no existen')
        }else if(diaOriginalLocal.getTime() <= mesDePublicado.getTime()){
            setError("Las clases publicadas no pueden eliminarse")
        }else{
            setError('')
            const eliminandoClase = {
                nombreSala: salaActual.nombre,
                _id: claseActual._id
            }
            axios.post('http://localhost:5000/Sala/eliminarClase', eliminandoClase)
            .then(() => {
                alert('Clase eliminada!')
                window.location.replace('/menuClases')
            })
        }
    }


    return (
        <div style={{margin: '0px 0px 20px'}}>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0 45px'}}>
                <h1 style={{color:'#5A47AB'}}>
                    Eliminar Clase
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
                        style={{width:"300px"}}>
                            {
                                listaSalas.map(e => MakeOptions(e.nombre))
                            }
                        </select>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Día de la Clase
                        </h2>
                        <input type="date" placeholder='Día de la Clase' name="diaClase" required
                        className="form-control" 
                        value={diaOriginal}
                        onChange={e => handleCambioDia(e.target.value)}
                        style={{width:"400px"}}>
                        </input>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Clase
                        </h2>
                        <select
                        required
                        className="form-control"
                        value={claseActual.nombre}
                        onChange={e => handleCambiarClase(e.target.value)}
                        style={{width:"300px"}}>
                            {
                                listaClasesParcial.map(e => MakeOptions(e.nombre))
                            }
                        </select>
                    </div>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '30px 0 20px'}}>
                    <label>{error}</label>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0px 100px'}}>
                        <Button buttonStyle='btn--outline2' path='/menuClases' specificStyle={{width: '260px'}}>Volver al Menú de Clases</Button>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button buttonStyle='btn--outline2' onClick={handleSubmit} specificStyle={{width: '260px'}}>Eliminar Clase</Button>
                </div>
            </div>
        </div>
    )
}

export default EliminarClase
