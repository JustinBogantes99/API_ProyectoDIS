import React, { useState } from 'react';
import { Button } from '../Button';
import Calendar from "react-range-calendar";
import axios from 'axios';

function getLocalSession() {
    let userData = localStorage.getItem('token');
    userData = JSON.parse(userData)
    return userData
}

function MakeOptions(X){
    return <option>{X}</option>
}

function cargarClases(X){
    return (
        <div className="container" style={{border:'2px solid #5A47AB', margin: '10px 0px 10px', borderRadius: 10}}>
            <div className="form-group" style={{margin: '10px 10px 20px'}}>
                <h4 style={{display: "flex", justifyContent: "left", color:'white', margin: '10px 0 0px'}}>
                    Nombre de la Clase
                </h4>
                <div className="container" style={{backgroundColor: '#5A47AB', borderRadius: 10, border:'2px solid #5A47AB', margin: '5px 0px 0px'}}>
                    <text style={{textDecorationLine: 'underline', display: "flex", justifyContent: "left", color: 'white'}}>
                        {X.nombre}
                    </text>
                </div>

                <h4 style={{display: "flex", justifyContent: "left", color:'white', margin: '10px 0 0px'}}>
                    Instructor
                </h4>
                <div className="container" style={{backgroundColor: '#5A47AB', borderRadius: 10, border:'2px solid #5A47AB', margin: '5px 0px 0px'}}>
                    <text style={{textDecorationLine: 'underline', display: "flex", justifyContent: "left", color: 'white'}}>
                        {X.instructor.nombreCompleto}
                    </text>
                </div>

                <h4 style={{display: "flex", justifyContent: "left", color:'white', margin: '10px 0 0px'}}>
                    Precio Total
                </h4>
                <div className="container" style={{backgroundColor: '#5A47AB', borderRadius: 10, border:'2px solid #5A47AB', margin: '5px 0px 0px'}}>
                    <text style={{textDecorationLine: 'underline', display: "flex", justifyContent: "left", color: 'white'}}>
                        {X.precio}
                    </text>
                </div>

                <h4 style={{display: "flex", justifyContent: "left", color:'white', margin: '10px 0 0px'}}>
                    Horario
                </h4>
                <div className="container" style={{backgroundColor: '#5A47AB', borderRadius: 10, border:'2px solid #5A47AB', margin: '5px 0px 0px'}}>
                    <text style={{textDecorationLine: 'underline', display: "flex", justifyContent: "left", color: 'white'}}>
                        {X.horaInicio}-{X.horaFin}
                    </text>
                </div>

                <h4 style={{display: "flex", justifyContent: "left", color:'white', margin: '10px 0 0px'}}>
                    Cupos
                </h4>
                <div className="container" style={{backgroundColor: '#5A47AB', borderRadius: 10, border:'2px solid #5A47AB', margin: '5px 0px 0px'}}>
                    <text style={{textDecorationLine: 'underline', display: "flex", justifyContent: "left", color: 'white'}}>
                        {X.pagos.length}/{X.capacidadMaxima}
                    </text>
                </div>
                

            </div>
        </div>
    )
}

function ConsultarClasesCliente() {
    const [salaActual, setSalaActual] = useState({nombre:'', servicios:[]})
    const [listaClasesParcial, setListaClasesParcial] = useState([])
    const [dateRange, setDateRange] = useState([new Date(), new Date()])
    const [error, setError] = useState('')

    const [charger, setCharger] = useState(() => {
        let userData = getLocalSession();
        if(!userData) window.location.replace('/login')
        if(userData.role !== 'Cliente'){
            window.location.replace('/menuPrincipal')
        }

        axios.get('http://localhost:5000/Sala/listaSalas')
        .then(respuesta => {
            var salaActualLocal = ''
            for(var i = 0; i < respuesta.data.length; i++){
                if(respuesta.data[i]._id === userData.idSala){
                    salaActualLocal = respuesta.data[i]
                }
            }

            if(respuesta.data.length > 0 && salaActualLocal){
                setSalaActual(salaActualLocal)
                const listaClasesParcialLocal = []
                dateRange[0].setHours(0,0,0,0)
                dateRange[1].setHours(0,0,0,0)
                console.log(dateRange)
                for(var i = 0; i < salaActualLocal.clases.length; i++){
                    if(new Date(salaActualLocal.clases[i].diaEjecucion).getTime() <= dateRange[1].getTime() &&
                       new Date(salaActualLocal.clases[i].diaEjecucion).getTime() >= dateRange[0].getTime())listaClasesParcialLocal.push(salaActualLocal.clases[i])
                }

                console.log(listaClasesParcialLocal)
                setListaClasesParcial(listaClasesParcialLocal)
                if(listaClasesParcialLocal.length > 0)setError('')
                else setError('No hay ninguna clase en el rango de fechas actuales')
            }

        })

    })

    const handleCambiarRango = (minDate, maxDate) =>{
        var orden = true
        if(minDate < maxDate){
            setDateRange([minDate, maxDate])
        }
        else{
            setDateRange([maxDate, minDate])
            orden = false
        }
        
        if(salaActual.clases.length > 0){
            const listaClasesParcialLocal = []
            
            const fechasAsignadas = []

            if(orden){
                fechasAsignadas.push(minDate)
                fechasAsignadas.push(maxDate)
            }else{
                fechasAsignadas.push(maxDate)
                fechasAsignadas.push(minDate)
            }

            for(var i = 0; i < salaActual.clases.length; i++){
                if(new Date(salaActual.clases[i].diaEjecucion).getTime() <= fechasAsignadas[1].getTime() &&
                    new Date(salaActual.clases[i].diaEjecucion).getTime() >= fechasAsignadas[0].getTime())listaClasesParcialLocal.push(salaActual.clases[i])
            }

            setListaClasesParcial(listaClasesParcialLocal)
            if(listaClasesParcialLocal.length > 0)setError('')
            else setError('No hay ninguna clase en el rango de fechas actuales')
        }
    }

    return (
        <div style={{margin: '0px 0px 20px'}}>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0 45px'}}>
                <h1 style={{color:'#5A47AB'}}>
                    Calendario de Actividades
                </h1>
            </div>

            <div className="container">
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{display: "flex", justifyContent: "center",color:'#5A47AB', margin: '10px 0 0px'}}>
                            Calendario de Clases
                        </h2>
                        <Calendar
                            baseColor = '#5A47AB'
                            hoverBackgroundColor ='#5A47AB'
                            visible={true}
                            dateRange={dateRange}
                            onDateClick={(minDate, maxDate) => {handleCambiarRango(minDate, maxDate)}}
                            type="free-range"
                        />
                    </div>
                    <div className="form-group" style={{margin: '10px 10px 20px'}}>
                        <h2 style={{display: "flex", justifyContent: "center",color:'#5A47AB', margin: '10px 0 0px'}}>
                            Lista de Clases
                        </h2>
                        <div className="container" style={{maxHeight: 350, overflow: 'auto', width:"400px", height:"800px", backgroundColor: '#000000', borderRadius: 10}}>
                            {
                                listaClasesParcial.map(e => cargarClases(e))
                            }
                        </div>
                    </div>

                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '30px 0 20px'}}>
                    <label>{error}</label>
                </div>

                <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0px 100px'}}>
                        <Button buttonStyle='btn--outline2' path='/' specificStyle={{width: '260px'}}>Volver al Menú Principal</Button>
                </div>
            </div>
        </div>
    )
}

export default ConsultarClasesCliente
