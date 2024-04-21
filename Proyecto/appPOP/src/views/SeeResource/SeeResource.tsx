import styles from './SeeResource.module.scss'
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import like from '../../../src/assets/icons/corazon-vacio-negro.svg'
import likeClick from '../../../src/assets/icons/corazon-lleno-rojo.svg'
import starEmptyYellow from '../../../src/assets/icons/estrella-vacia-amarilla.svg';
import starFilledYellow from '../../../src/assets/icons/estrella-lleno-amarilla.svg';
import starEmptyGrey from '../../../src/assets/icons/estrella-vacia-gris.svg';
import { useState } from 'react';

interface resourceData {
    id: number;
    titulo: string;
    descripcion: string;
    imagen: string;
    like: boolean;
    comentarios: {
        usuario: string;
        punteo: number;
        comentario: string;
    }[];
}

function SeeResource() {
    const { user, iduser, idbook } = useParams();
    const [rating, setRating] = useState(0);
    const [likeResource, setLikeResource] = useState(0);
    const [starSend, setStartSend] = useState(0);
    const [comment,setComment] = useState('');
    const [resourceData, setResourceData] = useState<resourceData | null>(null);

    const changeStateLike = async () => {
        if (likeResource == 0) {
            setLikeResource(1);
        } else {
            setLikeResource(0);
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/favorite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "id_recurso": idbook,
                    "id_usuario": iduser
                }),
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
    }

    const sendComment = async ()=>{
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/comentar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "punteo": starSend,
                    "comentario": comment,
                    "id_recurso":idbook,
                    "id_usuario": iduser
                }),
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
    }

    const handleRatingChange = (newRating: number) => {
        setRating(newRating);
    };

    const resetRating = () => {
        setRating(0);
    };

    const handleSendRating = (rating: number) => {
        setStartSend(rating)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(e.target.value);
    }

    return (
        <div className='container'>
            <div className={styles['container-see-resource']}>
                <div className='col-1 fixed-top d-flex justify-content-center m-5'>
                    <Link to={`/seeresources/${user}/${iduser}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#0d6efd" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
                        </svg>
                    </Link>
                </div>
                <div className='col-5 justify-content-center m-5'>
                    <div className={styles['card-img-book']}>
                        <img src='' alt="" className={styles['img-book']} />
                    </div>
                    <div className='card-body'>
                        <div className={styles['titlle-like']}>
                            <h3 className='card-title'>hola mundo</h3>
                            {likeResource == 1 ? (
                                <img src={likeClick} alt="" id={styles['like']} onClick={changeStateLike} />
                            ) : (
                                <img src={like} alt="" id={styles['like']} onClick={changeStateLike} />
                            )}
                        </div>
                        <p className='card-text'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae dolores perferendis molestiae voluptate beatae, iure maiores necessitatibus sapiente omnis similique, veniam doloribus sed alias aliquam deserunt atque accusantium sequi facilis!</p>
                        <a href="">Link de sitio</a>
                    </div>
                </div>
                <div className='col-1'></div>
                <div className='col-5 justify-content-center m-5'>
                    {likeResource === 1 && (
                        <div>
                            <h2>Comentarios</h2>
                            <div className={styles['caja-comentarios']}>
                                <div className='comentario'>
                                    <h4>user namer</h4>
                                    <div className='calificadas'>
                                        5 estrellas
                                    </div>
                                    <span> comentario </span>
                                    <hr />
                                </div>
                                <div className='comentario'>
                                    <h4>user namer</h4>
                                    <div className='calificadas'>
                                        5 estrellas
                                    </div>
                                    <span> comentario </span>
                                    <hr />
                                </div>
                                <div className='comentario'>
                                    <h4>user namer</h4>
                                    <div className='calificadas'>
                                        5 estrellas
                                    </div>
                                    <span> comentario </span>
                                    <hr />
                                </div>
                                <div className='comentario'>
                                    <h4>user namer</h4>
                                    <div className='calificadas'>
                                        5 estrellas
                                    </div>
                                    <span> comentario </span>
                                    <hr />
                                </div>
                                <div className='comentario'>
                                    <h4>user namer</h4>
                                    <div className='calificadas'>
                                        5 estrellas
                                    </div>
                                    <span> comentario </span>
                                    <hr />
                                </div>
                                <div className='comentario'>
                                    <h4>user namer</h4>
                                    <div className='calificadas'>
                                        5 estrellas
                                    </div>
                                    <span> comentario </span>
                                    <hr />
                                </div>
                                <div className='comentario'>
                                    <h4>user namer</h4>
                                    <div className='calificadas'>
                                        5 estrellas
                                    </div>
                                    <span> comentario </span>
                                    <hr />
                                </div>
                                <div className='comentario'>
                                    <h4>user namer</h4>
                                    <div className='calificadas'>
                                        5 estrellas
                                    </div>
                                    <span> comentario </span>
                                    <hr />
                                </div>

                            </div>
                            <div className={styles['calificacion']}>
                                <ul className={styles['lista-estrellas']} onMouseLeave={resetRating}>
                                    {[1, 2, 3, 4, 5].map((valor) => (
                                        <li key={valor} onClick={() => handleSendRating(valor)} onMouseEnter={() => handleRatingChange(valor)}>
                                            {starSend != 0 ? (
                                                <img
                                                    src={valor <= starSend ? starFilledYellow : starEmptyGrey}
                                                    alt=""
                                                    className={styles['estrella']}
                                                />
                                            ) : (
                                                <img
                                                    src={valor <= rating ? starEmptyYellow : starEmptyGrey}
                                                    alt=""
                                                    className={styles['estrella']}
                                                />
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className=''>
                                <textarea name="" id={styles['caja-comentario']} 
                                    value={comment}
                                    onChange={handleInputChange}
                                    >
                                </textarea>
                                <button className={styles['btn-post']} onClick={sendComment}>
                                    Publicar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SeeResource;