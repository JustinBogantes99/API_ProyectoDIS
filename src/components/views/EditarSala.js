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

function EditarSala() {
    const [nombreSala, setNombreSala] = useState('');
    const [capacidadMaxima, setCapacidadMaxima] = useState(0);
    const [horarioSemanal, setHorarioSemanal] = useState([{nombre:'Domingo', inicio:'07:00', cierre:'17:00'},{nombre:'Lunes', inicio:'07:00', cierre:'17:00'},{nombre:'Martes', inicio:'07:00', cierre:'17:00'}
    ,{nombre:'Miércoles', inicio:'07:00', cierre:'17:00'},{nombre:'Jueves', inicio:'07:00', cierre:'17:00'},{nombre:'Viernes', inicio:'07:00', cierre:'17:00'},{nombre:'Sábado', inicio:'07:00', cierre:'17:00'}]);
    const [diaActual, setDiaActual] = useState(horarioSemanal[0]);
    const [horaInicio, setHoraInicio] = useState(horarioSemanal[0].inicio);
    const [horaCierre, setHoraCierre] = useState(horarioSemanal[0].cierre);
    const [diaLibre, setDiaLibre] = useState(false);
    const [listaSalas, setListaSalas] = useState([]);
    const [salaActual, setSalaActual] = useState({nombre:''});
    const [error, setError] = useState();

    const [charger, setCharger] = useState(() => {
        let userData = getLocalSession();
        if(!userData) window.location.replace('/login')
        if(userData.role !== 'Administrador'){
            window.location.replace('/menuPrincipal')
        }

        //Se tienen que cargar los datos de las salas
        axios.get('https://api-dis2021.herokuapp.com/Sala/listaSalas')
        .then(respuesta => {
            if(respuesta.data.length > 0){

                respuesta.data.sort(function(a,b){
                    if(a.nombre < b.nombre) { return -1; }
                    if(a.nombre > b.nombre) { return 1; }
                    return 0;
                })

                setListaSalas(respuesta.data)

                var salaActualLocal = respuesta.data[0]

                setNombreSala(salaActualLocal.nombre)
                setCapacidadMaxima(salaActualLocal.capacidadMaxima)

                setSalaActual(salaActualLocal)
                setHorarioSemanal(salaActualLocal.horario)
                setHoraInicio(salaActualLocal.horario[0].inicio)
                setHoraCierre(salaActualLocal.horario[0].cierre)
                
                if(salaActualLocal.horario[0].inicio === salaActualLocal.horario[0].cierre && salaActualLocal.horario[0].inicio === '00:00')setDiaLibre(true)


                
            }
        })
    });

    const handleSalaChange = e => {
        for(var i = 0; i < listaSalas.length; i++){
            if(listaSalas[i].nombre === e){
                setNombreSala(e)
                setCapacidadMaxima(listaSalas[i].capacidadMaxima)

                setSalaActual(listaSalas[i])
                setHorarioSemanal(listaSalas[i].horario)
                setHoraInicio(listaSalas[i].horario[0].inicio)
                setHoraCierre(listaSalas[i].horario[0].cierre)
            }
        }
    }

    const handleDayChange = e => {
        for(var i = 0; i < horarioSemanal.length; i++){
            if(horarioSemanal[i].dia === e){
                setDiaActual(horarioSemanal[i])
                if(horarioSemanal[i].inicio === '00:00' && horarioSemanal[i].cierre === '00:00'){
                    setDiaLibre(true)
                }else setDiaLibre(false)
                setHoraInicio(horarioSemanal[i].inicio)
                setHoraCierre(horarioSemanal[i].cierre)
            }
        }
    }

    const handleDiaLibre = e => {
        if(!e){
            const diaActualLocal = diaActual
            diaActualLocal.inicio = '00:00'
            diaActualLocal.cierre = '00:00'
            setDiaActual(diaActualLocal)
            setHoraInicio('00:00')
            setHoraCierre('00:00')
        }
        setDiaLibre(e)
    }

    const handleHoraInicio = e => {
        if(e < horaCierre){
            setError('')
            var diaActualLocal = diaActual
            diaActualLocal.inicio = e
            setDiaActual(diaActualLocal)
            setHoraInicio(e)
        }else{
            setError('La hora de apertura no puede ser después a la hora de cierre')
        }
    }

    const handleHoraCierre = e => {
        if(e > horaInicio){
            setError('')
            var diaActualLocal = diaActual
            diaActualLocal.cierre = e
            setDiaActual(diaActualLocal)
            setHoraCierre(e)
        }else{
            setError('La hora de cierre no puede ser antes a la hora de apertura')
        }
    }

    const handleSubmit = () => {
        if(!nombreSala || !capacidadMaxima || !horarioSemanal){
            setError('Debe de rellenar todos los espacios')
        }else if(capacidadMaxima <= 0){
            setError('La capacidad máxima no puede ser menor o igual a cero')
        }else{
            setError('')

            const editandoSala ={
                actualName:salaActual.nombre,
                nombre: nombreSala,
                capacidadMaxima:capacidadMaxima,
                aforo: salaActual.aforo[0].porcentaje,
                horario: horarioSemanal
            }

            axios.post('https://api-dis2021.herokuapp.com/Sala/encontrarSala', editandoSala)
            .then(respuesta => {
                if(respuesta.data.length === 0 || nombreSala === salaActual.nombre){
                    axios.post('https://api-dis2021.herokuapp.com/Sala/editarSala', editandoSala)
                    .then(() => {
                        alert('¡Sala Editada!')
                        window.location.replace('/menuSalas')
                    })
                }else{
                    setError('Ya existe una Sala con ese nombre')
                }
            })

            
        }
    }

    return (
        <div style={{margin: '0px 0px 20px'}}>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0 45px'}}>
                <h1 style={{color:'#5A47AB'}}>
                    Editar Sala
                </h1>
            </div>

            <div className="container">
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Sala a Editar
                        </h2>
                        <select
                        required
                        className="form-control"
                        value={salaActual.nombre}
                        onChange={e => handleSalaChange(e.target.value)}
                        style={{width:"400px"}}>
                            {
                                listaSalas.map(e => MakeOptions(e.nombre))
                            }
                        </select>
                    </div>
                </div>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Nombre de la Sala
                        </h2>
                        <input type="text" placeholder='Nombre del Servicio' name="nombreServicio" required
                        className="form-control" 
                        value={nombreSala}
                        onChange={e => setNombreSala(e.target.value)}
                        style={{width:"400px"}}>
                        </input>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                    <div className="form-group" style={{margin: '10px 10px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Capacidad Maxima de la Sala
                        </h2>
                        <input type="number" placeholder='Capacidad Maxima de la Sala' name="capacidadMaxima" required
                        className="form-control" 
                        value={capacidadMaxima}
                        onChange={e => setCapacidadMaxima(e.target.value)}
                        style={{width:"400px"}}>
                        </input>
                    </div>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 0px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Día de la Semana
                        </h2>
                        <select
                        required
                        className="form-control"
                        value={diaActual.nombre}
                        onChange={e => handleDayChange(e.target.value)}
                        style={{width:"280px"}}>
                            {
                                horarioSemanal.map(e => MakeOptions(e.nombre))
                            }
                        </select>
                    </div>
                    <div className="form-group" style={{margin: '10px 10px 0px'}}>
                        <text style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            ¿Día Libre?
                        </text>&nbsp;
                        <input type="checkbox" placeholder='Aforo Inicial' name="aforo" required
                        checked={diaLibre}
                        onChange={e => handleDiaLibre(!diaLibre)}
                        style={{width:"20px",height:"20px"}}>
                        </input>
                    </div>
                </div>

                {
                    diaLibre?(<></>):(
                        <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <div className="form-group" style={{margin: '10px 10px 10px'}}>
                                <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                                    Hora de Apertura
                                </h2>
                                <input type="time" placeholder='Hora de Apertura' name="horaInicio" required
                                className="form-control" 
                                value={horaInicio}
                                onChange={e => handleHoraInicio(e.target.value)}
                                style={{width:"400px"}}>
                                </input>
                            </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <div className="form-group" style={{margin: '10px 10px 10px'}}>
                                <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                                    Hora de Cierre
                                </h2>
                                <input type="time" placeholder='Hora de Cierre' name="horaCierre" required
                                className="form-control" 
                                value={horaCierre}
                                onChange={e => handleHoraCierre(e.target.value)}
                                style={{width:"400px"}}>
                                </input>
                            </div>
                        </div>
                    )
                }

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '30px 0 20px'}}>
                    <label>{error}</label>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0px 100px'}}>
                        <Button buttonStyle='btn--outline2' path='/menuSalas' specificStyle={{width: '260px'}}>Volver al Menú de Salas</Button>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button buttonStyle='btn--outline2' onClick={handleSubmit} specificStyle={{width: '260px'}}>Editar Servicio</Button>
                </div>
            </div>
            
        </div>
    )
}

export default EditarSala
