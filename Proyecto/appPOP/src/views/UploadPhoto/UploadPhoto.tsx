import styles from './UploadPhto.module.scss'
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function UploadPhoto() {
    const { user } = useParams();
    const [imgSrc, setImgSrc] = useState('');
    const [formData, setFormData] = useState({
        usuario: user,
        titulo: '',
        descripcion: '',
        ruta:'',
        imagen: '',
        tipo: '',
        categoria: ''
    });

    const [categorias, setCategorias] = useState([]);
    useEffect(() => {
        
        obtenerCategorias();
    }, []);

    const obtenerCategorias = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}categorias`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const jsonResponse = await response.json();
                console.log('Respuesta del servidor:', jsonResponse);
                setCategorias(jsonResponse.categoria);
            } else {
                console.error('Error en la respuesta del servidor');
                alert('Error en la respuesta del servidor');
            }
        } catch (error) {
            alert('Error al obtener las categorías');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result?.toString().split(",")[1]; 
                setImgSrc(reader.result as string);
                setFormData(prevState => ({
                    ...prevState,
                    imagen: base64String || '',
                }));
            };
            reader.readAsDataURL(file); 
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };
    
    const handleCategoriaSelect = (categoria: string) => {
        setFormData(prevState => ({
            ...prevState,
            categoria: categoria,
        }));
    };

    const handleUploadPhoto = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        const formDataWithFile = {
            ...formData
        };
        console.log(formDataWithFile.usuario)

        if (formDataWithFile.imagen !== null) {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/subir_recurso`, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formDataWithFile),
                });
                if (response.ok) {
                    const jsonResponse = await response.json();
                    console.log('Respuesta del servidor:', jsonResponse);
                    alert(jsonResponse.mensaje);

                    // Limpiar el formulario y la imagen seleccionada
                    setFormData({
                        usuario: user,
                        titulo: '',
                        descripcion: '',
                        ruta:'',
                        imagen: '',
                        tipo: '',
                        categoria: ''
                    });
                    setImgSrc('');
                } else {
                    console.error('Error en la respuesta del servidor');
                    alert('Error en la respuesta del servidor');
                }
            } catch (error) {
                alert('Error al enviar los datos');
            }
        } else {
            alert('Elija una imagen')
        }
    };

    const handleTipoSelect = (tipo: string) => {
        setFormData(prevState => ({
            ...prevState,
            tipo: tipo,
        }));
    };

    return (
        <div className='container'>
            <form action="" onSubmit={handleUploadPhoto}>
                <div className={styles['container-uploadphoto-profile']}>
                    <div className="col-1 fixed-top d-flex justify-content-center m-5">
                        <Link to={`/homeuserloggedin/${user}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#0d6efd" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
                            </svg>
                        </Link>
                    </div>
                    <div className="col-6">
                        <div className={styles['card-left']}>
                            <div className={styles['card-img']}>
                                {imgSrc && <img src={imgSrc} alt='photo' className={styles.photo} />}
                            </div>
                            <label htmlFor="imgPhoto" className='btn btn-outline-primary mb-4'> Selecionar imagen </label>
                            <input type="file" id='imgPhoto' className={styles.hiddenInput} accept='.jpg, .jpeg, .png' name='fichero' onChange={handleFileChange} />
                        </div>
                    </div>
                    <div className="col-5">
                        <div className='container'>
                            <div className="mb-3">
                                <label htmlFor="photo-name" className='form-label'>Titulo</label>
                                <input type="text" id='photo-name' className='form-control' value={formData.titulo} name='titulo' onChange={handleInputChange} required />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="photo-name" className='form-label'>Descripcion</label>
                                <input type="text" id='photo-name' className='form-control' value={formData.descripcion} name='descripcion' onChange={handleInputChange} required />
                            </div>
                            <div className="mb-5">
                                <label htmlFor="photo-name" className='form-label'>Link</label>
                                <input type="text" id='photo-name' className='form-control' value={formData.ruta} name='ruta' onChange={handleInputChange} required />
                            </div>
                            <div className="d-flex justify-content-between">
                                <div className='mb-6' style={{ width: '45%' }}>
                                    <div className="dropdown">
                                        <button style={{ width: '100%' }} className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButtonCategoria" data-bs-toggle="dropdown" aria-expanded="false">
                                            Categoria
                                        </button>
                                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButtonCategoria">
                                            {categorias.map((categoria, index) => (
                                                <li key={index} onClick={() => handleCategoriaSelect(categoria)}>
                                                    <a className="dropdown-item" href="#">{categoria}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className='mb-6' style={{ width: '45%' }}>
                                    <div className="dropdown">
                                        <button style={{ width: '100%' }} className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButtonTipo" data-bs-toggle="dropdown" aria-expanded="false">
                                        Tipo
                                        </button>
                                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButtonTipo">
                                            <li onClick={() => handleTipoSelect('Libro')}>
                                                <a className="dropdown-item" href="#">Libro</a>
                                            </li>
                                            <li onClick={() => handleTipoSelect('Revista')}>
                                                <a className="dropdown-item" href="#">Revista</a>
                                            </li>
                                            <li onClick={() => handleTipoSelect('Página web')}>
                                                <a className="dropdown-item" href="#">Página web</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        <div>
                            <div className="mt-4">
                                <button className='btn btn-outline-primary'>
                                    Subir Recurso
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
    )
    }
    
    export default UploadPhoto;
