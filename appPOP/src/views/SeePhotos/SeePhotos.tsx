import styles from './SeePhotos.module.scss'
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

function SeePhotos() {
    const { username } = useParams();
    const [listAlbums, setListAlbums] = useState(['opcion 1', 'opcion 2', 'opcion 3']);
    const [selectedAlbum, setSelectedAlbum] = useState('');
    const [listImg, setListImg] = useState(['img 1', 'img 2', 'img 3', 'img 2', 'img 3',  'img 2', 'img 3']);
    const [formData, setFormData] = useState({
        usuario:username,
        nombre_album:'',
    });

    const handleAlbumSelect = (albumName: string) => {
        setSelectedAlbum(albumName);
        fetch('https://tu-backend.example.com/api/ruta', {
            method: 'POST', // o 'PUT' si estás actualizando datos
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData), // Convierte los datos del formulario a JSON
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error en la respuesta del servidor');
            }
        })
        .then(jsonResponse => {
            console.log('Respuesta del servidor:', jsonResponse);
            // Procesa la respuesta aquí (por ejemplo, mostrar un mensaje de éxito)
        })
        .catch(error => {
            console.error('Error al enviar los datos:', error);
            alert('Error al enviar los datos');
        });
    };    

    return (
        <div className='container'>
            <div className={styles['container-seephotos']}>
                <div className="col-1 fixed-top d-flex justify-content-center m-5">
                    <Link to='/homeuserloggedin'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#0d6efd" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
                        </svg>
                    </Link>
                </div>
                <div className="col-4">
                    <div className={styles['card-left']}>
                        <div className={styles['card-img']}>
                        </div>
                        <Link to='/uploadphoto'>
                            <button className='btn btn-outline-primary mb-4'>
                                Upload photo
                            </button>
                        </Link>
                        <Link to='/editalbum'>
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
                                        {listAlbums.filter(album => album.trim() !== '').map((album, index) => (
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
                    {listImg.filter(img => img.trim() !== '').map((img, index) => (
                        <div className={styles['card-img-album']} key={index}>
                            <img src={img} alt="" className={styles['card-img-album']} />
                        </div>
                    ))}
                    
                    <div className={styles['card-img-album']}></div>
                    <div className={styles['card-img-album']}></div>
                    <div className={styles['card-img-album']}></div>
                    <div className={styles['card-img-album']}></div>
                    <div className={styles['card-img-album']}></div>
                    <div className={styles['card-img-album']}></div>
                    <div className={styles['card-img-album']}></div>
                    <div className={styles['card-img-album']}></div>
                    <div className={styles['card-img-album']}></div>
                    <div className={styles['card-img-album']}></div>
                    <div className={styles['card-img-album']}></div>
                    <div className={styles['card-img-album']}></div>
                    <div className={styles['card-img-album']}></div>
                    <div className={styles['card-img-album']}></div>
                    <div className={styles['card-img-album']}></div>
                    <div className={styles['card-img-album']}></div>
                    <div className={styles['card-img-album']}></div>
                    <div className={styles['card-img-album']}></div>
                    <div className={styles['card-img-album']}></div>
                    <div className={styles['card-img-album']}></div>
                    <div className={styles['card-img-album']}></div>
                    <div className={styles['card-img-album']}></div>
                    <div className={styles['card-img-album']}></div>
                </div>
            </div>
        </div>
    )
}

export default SeePhotos;