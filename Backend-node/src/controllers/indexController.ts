import {Request, Response} from 'express';
import pool from '../database'; // conexion base de datos
import { Encriptar,SubirImagenPublicada,SubirImagenPerfil } from '../utilidades';
import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, '..', '.env');
dotenv.config({ path: envPath });

class IndexController{

    //POST: /login
    public async Login(req: Request, res: Response): Promise<void> {
        try {
            const  usuario  = req.body.usuario;
            const  contrasena  = Encriptar(req.body.contrasena);
            pool.query(
                'SELECT u.*, i.photo FROM USER u LEFT JOIN ALBUM a ON u.id = a.userId LEFT JOIN IMAGE i ON a.id = i.albumId WHERE u.user = ? AND u.pass = ? ORDER BY i.id DESC LIMIT 1;',
                [usuario,contrasena], (error, results) => {
                if (results && results.length > 0) {
                    pool.query(
                        'UPDATE USER SET activo = 1 WHERE user = ? AND pass = ?;',
                        [usuario,contrasena]
                        );
                    results[0].photo=process.env.RUTA+results[0].photo;
                    results[0].mensaje="Se inicio sesion"
                    res.json(results[0]);
                }else {
                    //res.status(401).json({ mensaje: 'Usuario o Contraseña Incorrectos' }); 
                    res.json({ mensaje: "Error" });
                }
            });
        } catch (error) {
            //res.status(500).json({ mensaje: 'Error en el proceso de inicio de sesión' });
            res.json({ mensaje: "Error" });
        }
    }

    //POST: /logout
    public async CerrarSesion(req: Request, res: Response):Promise<void>{
        try{
            const usuario = req.body.usuario;
            const UpdateUser = 'UPDATE USER SET activo = 0 WHERE user = ?;';
            
            pool.query(
                UpdateUser,
                [usuario],
                (error) => { 
                    if (error) {
                        //res.status(500).json({ mensaje: 'Error cerrar sesion' });
                        res.json({ mensaje: "Error" });
                        return
                    }
                    res.json({mensaje: 'Se cerro sesion con exito'});    
                });
        } catch (error) {
            //res.status(500).json({ mensaje: 'Error al cerrar sesion' });
            res.json({ mensaje: "Error" });
        }
    }
    
    //POST: /signin
    public async Registrar(req: Request, res: Response): Promise<void> {
        try {
            const  usuario  = req.body.usuario;
            const  nombre  = req.body.nombre;
            const  contrasena  = Encriptar(req.body.contrasena);
            const  foto  = req.body.foto; 
            const InsertUser = 'INSERT INTO USER (user, pass, fullName, activo) VALUES (?, ?, ?, ?);';
            const InsertAlbum = 'INSERT INTO ALBUM (albumName, userId) VALUES (?,?)';
            const InsertImage = 'INSERT INTO IMAGE (photo, albumId) VALUES (?, ?);';
            const url=SubirImagenPerfil(foto,"foto1");
            pool.query( //insert user
                InsertUser, 
                [usuario,contrasena,nombre,0], (error,userResult) => {
                    if (error){
                        //res.status(500).json({ mensaje: 'Error en el proceso de registro de usuario' });
                        res.json({ mensaje: "Error" });
                        return
                    }
                    const userId = userResult.insertId;

                    pool.query( //insert album
                        InsertAlbum, 
                        ['Foto de perfil',userId], (error,albumResult) => {
                            if (error){
                                //res.status(500).json({ mensaje: 'Error en el proceso de registro de usuario' });
                                res.json({ mensaje: "Error" });
                                return
                            }
                            const albumId = albumResult.insertId;

                            pool.query( //insert foto de perfil
                                InsertImage, 
                                [url,albumId], (error) => {
                                    if (error){
                                        //res.status(500).json({ mensaje: 'Error en el proceso de registro de usuario' });
                                        res.json({ mensaje: "Error" });
                                        return
                                    }
                            }); 
                        });
                    res.json({ mensaje: 'Usuario Creado' })
            });
        } catch (error) {
            //res.status(500).json({ mensaje: 'Error en el proceso de registro de usuario' });
            res.json({ mensaje: "Error" });
        }
    }

    //GET: /home
    public async Home(req: Request, res: Response): Promise<void> {
        try {
            const  usuario  = req.params.usuario;
            pool.query(
                'SELECT u.*, i.photo FROM USER u LEFT JOIN ALBUM a ON u.id = a.userId LEFT JOIN IMAGE i ON a.id = i.albumId WHERE u.user = ? ORDER BY i.id DESC LIMIT 1;',
                [usuario],(error, results) => {
                if (results && results.length > 0) {
                    results[0].photo=process.env.RUTA+results[0].photo;
                    results[0].mensaje="Se obtuvo los datos del usuario"
                    res.json(results[0]);
                } else {
                    //res.json({ mensaje: "Error: No se encontro el usuario" });
                    res.json({ mensaje: "Error" });
                }
            });
        } catch (error) {
            //res.status(500).json({ mensaje: 'Error al obtener usuarios' });
            res.json({ mensaje: "Error" });
        }
    }

