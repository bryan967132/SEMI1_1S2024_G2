import styles from './EditAlbum.module.scss'
import { Link, json } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface UserData {
    activo: number;
    contrasena: string;
    foto: string;
    id: number;
    nombre_completo: string;
    usuario: string;
}

function EditAlbum() {
    const { user } = useParams();
    const [imgSrc, setImgSrc] = useState('');
    const [listAlbums, setListAlbums] = useState<string[]>([]);
    const [selectedAlbum, setSelectedAlbum] = useState('');
    const [userData, setUserData] = useState<UserData | null>(null);
    const [indiceAlbum, setIndiceAlbum] = useState<number | null>(null)

    const [albumNew, setAlbumNew] = useState({
        usuario: user,
        nombre_album: '',
    });

    const [albumEdit, setAlbumEdit] = useState({
        usuario: user,
        id_album: '',
        nombre_album_nuevo: '',
    });

    const [albumDelete, setAlbumDelete] = useState({
        usuario: user,
        nombre_album: '',
    });


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAlbumNew(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };


    const handleAlbumSelect = (albumName: string, index: number) => {
        setAlbumDelete(prevState => ({
            ...prevState,
            nombre_album: albumName,
        }));
        setIndiceAlbum(index);
    };


    const handleAddAlbum = async () => {
        console.log(albumNew.nombre_album)
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/newalbum`, {
                method: 'POST', // o 'PUT' si estás actualizando datos
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(albumNew), // Convierte los datos del formulario a JSON
            });
            if (response.ok) {
                const jsonResponse = await response.json();
                console.log('Respuesta del servidor:', jsonResponse);
                // Procesa la respuesta aquí (por ejemplo, mostrar un mensaje de éxito)
            } else {
                // Maneja la respuesta de error del servidor
                console.error('Error en la respuesta del servidor');
            }
        } catch (error) {
            alert('Error al enviar los datos');
        }
    };

    const handleChangeAlbum = async () => {
        const albumEditComplet = {
            ...albumEdit,
            id_album: indiceAlbum,
            nombre_album: selectedAlbum,
        };
        if (albumEditComplet.id_album !== null) {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/editalbum`, {
                    method: 'POST', // o 'PUT' si estás actualizando datos
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(albumEditComplet), // Convierte los datos del formulario a JSON
                });
                if (response.ok) {
                    const jsonResponse = await response.json();
                    console.log('Respuesta del servidor:', jsonResponse);
                    // Procesa la respuesta aquí (por ejemplo, mostrar un mensaje de éxito)
                } else {
                    // Maneja la respuesta de error del servidor
                    console.error('Error en la respuesta del servidor');
                }
            } catch (error) {
                alert('Error al enviar los datos');
            }
        } else {
            alert('Elija un album para cambiar su nombre')
        }
    };


    const handleDeleteAlbum = async () => {
        console.log(albumDelete.nombre_album)
        if (albumDelete.nombre_album !== '') {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/deletealbum`, {
                    method: 'POST', // o 'PUT' si estás actualizando datos
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(albumDelete), // Convierte los datos del formulario a JSON
                });
                if (response.ok) {
                    const jsonResponse = await response.json();
                    console.log('Respuesta del servidor:', jsonResponse);
                    alert(jsonResponse.mensaje)
                } else {
                    // Maneja la respuesta de error del servidor
                    console.error('Error en la respuesta del servidor');
                }
            } catch (error) {
                alert('Error al enviar los datos');
            }
        } else {
            alert('Elija un album para eliminar')
        }
    };

    useEffect(() => {
        enviarGet();
    }, []);

    const enviarGet = () => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/getalbumes/${user}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                setListAlbums(data)
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    };

    return (
        <div className='container'>
            <div className={styles['container-editalbum']}>
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
                        <Link to={`/homeuserloggedin/${user}`}>
                            <button className='btn btn-outline-primary mb-4'>
                                My profile
                            </button>
                        </Link>
                        <Link to={`/seephotos/${user}`}>
                            <button className='btn btn-outline-primary mb-4'>
                                See photos
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="col-5">
                    <div className='container'>
                        <div className="mb-3">
                            <label htmlFor="album-name" className='form-label'>Album name</label>
                            <input type="text" id='album-name' className='form-control'
                                value={albumNew.nombre_album}
                                name='nombre_album'
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='mb-5'>
                            <button className='btn btn-outline-primary' onClick={handleAddAlbum}>
                                Add
                            </button>
                            <button className='btn btn-outline-primary mx-3' onClick={handleChangeAlbum}>
                                Change
                            </button>
                        </div>
                        <div className="mb-4">
                            <p>Delete album</p>
                            <div className="d-flex flex-row">
                                <div className="dropdown">
                                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                        Albums
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        {listAlbums && listAlbums.map((album, index) => (
                                            <li key={index}>
                                                <a className="dropdown-item" href="#" onClick={() => handleAlbumSelect(album, index)}>{album}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <button className='btn btn-outline-primary mx-3' onClick={handleDeleteAlbum}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditAlbum;