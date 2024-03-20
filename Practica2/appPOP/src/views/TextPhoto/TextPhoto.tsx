import styles from './TextPhoto.module.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

function TextPhoto() {
    const { user } = useParams();
    const [imgSrc, setImgSrc] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [text, setText] = useState('');
    const [formData, setFormData] = useState({
        photo: '',
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result?.toString().split(",")[1];
                setImgSrc(reader.result as string);
                setSelectedFile(file);
                setFormData(prevState => ({
                    ...prevState,
                    photo: base64String || '',
                }));
            };
            reader.readAsDataURL(file);
        }
    }

    const handleTextPhoto = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        const formDataWithFile = {
            ...formData
        };
        if (formDataWithFile.photo !== null) {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/phototext`, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formDataWithFile),
                });
                if (response.ok) {
                    const jsonResponse = await response.json();
                    console.log('Respuesta del servidor:', jsonResponse);
                    setText(jsonResponse.texto);
                } else {
                    console.error('Error en la respuesta del servidor');
                }
            } catch (error) {
                alert('Error al enviar los datos');
            }
        } else {
            alert('Elija una foto')
        }
    };

    return (
        <div className='container'>
            <form action="" onSubmit={handleTextPhoto}>
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
                            <label htmlFor="imgPhoto" className='btn btn-outline-primary mb-4'> Selecionar foto </label>
                            <input type="file" id='imgPhoto' className={styles.hiddenInput} accept='.jpg, .jpeg, .png' name='fichero'
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                    <div className="col-5">
                        <div className='container'>
                            <div className="mb-4">
                            <label htmlFor="photo-description" className='form-label'>Texto</label>
                            <textarea id='photo-description' className='form-control' 
                                value={text}
                                rows={10}
                                readOnly 
                                />
                            </div>
                        </div>
                        <div>
                            <button className='btn btn-outline-primary mx-2'>
                                Analizar
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default TextPhoto;