    //UPDATE: /edituser
    public async EditarUsuario(req: Request, res: Response):Promise<void>{
        try{
            const id_usuario = req.body.id_usuario;
            const usuario_nuevo = req.body.usuario_nuevo;
            const nombre = req.body.nombre;
            const contrasena = Encriptar(req.body.contrasena);
            const foto = req.body.foto;
            const UpdateUser = 'UPDATE USER SET user = ?, pass = ?, fullName = ? WHERE id = ?';
            var nombre_foto,url;
            pool.query( 
                "SELECT count(i.id) AS ultimo_id FROM IMAGE i INNER JOIN ALBUM a ON i.albumId = a.id WHERE a.userId = 23 AND a.albumName = 'Foto de perfil';",
                [id_usuario,"Foto de perfil"],(errom,rcont)=>{
                    nombre_foto=usuario_nuevo+"-foto"+(rcont[0].ultimo_id + 1)
                    console.log(nombre_foto);
                    url=SubirImagenPerfil(foto,nombre_foto)
                //insertar la nueva foto
                pool.query( 
                    "INSERT INTO IMAGE (photo, albumId) SELECT ?, a.id FROM ALBUM a INNER JOIN USER u ON a.userId = u.id WHERE u.id = ? AND a.albumName = ?;",
                    [url,id_usuario,"Fotos de perfil"]
                );
            });
            pool.query(
                UpdateUser,
                [usuario_nuevo,contrasena,nombre,id_usuario],
                (error) => { 
                    if (error) {
                        //res.status(500).json({ mensaje: 'Error al actulizar el usuario' });
                        res.json({ mensaje: "Error" });
                        return
                    }
                    res.json({mensaje: 'Usuario Actualizado'});
                });
        } catch (error) {
            //res.status(500).json({ mensaje: 'Error al actualizar el usuario' });
            res.json({ mensaje: "Error" });
        }
    }

    //POST: /uploadphoto
    public async SubirFoto(req: Request, res: Response):Promise<void>{
        try{
            const usuario = req.body.usuario;
            const nombre_foto = req.body.nombre_foto;
            const nombre_album = req.body.nombre_album;
            const foto = req.body.foto; //la recibo en base64 
            const InsertFoto = 'INSERT INTO IMAGE (photo, albumId) SELECT ?, a.id FROM ALBUM a INNER JOIN USER u ON a.userId = u.id WHERE u.user = ? AND a.albumName = ?;';
            const url=SubirImagenPublicada(foto,nombre_foto);
            pool.query(
                InsertFoto,
                [url,usuario,nombre_album],
                (error) => { 
                    if (error) {
                        //res.status(500).json({ mensaje: 'Error al insertar la foto' });
                        res.json({ mensaje: "Error" });
                        return
                    }
                    res.json({mensaje: 'Foto insertada'});    
                });
        } catch (error) {
            //res.status(500).json({ mensaje: 'Error al actualizar el usuario' });
            res.json({ mensaje: "Error" });
        }
    }

    //POST: /newalbum   
    public async NuevoAlbum(req: Request, res: Response):Promise<void>{
        try{
            const usuario = req.body.usuario;
            const nombre_album = req.body.nombre_album;
            const NuevoAlbum = 'INSERT INTO ALBUM (userId, albumName) VALUES ((SELECT id FROM USER WHERE user = ?), ?)';
            
            pool.query(
                NuevoAlbum,
                [usuario,nombre_album],
                (error) => { 
                    if (error) {
                        //res.status(500).json({ mensaje: 'Error al crear un nuevo album' });
                        res.json({ mensaje: "Error" });
                        return
                    }
                    res.json({mensaje: 'Album creado exitosamente'});    
                });
        } catch (error) {
            //res.status(500).json({ mensaje: 'Error al crear un nuevo album' });
            res.json({ mensaje: "Error" });
        }
    }

    //UPDATE: /editalbum
    public async EditarAlbum(req: Request, res: Response):Promise<void>{
        try{
            const id_usuario = req.body.id_usuario;
            const id_album = req.body.id_album;
            const nombre_album_nuevo = req.body.nombre_album_nuevo;
            const EditarAlbum = 'UPDATE ALBUM SET albumName = ? WHERE userId = ? AND id = ?;';
            
            pool.query(
                EditarAlbum,
                [nombre_album_nuevo,id_usuario,id_album],
                (error) => { 
                    if (error) {
                        //res.status(500).json({ mensaje: 'Error al editar el album' });
                        res.json({ mensaje: "Error" });
                        return
                    }
                    res.json({mensaje: 'Album editado exitosamente'});    
                });
        } catch (error) {
            //res.status(500).json({ mensaje: 'Error al editar el album' });
            res.json({ mensaje: "Error" });
        }
    }


    //DELETE: /deletealbum
    public async EliminarAlbum(req: Request, res: Response): Promise<void> {
        try{
            const usuario = req.body.usuario;
            const nombre_album = req.body.nombre_album;
            const ObtenerImagenes = `SELECT id FROM IMAGE WHERE albumId IN (SELECT id FROM ALBUM WHERE userId = (SELECT id FROM USER WHERE user = ?) AND albumName = ?);`;
            const EliminarImagen = `DELETE FROM IMAGE WHERE id = ?;`;
            const EliminarAlbum = `DELETE FROM ALBUM WHERE albumName = ? AND userId = (SELECT id FROM USER WHERE user = ?); `;
    
            pool.query(ObtenerImagenes, [usuario, nombre_album], async (error, resultados) => {
                if (error) {
                    console.log(error);
                    //res.status(500).json({ mensaje: 'Error al obtener las imágenes del álbum' });
                    res.json({ mensaje: "Error" });
                    return;
                }
                for (const imagen of resultados) {
                    await new Promise((resolve, reject) => {
                        pool.query(EliminarImagen, [imagen.id], (error) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve();
                            }
                        });
                    });
                }
                pool.query(EliminarAlbum, [nombre_album, usuario], (error) => {
                    if (error) {
                        //res.status(500).json({ mensaje: 'Error al eliminar el álbum' });
                        res.json({ mensaje: "Error" });
                    } else {
                        res.json({ mensaje: 'Álbum eliminado exitosamente' });
                    }
                });
            });
        } catch (error) {
            //res.status(500).json({ mensaje: 'Error al eliminar el álbum' });
            res.json({ mensaje: "Error" });
        }
    }
    

    //GET /getalbumname - (Para select de albumes):
    public async GetAlbums(req: Request, res: Response): Promise<void> {
        try {
            const usuario = req.body.usuario;


            pool.query(
                'SELECT a.* FROM ALBUM a INNER JOIN USER u ON a.userId = u.id  WHERE u.user = ?;',
                [usuario],(error, results) => {
                    if (error) {
                        //res.status(500).json({ mensaje: 'Error al obtener los albums' });
                        res.json({ mensaje: "Error" });
                        return
                    }
                    if (results && results.length > 0) {
                        
                        const albums = [];
                        results.forEach((row) => {
                            albums.push(row.albumName);
                        });
                        const datosReturn = {
                            "fotos": albums,
                            "mensaje":"Se obtuvo los albumnes del usuario "
                        };
                        res.json(datosReturn);
                        
                    } else {
                        //res.json({ mensaje: "No se encontraron albums" });
                        res.json({ mensaje: "Error" });
                    }
            });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener usuarios' });
        }
    }

    //GET: /getalbumes
    public async GetAlbumsFoto(req: Request, res: Response): Promise<void> {
        try {
            const usuario = req.body.usuario;

            pool.query(
                'SELECT a.albumName, i.photo FROM ALBUM a INNER JOIN USER u ON a.userId = u.id LEFT JOIN IMAGE i ON a.id = i.albumId WHERE u.user = ?;',
                [usuario],(error, results) => {
                    if (error) {
                        //res.status(500).json({ mensaje: 'Error al obtener los albums' });
                        res.json({ mensaje: "Error" });
                        return
                    }
                    if (results && results.length > 0) {
                        
                        res.json({"albumes": results});
                    } else {
                        //res.json({ mensaje: "No se encontraron albums" });
                        res.json({ mensaje: "Error" });
                    }
            });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error' });
        }
    }

     //GET: /getalbumesfotos
     public async GetAlbumesFotos(req: Request, res: Response): Promise<void> {
        try {
            const usuario = req.body.usuario;
            const album = req.body.album;

            pool.query(
                'SELECT i.* FROM IMAGE i INNER JOIN ALBUM a ON i.albumId = a.id INNER JOIN USER u ON a.userId = u.id WHERE u.user = ? AND a.albumName = ?;',
                [usuario,album],(error, results) => {
                    if (error) {
                        //res.status(500).json({ mensaje: 'Error al obtener los albums' });
                        res.json({ mensaje: "Error" });
                        return
                    }
                    if (results && results.length > 0) {
                        const fotos = [];
                        results.forEach((row) => {
                            fotos.push(row.photo);
                        });

                        const datosReturn = {
                            "fotos": fotos,
                            "mensaje":"Se obtuvo las imagenes del album "
                        };
                        res.json(datosReturn);
                        

                    } else {
                        //res.json({ mensaje: "No se encontraron albums" });
                        res.json({ mensaje: "Error" });
                    }
            });
        } catch (error) {
            //res.status(500).json({ mensaje: 'Error al obtener usuarios' });
            res.status(500).json({ mensaje: 'Error' });
        }
    }

    public async GetUsuario(req: Request, res: Response): Promise<void> {
        try {
            pool.query('SELECT * FROM IMAGE WHERE albumId=21', (error, results) => {
                if (results && results.length > 0) {
                    res.json(results);
                } else {
                    res.json({ mensaje: "No se encontraron usuarios" });
                }
            });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener usuarios' });
        }
    }

}

export const indexController = new IndexController();
