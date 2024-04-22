import styles from './SeeFavorite.module.scss';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function SeeFavorite() {
    const { user } = useParams();
    const [listImg, setListImg] = useState<any[]>([]);
    const [selectedImg, setSelectedImg] = useState<any>(null);
    const [selectedImgUrl, setSelectedImgUrl] = useState<string | null>(null);

    useEffect(() => {
        enviarGet();
    }, []);

    const enviarGet = () => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/mis_favoritos/${user}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Se perdio la conexion');
            })
            .then((data: { favoritos: any[] }) => {
                setListImg(data.favoritos);
            })
            .catch(error => {
                console.error('Error', error);
            });
    };

    const handleImageClick = (img: any) => {
        setSelectedImg(img);
        setSelectedImgUrl(img[6]); 
    };

    const handleButtonPress = () => {
        if (selectedImgUrl) {
            window.open(selectedImgUrl, '_blank'); 
        }
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
                        {selectedImg && (
                            <div className={styles['selected-img']}>
                                <img src={`${import.meta.env.VITE_S3_URL}/${selectedImg[4]}`} alt="" className={styles['selected-img']} />
                            </div>
                        )}
                        <div>
                            <button onClick={handleButtonPress} disabled={!selectedImgUrl} className={`btn btn-primary ${styles['button']}`}>Abrir libro</button>
                        </div>
                    </div>
                </div>
                <div className={styles['album']}>
                    {listImg && listImg.map((img, index) => (
                        <div className={styles['card-img-album']} key={index}>
                            <img 
                                src={`${import.meta.env.VITE_S3_URL}/${img[4]}`} 
                                alt="" 
                                className={styles['card-img-album']}
                                onClick={() => handleImageClick(img)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SeeFavorite;
