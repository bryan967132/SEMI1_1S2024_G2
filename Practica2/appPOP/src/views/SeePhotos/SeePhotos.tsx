import styles from './SeePhotos.module.scss'
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function SeePhotos() {
    const { user } = useParams();
    const [listAlbums, setListAlbums] = useState<string[]>([]);
    const [listImg, setListImg] = useState<string[]>([]);

    const handleAlbumSelect = (albumName: string) => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/getalbumesfotos/${user}/${albumName}`, {
            method: 'GET', // o 'PUT' si estás actualizando datos
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
            .then((data: { fotos: string[] })=> {
                if (Array.isArray(data.fotos)) {
                    setListImg(data.fotos);
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
        fetch(`${import.meta.env.VITE_BACKEND_URL}/getalbumname/${user}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then((data: { albumes: string[] })=> {
                if (Array.isArray(data.albumes)) {
                    setListAlbums(data.albumes);
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
                <div className="col-1 fixed-top d-flex justify-content-center m-5">
                    <Link to={`/homeuserloggedin/${user}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#0d6efd" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
                        </svg>
                    </Link>
                </div>
                <div className="col-4">
                    <div className={styles['card-left']}>
                        <div className={styles['card-img']}>
                        </div>
                        <Link to={`/uploadphoto/${user}`}>
                            <button className='btn btn-outline-primary mb-4'>
                                Upload photo
                            </button>
                        </Link>
                        <Link to={`/editalbum/${user}`}>
                            <button className='btn btn-outline-primary mb-4'>
                                Edit album
                            </button>
                        </Link>
                    </div>
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
                                        {listAlbums && listAlbums.map((album, index) => (
                                            <li key={index}>
                                                <a className="dropdown-item" href="#" onClick={() => handleAlbumSelect(album)}>{album}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles['album']}>
                    {listImg && listImg.map((img, index) => (
                        <div className={styles['card-img-album']} key={index}>
                            <img src={`${import.meta.env.VITE_S3_URL}`+img} alt="" className={styles['card-img-album']} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SeePhotos;