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

function EditarAforo() {
    const [listaSalas, setListaSalas] = useState([]);
    const [salaActual, setSalaActual] = useState({nombre:''});
    const [nuevoAforo, setNuevoAforo] = useState(0);
    const [error, setError] = useState();

    const [charger, setCharger] = useState(() => {
        let userData = getLocalSession();
        if(!userData) window.location.replace('/login')
        if(userData.role !== 'Administrador'){
            window.location.replace('/menuPrincipal')
        }

        //Se tienen que cargar los datos de las salas
        axios.get('https://api-dis2021.herokuapp.com/Sala/listaSalas')
        .then(answer => {
            if(answer.data.length > 0){

                answer.data.sort(function(a,b){
                    if(a.nombre < b.nombre) { return -1; }
                    if(a.nombre > b.nombre) { return 1; }
                    return 0;
                })

                setListaSalas(answer.data)

                var salaActualLocal = answer.data[0]

                setSalaActual(salaActualLocal)
                setNuevoAforo(salaActualLocal.aforo[0].porcentaje)
            }
        })
    });

    const handleSalaChange = e => {
        
    }

    const handleSubmit = () => {
        if(!salaActual || listaSalas.length === 0 || !nuevoAforo){
            setError('Todos los campos deben de ser llenados')
        }else if(nuevoAforo <=0 || nuevoAforo > 100){
            setError('El porcentaje de aforo no puede ser mayor a 100 ni menor o igual a 0')
        }else{
            const editandoSala ={
                actualName:salaActual.nombre,
                nombre: salaActual.nombre,
                capacidadMaxima:salaActual.capacidadMaxima,
                aforo: nuevoAforo,
                horario: salaActual.horario
            }

            axios.post('https://api-dis2021.herokuapp.com/Sala/editarSala', editandoSala)
            .then(() => {
                alert('Aforo de Sala Editada!')
                window.location.replace('/menuSalas')
            })
        }
    }

    return (
        <div style={{margin: '0px 0px 20px'}}>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: '50px 0 45px'}}>
                <h1 style={{color:'#5A47AB'}}>
                    Editar Aforo
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
                    <div className="form-group" style={{margin: '10px 10px 40px'}}>
                        <h2 style={{color:'#5A47AB', margin: '10px 0 0px'}}>
                            Porcentaje de Aforo Actual
                        </h2>
                        <input type="number" placeholder='Aforo Actual' name="aforoActual" required
                        className="form-control" 
                        value={nuevoAforo}
                        onChange={e => setNuevoAforo(e.target.value)}
                        style={{width:"400px"}}>
                        </input>
                    </div>
                </div>

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

export default EditarAforo
