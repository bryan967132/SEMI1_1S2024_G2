import styles from './SeeResources.module.scss'
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function SeeResources() {
    const { user } = useParams();
    const [listImg, setListImg] = useState<string[]>([]);

    const handleGategorySelect = (categoria: string) => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/getresources/${user}/${categoria}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },

        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error en la respuesta del servidor');
                }
            })
            .then((data: { recursos: string[] }) => {
                if (Array.isArray(data.recursos)) {
                    setListImg(data.recursos);
                } else {
                    throw new Error('La respuesta de la API no tiene el formato esperado.');
                }
            })
            .catch(error => {
                console.error('Error al enviar los datos:', error);
                alert('Error al enviar los datos');
            });
    };

    useEffect(() => {
        enviarGet();
    }, []);

    const enviarGet = () => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/getresources/${user}/${0}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then((data: { recursos: string[] }) => {
                if (Array.isArray(data.recursos)) {
                    setListImg(data.recursos);
                } else {
                    throw new Error('La respuesta de la API no tiene el formato esperado.');
                }
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    };

    return (
        <div className='container'>
            <div className={styles['container-seephotos']}>
                <div className='col-1 fixed-top d-flex justify-content-center m-5'>
                    <Link to={`/homeuserloggedin/${user}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#0d6efd" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
                        </svg>
                    </Link>
                </div>
                <div className="col-1">
                    <div className='container'>
                        <div className="mb-4">
                            <div className="d-flex flex-row">
                                <div className="dropdown">
                                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                        Albums
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <li onClick={() => handleGategorySelect('0')}>Todos</li>
                                        <li onClick={() => handleGategorySelect('1')}>Fisica</li>
                                        <li onClick={() => handleGategorySelect('2')}>Matematicas</li>
                                        <li onClick={() => handleGategorySelect('3')}>Ciencias Naturales</li>
                                        <li onClick={() => handleGategorySelect('4')}>Lenguaje y Literatura</li>
                                        <li onClick={() => handleGategorySelect('5')}>Historia y Ciencia Sociales</li>
                                        <li onClick={() => handleGategorySelect('6')}>Tecnologia Educativa</li>
                                        <li onClick={() => handleGategorySelect('7')}>Arte y Musica</li>
                                        <li onClick={() => handleGategorySelect('8')}>Educación Fisica y Salud</li>
                                        <li onClick={() => handleGategorySelect('9')}>Idiomas</li>
                                        <li onClick={() => handleGategorySelect('10')}>Educación Ambiental Sostenibilidad</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles['album']}>
                    {listImg && listImg.map((resource, index) => (
                        <Link to={`resource/${resource[0].replace(" ", "_")}`}>
                            <div className={styles['card-img-album']} key={index}>
                                <img src={`${import.meta.env.VITE_S3_URL}/` + resource[1]} alt="" className={styles['card-img-album']} />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SeeResources;