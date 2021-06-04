import React from 'react'
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

import Navbar from './components/Navbar'
import Ingresar from './components/views/Ingresar'
import Menu from './components/views/Menu'
import MenuClases from './components/views/MenuClases'
import MenuUsuarios from './components/views/MenuUsuarios'
import MenuSalas from './components/views/MenuSalas'
import MenuServicios from './components/views/MenuServicios'
import AgregarServicio from './components/views/AgregarServicio'
import EditarServicio from './components/views/EditarServicio'
import EliminarServicio from './components/views/EliminarServicio'
import AgregarSala from './components/views/AgregarSala'
import EditarSala from './components/views/EditarSala'
import EditarAforo from './components/views/EditarAforo'
import AgregarUsuario from './components/views/AgregarUsuario'
import EditarUsuario from './components/views/EditarUsuario'
import ReservarCupoAdmin from './components/views/ReservarCupoAdmin'
import ConsultarXEstado from './components/views/ConsultarEstado'
import HabilitarDesUsuario from './components/views/HabilitarDesUsuario'
import AgregarClase from './components/views/AgregarClase'
import EliminarClase from './components/views/EliminarClase'
import CancelarAsistencia from './components/views/CancelarAsistencia'
import ConsultarMisClases from './components/views/ConsultarMisClases'
import CambiarContrasenia from './components/views/CambiarContrasenia'
import ConsultarCalendario from './components/views/ConsultarCalendario'
import ReservarCupoCliente from './components/views/ReservarCupoCliente'
import EditarClase from './components/views/EditarClase'
import ConfirmarPago from './components/views/ConfirmarPago'
import MiPerfil from './components/views/MiPerfil'


function App() {
  return (
    <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Menu} />  
          <Route exact path="/menuPrincipal" component={Menu} />
          <Route exact path="/logIn" component={Ingresar} />
          <Route exact path="/menuClases" component={MenuClases} />
          <Route exact path="/menuUsuarios" component={MenuUsuarios} />
          <Route exact path="/menuSalas" component={MenuSalas} />
          <Route exact path="/menuServicios" component={MenuServicios} />
          <Route exact path="/agregarServicio" component={AgregarServicio} />
          <Route exact path="/editarServicio" component={EditarServicio} />
          <Route exact path="/eliminarServicio" component={EliminarServicio} />
          <Route exact path="/agregarSala" component={AgregarSala} />
          <Route exact path="/editarSala" component={EditarSala} />
          <Route exact path="/editarAforo" component={EditarAforo} />
          <Route exact path="/agregarUsuario" component={AgregarUsuario} />
          <Route exact path="/editarUsuario" component={EditarUsuario} />
          <Route exact path="/reservarCupoParaUsuario" component={ReservarCupoAdmin} />
          <Route exact path="/consultarClientesXEstado" component={ConsultarXEstado} />
          <Route exact path="/habilitarDesUsuario" component={HabilitarDesUsuario} />
          <Route exact path="/agregarClase" component={AgregarClase} />
          <Route exact path="/eliminarClase" component={EliminarClase} />
          <Route exact path="/cancelarAsistencia" component={CancelarAsistencia} />
          <Route exact path="/verMisClases" component={ConsultarMisClases} />
          <Route exact path="/cambiarContrasenia" component={CambiarContrasenia} />
          <Route exact path="/consultarCalendario" component={ConsultarCalendario} />
          <Route exact path="/reservarCupoenClase" component={ReservarCupoCliente} />
          <Route exact path="/editarClase" component={EditarClase} />
          <Route exact path="/confirmarPago" component={ConfirmarPago} />
          <Route exact path="/miPerfil" component={MiPerfil} />
        </Switch>
    </Router>
  );
}

export default App;
