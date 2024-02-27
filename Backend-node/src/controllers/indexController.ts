import {Request, Response} from 'express';
import pool from '../database'; // conexion base de datos

class IndexController{

    index (req: Request, res: Response){
        res.send('Hola Mundo')
    }



    /*
    public async Login(req: Request, res: Response): Promise<void> {
        try {
            const { usuario } = req.body;
            const { contrasena } = req.body;
            // Realiza la consulta 
            pool.query(
                '',
                [usuario,contrasena], (error, results) => {
                // Verifica si hay resultados en el array devuelto
                if (results && results.length > 0) {
                    res.json(results[0]);
                } else {
                    res.status(401).json({ message: 'Usuario o Contraseña Incorrectos' }); 
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Error en el proceso de inicio de sesión' });
        }
    }
    */
    
    /*
    public async GetUsuario(req: Request, res: Response): Promise<void> {
        try {
            pool.query('SELECT user FROM USER',(error, results) => {
                // Verifica si hay resultados
                if (results && results.length > 0) {
                    res.json(results[0]);
                } else {
                    res.json({message: "Error no se encontro el usuario"});
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener usuarios' });
        }
    }
    */

}

export const indexController = new IndexController();
