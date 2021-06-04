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

function AgregarSala() {
    const [nombreSala, setNombreSala] = useState('');
    const [capacidadMaxima, setCapacidadMaxima] = useState(0);
    const [aforo, setAforo] = useState(0);
    const [horarioSemanal, setHorarioSemanal] = useState([{dia:'Domingo', inicio:'07:00', cierre:'17:00'}, {dia:'Lunes', inicio:'07:00', cierre:'17:00'},{dia:'Martes', inicio:'07:00', cierre:'17:00'},
    {dia:'Miércoles', inicio:'07:00', cierre:'17:00'},{dia:'Jueves', inicio:'07:00', cierre:'17:00'},{dia:'Viernes', inicio:'07:00', cierre:'17:00'},{dia:'Sábado', inicio:'07:00', cierre:'17:00'}]);
    const [diaActual, setDiaActual] = useState(horarioSemanal[0]);
    const [horaInicio, setHoraInicio] = useState(horarioSemanal[0].inicio);
    const [horaCierre, setHoraCierre] = useState(horarioSemanal[0].cierre);
    const [diaLibre, setDiaLibre] = useState(false);
    const [error, setError] = useState();

    const [charger, setCharger] = useState(() => {
        let userData = getLocalSession();
        if(!userData) window.location.replace('/login')
        if(userData.role === 'Administrador'){
            return userData.role
        }else{
            window.location.replace('/menuPrincipal')
        }
    });


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
        var diaActualLocal = diaActual
        diaActualLocal.inicio = '00:00'
        diaActualLocal.cierre = '00:00'
        setDiaActual(diaActualLocal)
        setHoraInicio('00:00')
        setHoraCierre('00:00')
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
        console.log(diaActual)
        if(!nombreSala || !capacidadMaxima || !aforo || !horarioSemanal){
            setError('Debe de rellenar todos los espacios')
        }else if(aforo <= 0){
            setError('El aforo no puede ser menor o igual a cero')
        }else if(aforo > 100){
            setError('El aforo no puede ser mayor a cien')
        }else if(capacidadMaxima <= 0){
            setError('La capacidad máxima no puede ser menor o igual a cero')
        }else{
            setError('')

            const nuevaSala ={
                nombre: nombreSala,
                capacidadMaxima:capacidadMaxima,
                aforo: {porcentaje:aforo},
                horario: horarioSemanal
            }

            axios.post('https://api-dis2021.herokuapp.com/Sala/encontrarSala', nuevaSala)
            .then(answer => {
                if(answer.data.length === 0){
                    axios.post('https://api-dis2021.herokuapp.com/Sala/agregarSala', nuevaSala)
                    .then(() => {
                        alert('¡Sala Agregada!')
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
                    Agregar Sala
                </h1>
            </div>

            <div className="container">
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Nombre de la Sala
                        </h2>
                        <input type="text" placeholder='Nombre de la Sala' name="nombreSala" required
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
                            Aforo Inicial de la Sala
                        </h2>
                        <input type="number" placeholder='Aforo Inicial' name="aforo" required
                        className="form-control" 
                        value={aforo}
                        onChange={e => setAforo(e.target.value)}
                        style={{width:"400px"}}>
                        </input>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                    <div className="form-group" style={{margin: '10px 0px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Día de la Semana
                        </h2>
                        <select
                        required
                        className="form-control"
                        value={diaActual.dia}
                        onChange={e => handleDayChange(e.target.value)}
                        style={{width:"280px"}}>
                            {
                                horarioSemanal.map(e => MakeOptions(e.dia))
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
                        <Button buttonStyle='btn--outline2' onClick={handleSubmit} specificStyle={{width: '260px'}}>Agregar Servicio</Button>
                </div>
            </div>
            
        </div>
    )
}

export default AgregarSala
