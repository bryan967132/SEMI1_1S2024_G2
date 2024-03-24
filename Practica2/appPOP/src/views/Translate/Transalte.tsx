import styles from './Translate.module.scss';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function TranslateDescription() {
    const { user } = useParams();
    const [textoOriginal, setTextoOriginal] = useState('');
    const [textoTraducido, setTextoTraducido] = useState('');
    const [albumes, setAlbumes] = useState<string[]>([]);
    const [fotos, setFotos] = useState<string[]>([]);
    const [image, setImage] = useState<string>('');
    const [albumSeleccionado, setAlbumSeleccionado] = useState<string>('');
    const [fotoSeleccionada, setFotoSeleccionada] = useState<string>('');
    const [idiomaSeleccionado, setIdiomaSeleccionado] = useState<string>('');

    
    const handleTraducirClick = async () => {
        try {
            
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/translatePhoto?usuario=${user}&album=${albumSeleccionado}&image=${fotoSeleccionada}&idioma=${idiomaSeleccionado}` ,{
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
            }   );
            if (!response.ok) {
                throw new Error('Error al obtener la traducción');
            }
            const data = await response.json();
            setTextoTraducido(data.texto);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    const handleAlbumSeleccionado = async (album: string) => {
        setAlbumSeleccionado(album)
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getalbumesfotos/${user}/${album}`)
        const data = await response.json()
        setFotos(data.fotos)
    }
    
    const handleFotoSeleccionada = async (foto: string) => {
        setFotoSeleccionada(foto)
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/descriptionPhoto?usuario=${user}&album=${albumSeleccionado}&image=${fotoSeleccionada}` ,{
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
            }   );
            if (!response.ok) {
                throw new Error('Error al obtener la traducción');
            }
            const data = await response.json();
            setImage(`${import.meta.env.VITE_S3_URL}${foto}`)
            setTextoOriginal(data.texto);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleIdiomaSeleccionado = (idioma: string) => {
        setIdiomaSeleccionado(idioma);
    };

    const fetchAlbumes = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getalbumname/${user}`);
            if (!response.ok) {
                throw new Error('Error al obtener los albumes');
            }
            const data = await response.json();
            setAlbumes(data.albumes);
        } catch (error) {
            // console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchAlbumes();
    }, [user]);
    

    return (
        <div className={styles['container']}>
            <div className="col-1 fixed-top d-flex justify-content-center m-5">
                <Link to={`/homeuserloggedin/${user}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#0d6efd" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
                    </svg>
                </Link>
            </div>
            <div className={styles.global}>
                <div className={styles['card-img']}>
                    <img src={image} className={styles['card-img-album']}/>
                </div>
                <div className={styles.group}>
                    <div className={styles.selects}>
                        <div className="dropdown">
                            <button style={{width: '100%'}} className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                Álbum
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                {albumes.map((album, index) => (
                                    <li key={index}>
                                        <button 
                                            className="dropdown-item" 
                                            onClick={() => handleAlbumSeleccionado(album)}
                                        >
                                            {album}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="dropdown">
                            <button style={{width: '100%'}} className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                Foto
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                {fotos.map((album, index) => (
                                    <li key={index}>
                                        <button 
                                            className="dropdown-item" 
                                            onClick={() => handleFotoSeleccionada(album)}
                                        >
                                            {album}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="dropdown">
                            <button style={{width: '100%'}} className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                Idioma
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <li>
                                    <button className="dropdown-item" onClick={() => handleIdiomaSeleccionado('Frances')}>Frances</button>
                                    <button className="dropdown-item" onClick={() => handleIdiomaSeleccionado('Aleman')}>Aleman</button>
                                    <button className="dropdown-item" onClick={() => handleIdiomaSeleccionado('Italiano')}>Italiano</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <button onClick={handleTraducirClick} className="btn btn-primary mt-3">Traducir</button>
                </div>
                <div className={styles['card-text']}>
                    <label> Descripción Original </label>
                    <textarea
                        value={textoOriginal}
                        placeholder="Texto original"
                        className="form-control mb-2"
                        rows={10}
                        readOnly
                    />
                    <label> Descripción Traducida </label>
                    <textarea
                        value={textoTraducido}
                        placeholder="Texto traducido"
                        className="form-control"
                        rows={10}
                        readOnly
                    />
                </div>
            </div>
        </div>
    );
}

export default TranslateDescription;
