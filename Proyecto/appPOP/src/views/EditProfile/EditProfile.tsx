import styles from './EditProfile.module.scss'
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function EditProfile() {
    const { user } = useParams();
    const [imgSrc, setImgSrc] = useState('');
    const [changeImg, setChangeImg] = useState(false);
    const [formData, setFormData] = useState({
        id_usuario: null,
        usuario_nuevo: '',
        nombre: '',
        contrasena: '',
        foto: '',
    });

    const navigate = useNavigate();
    const goHome = () =>{
        navigate(`/homeuserloggedin/${formData.usuario_nuevo}`)
        console.log('estoy dentro')
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
        setChangeImg(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Para prevenir el comportamiento de envío por defecto del formulario
        console.log(formData.id_usuario)
        if (formData.foto !== null) {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/edituser`, {
                    method: 'PUT', // o 'PUT' si estás actualizando datos
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData), // Convierte los datos del formulario a JSON
                });
                if (response.ok) {
                    const jsonResponse = await response.json();
                    console.log('Respuesta del servidor:', jsonResponse);
                    if (jsonResponse.mensaje==='Usuario ya existe'){
                        alert(jsonResponse.mensaje)
                    }else if (jsonResponse.mensaje==='Error')
                        alert(jsonResponse.mensaje)
                    else{
                        goHome();
                    }
                } else {
                    // Maneja la respuesta de error del servidor
                    console.error('Error en la respuesta del servidor');
                }
            } catch (error) {
                alert('Error al enviar los datos');
            }
        } else {
            alert('Elija una photo de perfil')
        }
    };

    useEffect(() => {
        enviarGet();
    }, []);

    const enviarGet = () => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/home/${user}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                setFormData({
                    id_usuario: data.id,
                    usuario_nuevo: data.user,
                    nombre: data.fullName,
                    contrasena: '',
                    foto: data.photo
                });
                setImgSrc(data.photo)
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    };

    return (
        <div className='container'>
            <form action="" onSubmit={handleEdit}>
                <div className={styles['container-edit-profile']}>
                    <div className='col-1 fixed-top d-flex justify-content-center m-5'>
                        <Link to={`/homeuserloggedin/${user}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#0d6efd" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
                            </svg>
                        </Link>
                    </div>
                    <div className="col-6">
                        <div className={styles['card-left']}>
                            <div className={styles['card-img']}>
                                {imgSrc && <img src={`${import.meta.env.VITE_S3_URL}/`+imgSrc} alt='photo' 
                                className={changeImg===false? styles.photo : styles.photohiden} />}
                                {imgSrc && <img src={imgSrc} alt='photo' className={changeImg === false? styles.photohiden : styles.photo} />}
                            </div>
                            <label htmlFor="imgPhoto" className='btn btn-outline-primary mb-4'>New photo</label>
                            <input type="file" id='imgPhoto' className={styles.hiddenInput} accept='.jpg, .jpeg, .png' name='fichero'
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                    <div className="col-5">
                        <div className='container my-4'>
                            <div className="mb-3">
                                <label htmlFor="user-name" className='form-label'>Username</label>
                                <input type="text" id='user-name' className='form-control'
                                    value={formData.usuario_nuevo}
                                    name='usuario_nuevo'
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="full-name" className='form-label'>Name</label>
                                <input type="text" id='full-name' className='form-control'
                                    value={formData.nombre}
                                    name='nombre'
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="confirm-password" className='form-label'>Confirm Password</label>
                                <input type="password" id='confirm-password' className='form-control'
                                    value={formData.contrasena}
                                    name='contrasena'
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <button className='btn btn-outline-primary mb-4'>
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default EditProfile;