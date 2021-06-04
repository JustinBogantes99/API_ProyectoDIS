import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import { Button } from './Button';
import './Navbar.css'

function getToken () {
    let userData = localStorage.getItem('token');
    userData = JSON.parse(userData)
    return userData
}

function Navbar() {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);
    const [userData, setUserData] = useState(() => {
        let userData = getToken()
        console.log(userData)
        if(userData !== undefined)return userData
        return undefined
    });

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    const showButton = () => {
        if(window.innerWidth <= 900) {
            setButton(false)
        }else{
            setButton(true)
        }
    }

    useEffect(() => {
        showButton();
      }, []);

    window.addEventListener('resize', showButton);

    const handleCerrarSesion = () => {
        localStorage.clear()
        window.location.replace('/login')
    }

    return (
        <>
            <div>
            <nav className="navbar justify-content-center">
                <div className="navbar-container">
                    
                    <div className='menu-icon' onClick={handleClick}>
                        <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
                    </div>
                    <ul className={click? 'nav-menu active' : 'nav-menu'}>
                        
                    </ul>
                    
                    {userData? (
                        <>
                        <Button buttonStyle='btn--outline' path='/miPerfil' specificStyle={{width: '150px'}}>Mi Perfil</Button>&nbsp;&nbsp;
                        <Button buttonStyle='btn--outline' onClick={handleCerrarSesion} specificStyle={{width: '150px'}}>Cerrar Sesión</Button>
                        </>
                        ):(<></>)}

                    <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                        <img src="./jojo.png" alt="bug" height={75} />                     
                    </Link>
                </div>
            </nav>
            </div>              
        </>
    )
}

export default Navbar
