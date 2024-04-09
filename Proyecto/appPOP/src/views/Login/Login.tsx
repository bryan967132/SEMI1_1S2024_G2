import { Link } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import styles from './Login.module.scss'
import logo from '../../assets/img/logo.png'
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';

function Login() {
    const [webCam, setWebCam] = useState(false)
    const [accountantPhoto, setAccountantPhoto] = useState(7);
    const webcamRef = useRef<Webcam | null>(null);

    const [dataLogin, setDataLogin] = useState({
        usuario: '',
        contrasena: '',
    });

    const [loginFaceId, setLoginFaceId] = useState({
        usuario: '',
        imgFaceId: '',
    })

    const navigate = useNavigate();
    const goHome = () => {
        navigate(`/homeuserloggedin/${dataLogin.usuario}`)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDataLogin(prevState => ({
            ...prevState,
            [name]: value,
        }));

        setLoginFaceId(prevState => ({
            ...prevState,
            usuario: value,
        }));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Para prevenir el comportamiento de envío por defecto del formulario
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataLogin), // Convierte los datos del formulario a JSON
            });
            if (response.ok) {
                const jsonResponse = await response.json();
                if (jsonResponse.mensaje !== 'Error') {
                    alert('Bienvenido');
                    goHome();
                } else {
                    alert('Error no existe usuario o verificque usario y contraseña');
                }
            } else {
                console.error('Error en la respuesta del servidor');
            }
        } catch (error) {
            alert('Error al enviar los datos');
        }
    };
    const handleWebCam = () => {
        setWebCam(!webCam)
        sendLoginData();
    }

    useEffect(() => {
        if (webCam) {
            capturePhoto();
        }
    }, [webCam]);


    const capturePhoto = () => {
        if (webCam) {
            let contador = 5;
            const interval = setInterval(() => {
                if (contador === 0 && webCam) {
                    clearInterval(interval);
                    if (webcamRef.current !== null) {
                        let photo = webcamRef.current.getScreenshot();
                        if (photo !== null) {
                            // Crear un elemento de imagen en el documento
                            const img = new Image();
                            img.src = photo;
    
                            // Esperar a que la imagen se cargue
                            img.onload = () => {
                                // Crear un lienzo para dibujar la imagen
                                const canvas = document.createElement('canvas');
                                canvas.width = img.width;
                                canvas.height = img.height;
                                const ctx = canvas.getContext('2d');
    
                                // Verificar si el contexto del lienzo es válido
                                if (ctx !== null) {
                                    // Dibujar la imagen en el lienzo
                                    ctx.drawImage(img, 0, 0);
    
                                    // Convertir el lienzo a una imagen en formato JPEG
                                    const jpegDataUrl = canvas.toDataURL('image/jpeg');
    
                                    // Actualizar el estado con la imagen en formato JPEG
                                    setLoginFaceId(prevLoginFaceId => ({
                                        ...prevLoginFaceId,
                                        imgFaceId: jpegDataUrl.split(',')[1]
                                    }));
                                } else {
                                    console.log('No se pudo obtener el contexto del lienzo');
                                }
                            };
                        } else {
                            console.log('La foto capturada es nula');
                        }
                    } else {
                        console.log('La referencia a la webcam es null');
                    }
                } else {
                    contador--;
                    setAccountantPhoto(contador);
                }
            }, 1000);
        }
    };
    
    

    const sendLoginData = async () => {
        if (webCam) {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/loginfaceid`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(loginFaceId)
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.mensaje !== 'Error') {
                        alert('Bienvenido');
                        goHome();
                    } else {
                        alert('Error no existe usuario o verificque usario y contraseña');
                    }
                } else {
                    console.error('Error en la respuesta del servidor');
                }
            } catch (error) {
                console.error('Error al enviar los datos:', error);
            }
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
                            <div className={`${webCam == false ? styles['login-text'] : styles['login-text-hiden']} mb-3`}>
                                <label htmlFor="password" className='form-label'>Password</label>
                                <input type="password" id='password' className='form-control'
                                    name='contrasena'
                                    value={dataLogin.contrasena}
                                    onChange={handleInputChange}
                                />
                            </div>
                            {webCam && (
                                <div className={webCam == true ? styles['login-face-id'] : styles['login-face-id-hiden']}>
                                    <Webcam className={styles['webcam']} ref={webcamRef} />
                                    <h1 className={styles['accountant']}>{accountantPhoto}</h1>
                                </div>
                            )}
                            <div className={styles['login-type']}>
                                <button type='submit' className='btn btn-outline-primary mb-4 p-2'>
                                    Login
                                </button>
                                <button type='button' className={`${webCam ? styles['btn-hidden'] : styles['btn-show']}  btn-outline-primary mb-4 p-2`} onClick={handleWebCam}>
                                    Face Id
                                </button>
                                <button type='button' className={`${webCam ? styles['btn-show'] : styles['btn-hidden']}  btn-outline-primary mb-4 p-2`} onClick={sendLoginData}>
                                    Take photo
                                </button>
                            </div>
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