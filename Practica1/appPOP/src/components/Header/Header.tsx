import { Outlet, Link } from "react-router-dom";
import styles from './Header.module.scss'
import logo from '../../../src/assets/img/logo.png'

function Header() {
    return (
        <div>
            <nav className={"navbar navbar-expand-lg bg-body-tertiary"}>
                <div className="container-fluid">
                    <Link className="navbar-brand" to='/'>
                        <img src={logo} alt="logo" className={styles.logo} />
                    </Link>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to='/'>Home</Link>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Features</a>
                            </li>
                        </ul>
                    </div>
                    <div className="d-flex" role="search">
                        <Link to='/login'>
                            <button type="button" className={styles['custom-btn-sucess']}>
                                Login
                            </button>
                        </Link>

                        <Link to='/signup'>
                            <button type="button" className={styles['custom-btn-secondary']}>
                                Sign Up
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>
            <Outlet />
        </div>
    )
}

export default Header;