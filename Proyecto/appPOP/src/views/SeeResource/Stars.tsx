import styles from './Stars.module.scss'
import starFilledYellow from '../../../src/assets/icons/estrella-lleno-amarilla.svg';
import starEmptyGrey from '../../../src/assets/icons/estrella-vacia-gris.svg';

interface StarsProps {
    punteo: number;
}

const Stars: React.FC<StarsProps> = ({ punteo }) => {
    return (
        <div className={styles['calificacion']}>
            <ul className={styles['lista-estrellas']}>
                {[1, 2, 3, 4, 5].map((valor) => (
                    <li key={valor}>
                        {valor <= punteo ? (
                            <img
                                src={starFilledYellow}
                                alt=""
                                className={styles['estrella-amarilla']}
                            />
                        ) : (
                            <img
                                src={starEmptyGrey}
                                alt=""
                                className={styles['estrella-gris']}
                            />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Stars