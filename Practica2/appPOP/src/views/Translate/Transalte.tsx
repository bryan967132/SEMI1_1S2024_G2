import styles from './Translate.module.scss';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Album {
    nombre: string;
    fotos: string[];
}

function TranslateDescription() {
    const { user } = useParams();
    const [textoOriginal, setTextoOriginal] = useState('');
    const [textoTraducido, setTextoTraducido] = useState('');
    const [albumes, setAlbumes] = useState<string[]>([]);
    const [albumSeleccionado, setAlbumSeleccionado] = useState<string>('');
    const [idiomaSeleccionado, setIdiomaSeleccionado] = useState<string>('');

    
    const handleTraducirClick = async () => {
        try {
            
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/translatePhoto?usuario=${user}&album=${albumSeleccionado}&image=Fotos_Publicadas/caballo.jpg&idioma=${idiomaSeleccionado}`
            ,{
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
    

    const handleIdiomaSeleccionado = (idioma: string) => {
        setIdiomaSeleccionado(idioma);
        setAlbumSeleccionado("Animal");
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
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchAlbumes();
    }, [user]);
    

    return (
        <div className={styles['container']}>
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
                        <div className={styles['card-img']}></div>
                    </div>
                </div>
                <div className="col-1">
                    <div className='container'>
                        <div className="mb-4">
                            <div className="d-flex flex-row">
                                <div className="dropdown">
                                
                                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                        Álbum
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        {albumes.map((album, index) => (
                                            <li key={index}>
                                                <button 
                                                    className="dropdown-item" 
                                                    onClick={() => setAlbumSeleccionado(album)}
                                                >
                                                    {album}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                        
                                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                        Idioma
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <li>
                                            <button className="dropdown-item" onClick={() => handleIdiomaSeleccionado('Frances')}>Frances</button>
                                            <button className="dropdown-item" onClick={() => handleIdiomaSeleccionado('Aleman')}>Aleman</button>
                                            <button className="dropdown-item" onClick={() => handleIdiomaSeleccionado('Italiano')}>Italiano</button>
                                        </li>
                                    </ul>
                                    <button onClick={handleTraducirClick} className="btn btn-primary mt-3">Traducir</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
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
