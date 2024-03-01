import { Link } from 'react-router-dom';
import styles from './HomeUserLoggedIn.module.scss'
import { useState } from 'react';
import { useParams } from 'react-router-dom';

function HomeUserLoggedIn() {
    const { username } = useParams();

        return (
            <div className='container'>
                <div className={styles['container-home-profile']}>
                    <div className='col-1 fixed-top d-flex justify-content-center m-5'>
                        <h3>{username}</h3>
                    </div>
                    <div className="col-4">
                        <div className={styles['card-left']}>
                            <div className={styles['card-img']}>
                            </div>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className='container my-4'>
                            <div className="mb-3">
                                <label htmlFor="user-name" className='form-label'>Username</label>
                                <input type="text" id='user-name' className='form-control' disabled />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="full-name" className='form-label'>Name</label>
                                <input type="text" id='full-name' className='form-control' disabled />
                            </div>
                        </div>
                    </div>
                    <div className="col-2">
                        <Link to={`/editprofile/${username}`}>
                            <button className={styles['btn-option']}>
                                Edit profile
                            </button>
                        </Link>
                        <Link to={`/seephotos/${username}`}>
                            <button className={styles['btn-option']}>
                                See photos
                            </button>
                        </Link>
                        <Link to={`/uploadphoto/${username}`}>
                            <button className={styles['btn-option']}>
                                Upload photo
                            </button>
                        </Link>
                        <Link to={`/editalbum/${username}`}>
                            <button className={styles['btn-option']}>
                                Edit Albums
                            </button>
                        </Link>
                        <button className={styles['btn-close-session']}>
                            Close session
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    export default HomeUserLoggedIn;