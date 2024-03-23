import { Link } from 'react-router-dom';
import styles from './SignUp.module.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function SignUp() {

    const [imgSrc, setImgSrc] = useState('');
    const [confirmContrasena, setConfirmContrasena] = useState('');
    const [formData, setFormData] = useState({
        usuario: '',
        nombre: '',
        contrasena: '',
        foto: '',
    });

    const navigate = useNavigate();
    const goLogin = () =>{
        navigate(`/login/`)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                let base64String = reader.result as string;
                var base64Parts = base64String.split(',');
                setImgSrc(base64String);
                setFormData(prevState => ({
                    ...prevState,
                    foto: base64Parts[1],
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleConfirmContrasena = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setConfirmContrasena(value)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Para prevenir el comportamiento de envío por defecto del formulario
        if (confirmContrasena === formData.contrasena) {

            if (formData.foto !== null) {
                try {
                    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/signin`, {
                        method: 'POST', // o 'PUT' si estás actualizando datos
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData), // Convierte los datos del formulario a JSON
                    });
                    if (response.ok) {
                        const jsonResponse = await response.json();
                        console.log('Respuesta del servidor:', jsonResponse);
                        if(jsonResponse.mensaje !== 'Error'){
                            alert('Cuentra creada con exito');
                            goLogin();
                        }else{
                            alert('Error usuario ya exite o verifique sus datos');
                        }
                    } else {
                        // Maneja la respuesta de error del servidor
                        console.error('Error en la respuesta del servidor');
                    }
                } catch (error) {
                    alert('Error al enviar los datos');
                }
            } else {
                alert('Elija una foto de perfil')
            }
        } else {
            alert('Verificique contraseña y su confirmacion');
        }
    };

    return (
        <div>
            <div className="position-absolute top-50 start-50 translate-middle">
                <div className={styles['card-sign-up']}>
                    <form onSubmit={handleSubmit}>
                        <div className='container d-flex'>
                            <div className={styles['card-left']}>
                                <div className={styles['card-img']}>
                                    {imgSrc && <img src={imgSrc} alt='photo' className={styles.photo} />}
                                </div>
                                <label htmlFor="imgPhoto" className='btn btn-outline-primary mb-4'> Selected photo</label>
                                <input type="file" id='imgPhoto' className={styles.hiddenInput} accept='.jpg, .jpeg, .png' name='fichero'
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className={styles['card-right']}>
                                <div className='container my-4'>
                                    <div className="mb-3">
                                        <label htmlFor="user-name" className='form-label'>Username</label>
                                        <input type="text" id='user-name' className='form-control'
                                            value={formData.usuario}
                                            name='usuario'
                                            onChange={handleInputChange}
                                            required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="full-name" className='form-label'>Name</label>
                                        <input type="text" id='full-name' className='form-control'
                                            value={formData.nombre}
                                            name='nombre'
                                            onChange={handleInputChange}
                                            required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className='form-label'>Password</label>
                                        <input type="password" id='password' className='form-control'
                                            value={formData.contrasena}
                                            name='contrasena'
                                            onChange={handleInputChange}
                                            required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="confirm-password" className='form-label'>Confirm Password</label>
                                        <input type="password" id='confirm-password'
                                            className={confirmContrasena === formData.contrasena ? 'form-control' : styles.errorConfirm}
                                            value={confirmContrasena}
                                            name='confirmacionContrasena'
                                            onChange={handleConfirmContrasena}
                                            required />
                                    </div>
                                    <button className='btn btn-outline-primary mb-4'>
                                        Sign in
                                    </button>
                                </div>
                                <div className='m-2'>
                                    <div className={styles['card-footer-right']}>
                                        Ya tienes cuenta?
                                        <Link to='/login'>
                                            Login
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignUp;