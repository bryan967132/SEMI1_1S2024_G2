import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import styles from './Login.module.scss'
import logo from '../../assets/img/logo.png'

function Login() {
    const [dataLogin, setDataLogin] = useState({
        usuario: '',
        contrasena: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDataLogin(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Para prevenir el comportamiento de envío por defecto del formulario
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
            method: 'POST', // o 'PUT' si estás actualizando datos
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataLogin), // Convierte los datos del formulario a JSON
          });
          
          if (response.ok) {
            const jsonResponse = await response.json();
            console.log('Respuesta del servidor:', jsonResponse);
            if(jsonResponse.mensaje !== 'Error'){
                alert('Bienvenido');
                window.location.href = `/homeuserloggedin/${dataLogin.usuario}`;
            }else{
                alert('Error no existe usuario o verificque usario y contraseña');
            }
          } else {
            console.error('Error en la respuesta del servidor');
          }
        } catch (error) {
          alert('Error al enviar los datos');
        }
      };

    return (
        <div>
            <div className="position-absolute top-50 start-50 translate-middle">
                <div className={styles['card-login']}>
                    <img src={logo} alt="logo" className={styles.logo} />
                    <div className='container'>
                        <form onSubmit={handleSubmit}>
                            <div className='mb-3'>
                                <label htmlFor="user-name" className='form-label'>Username</label>
                                <input type="text" id='user-name' className='form-control'
                                name='usuario' 
                                value={dataLogin.usuario}
                                onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className='form-label'>Password</label>
                                <input type="password" id='password' className='form-control'
                                name='contrasena'
                                value={dataLogin.contrasena}
                                onChange={handleInputChange}
                                />
                            </div>
                            <button type='submit' className='btn btn-outline-primary mb-4'>
                                Login
                            </button>
                        </form>
                        <div className='card-footer text-center'>
                            No tienes cuenta?
                            <Link to='/signup'> Registrate </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;