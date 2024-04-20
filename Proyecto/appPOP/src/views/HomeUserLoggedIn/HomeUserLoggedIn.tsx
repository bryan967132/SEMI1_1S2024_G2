import { Link } from 'react-router-dom';
import styles from './HomeUserLoggedIn.module.scss';
import { useState, useEffect } from 'react'; // Importa useState y useEffect juntos
import { useParams } from 'react-router-dom';

interface UserData {
    activo: number;
    fullName: string;
    id: number;
    pass: string;
    photo: string;
    user: string;
    img_details: string[];
}

function HomeUserLoggedIn() {
    const { user } = useParams();
    const [userData, setUserData] = useState<UserData | null>(null);
    const dataUser = {
        usuario: user,
    };

    const handleClose = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataUser),
            });
            if (response.ok) {
                const jsonResponse = await response.json();
                console.log('Respuesta del servidor:', jsonResponse);
                window.location.href = `/login`;
            } else {
                // Maneja la respuesta de error del servidor
                console.error('Error en la respuesta del servidor');
            }
        } catch (error) {
            alert('Error al enviar los datos');
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
                setUserData(data)
                console.log(data)
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    };

    return (
        <div className='container'>
            {userData && userData.activo === 1 ? (
                <div className={styles['container-home-profile']}>
                    <div className='col-1 fixed-top d-flex justify-content-center m-5'>
                        <h3>{user}</h3>
                    </div>
                    <div className="col-4">
                        <div className={styles['card-left']}>
                            <div className={styles['card-img']}>
                                <img src={`${import.meta.env.VITE_S3_URL}/` + userData?.photo || ''} alt="" />
                            </div>
                        </div>
                        <div className={styles['details']}>
                            {userData.img_details.map((detail, index) => (
                                <div key={index}>{detail}</div>
                            ))}
                        </div>
                    </div>
                    <div className="col-4">
                        <div className='container my-4'>
                            <div className="mb-3">
                                <label htmlFor="user-name" className='form-label'>Username</label>
                                <input type="text" id='user-name' className='form-control' value={userData?.user || ''} disabled />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="full-name" className='form-label'>Name</label>
                                <input type="text" id='full-name' className='form-control' value={userData?.fullName || ''} disabled />
                            </div>
                        </div>
                    </div>
                    <div className="col-2">
                        <Link to={`/editprofile/${user}`}>
                            <button className={styles['btn-option']}>
                                Edit profile
                            </button>
                        </Link>
                        <Link to={`/seeresources/${user}`}>
                            <button className={styles['btn-option']}>
                                See resources
                            </button>
                        </Link>
                        <Link to={`/uploadphoto/${user}`}>
                            <button className={styles['btn-option']}>
                                Upload photo
                            </button>
                        </Link>
                        <Link to={`/editalbum/${user}`}>
                            <button className={styles['btn-option']}>
                                Edit Albums
                            </button>
                        </Link>
                        <Link to={`/textphoto/${user}`}>
                            <button className={styles['btn-option']}>
                                Text Photo
                            </button>
                        </Link>
                        <Link to={`/translate/${user}`}>
                            <button className={styles['btn-option']}>
                                Translate
                            </button>
                        </Link>
                        <Link to={`/chatbot/${user}`}>
                            <button className={styles['btn-option']}>
                                ChatBot
                            </button>
                        </Link>
                        <button className={styles['btn-close-session']} onClick={handleClose}>
                            Close session
                        </button>
                    </div>
                </div>
            ) : (
                <p>Cargando datos...</p>
            )}
        </div>
    );
}

export default HomeUserLoggedIn;
