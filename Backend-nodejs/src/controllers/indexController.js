const { Request, Response } = require('express');
const pool = require('../database'); // conexión a la base de datos
const { Encriptar, SubirImagenPublicada, SubirImagenPerfil } = require('../utilidades');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

class IndexController {
    async Balenciador(req, res) {
        res.json({ "response": "server is running!!" });
    }
    async Login(req, res) {
        try {
            const usuario = req.body.usuario;
            const contrasena = Encriptar(req.body.contrasena);
            pool.query(
                'SELECT u.*, i.photo FROM USER u LEFT JOIN ALBUM a ON u.id = a.userId LEFT JOIN IMAGE i ON a.id = i.albumId WHERE u.user = ? AND u.pass = ? ORDER BY i.id DESC LIMIT 1;',
                [usuario, contrasena], (error, results) => {
                    if (results && results.length > 0) {
                        pool.query(
                            'UPDATE USER SET activo = 1 WHERE user = ? AND pass = ?;',
                            [usuario, contrasena]
                        );
                        results[0].photo = process.env.RUTA + results[0].photo;
                        results[0].mensaje = "Se inició sesión";
                        res.json(results[0]);
                    } else {
                        res.json({ mensaje: "Error" });
                    }
                });
        } catch (error) {
            res.json({ mensaje: "Error" });
        }
    }

    async CerrarSesion(req, res) {
        try {
            const usuario = req.body.usuario;
            const UpdateUser = 'UPDATE USER SET activo = 0 WHERE user = ?;';
            pool.query(
                UpdateUser,
                [usuario],
                (error) => {
                    if (error) {
                        res.json({ mensaje: "Error" });
                        return;
                    }
                    res.json({ mensaje: 'Se cerró sesión con éxito' });
                });
        } catch (error) {
            res.json({ mensaje: "Error" });
        }
    }

    async Registrar(req, res) {
        try {
            const usuario = req.body.usuario;
            const nombre = req.body.nombre;
            const contrasena = Encriptar(req.body.contrasena);
            const foto = req.body.foto;
            const InsertUser = 'INSERT INTO USER (user, pass, fullName, activo) VALUES (?, ?, ?, ?);';
            const InsertAlbum = 'INSERT INTO ALBUM (albumName, userId) VALUES (?,?)';
            const InsertImage = 'INSERT INTO IMAGE (photo, albumId) VALUES (?, ?);';
            const url = SubirImagenPerfil(foto, "foto1");
            pool.query(
                InsertUser,
                [usuario, contrasena, nombre, 0], (error, userResult) => {
                    if (error) {
                        res.json({ mensaje: "Error" });
                        return;
                    }
                    const userId = userResult.insertId;

                    pool.query(
                        InsertAlbum,
                        ['Foto de perfil', userId], (error, albumResult) => {
                            if (error) {
                                res.json({ mensaje: "Error" });
                                return;
                            }
                            const albumId = albumResult.insertId;

                            pool.query(
                                InsertImage,
                                [url, albumId], (error) => {
                                    if (error) {
                                        res.json({ mensaje: "Error" });
                                        return;
                                    }
                                });
                        });
                    res.json({ mensaje: 'Usuario Creado' })
                });
        } catch (error) {
            res.json({ mensaje: "Error" });
        }
    }

    async Home(req, res) {
        try {
            const usuario = req.params.usuario;
            pool.query(
                'SELECT u.*, i.photo FROM USER u LEFT JOIN ALBUM a ON u.id = a.userId LEFT JOIN IMAGE i ON a.id = i.albumId WHERE u.user = ? ORDER BY i.id DESC LIMIT 1;',
                [usuario], (error, results) => {
                    if (error) {
                        res.json({ mensaje: "Error" });
                        return;
                    }
                    if (results && results.length > 0) {
                        results[0].photo = process.env.RUTA + results[0].photo;
                        results[0].mensaje = "Se obtuvo los datos del usuario";
                        res.json(results[0]);
                    } else {
                        res.json({ mensaje: "Error" });
                    }
                });
        } catch (error) {
            res.json({ mensaje: "Error" });
        }
    }

    async EditarUsuario(req, res) {
        try {
            const id_usuario = req.body.id_usuario;
            const usuario_nuevo = req.body.usuario_nuevo;
            const nombre = req.body.nombre;
            const contrasena = Encriptar(req.body.contrasena);
            const foto = req.body.foto;
            const UpdateUser = 'UPDATE USER SET user = ?, pass = ?, fullName = ? WHERE id = ?';
            var nombre_foto, url;
            pool.query(
                "SELECT count(i.id) AS ultimo_id FROM IMAGE i INNER JOIN ALBUM a ON i.albumId = a.id WHERE a.userId = 23 AND a.albumName = 'Foto de perfil';",
                [id_usuario, "Foto de perfil"], (errom, rcont) => {
                    nombre_foto = usuario_nuevo + "-foto" + (rcont[0].ultimo_id + 1)
                    console.log(nombre_foto);
                    url = SubirImagenPerfil(foto, nombre_foto)
                    pool.query(
                        "INSERT INTO IMAGE (photo, albumId) SELECT ?, a.id FROM ALBUM a INNER JOIN USER u ON a.userId = u.id WHERE u.id = ? AND a.albumName = ?;",
                        [url, id_usuario, "Fotos de perfil"]
                    );
                });
            pool.query(
                UpdateUser,
                [usuario_nuevo, contrasena, nombre, id_usuario],
                (error) => {
                    if (error) {
                        res.json({ mensaje: "Error" });
                        return;
                    }
                    res.json({ mensaje: 'Usuario Actualizado' });
                });
        } catch (error) {
            res.json({ mensaje: "Error" });
        }
    }

    async SubirFoto(req, res) {
        try {
            const usuario = req.body.usuario;
            const nombre_foto = req.body.nombre_foto;
            const nombre_album = req.body.nombre_album;
            const foto = req.body.foto;
            const InsertFoto = 'INSERT INTO IMAGE (photo, albumId) SELECT ?, a.id FROM ALBUM a INNER JOIN USER u ON a.userId = u.id WHERE u.user = ? AND a.albumName = ?;';
            const url = SubirImagenPublicada(foto, nombre_foto);
            pool.query(
                InsertFoto,
                [url, usuario, nombre_album],
                (error) => {
                    if (error) {
                        res.json({ mensaje: "Error" });
                        return;
                    }
                    res.json({ mensaje: 'Foto insertada' });
                });
        } catch (error) {
            res.json({ mensaje: "Error" });
        }
    }

    async NuevoAlbum(req, res) {
        try {
            const usuario = req.body.usuario;
            const nombre_album = req.body.nombre_album;
            const NuevoAlbum = 'INSERT INTO ALBUM (userId, albumName) VALUES ((SELECT id FROM USER WHERE user = ?), ?)';
            pool.query(
                NuevoAlbum,
                [usuario, nombre_album],
                (error) => {
                    if (error) {
                        res.json({ mensaje: "Error" });
                        return;
                    }
                    res.json({ mensaje: 'Álbum creado exitosamente' });
                });
        } catch (error) {
            res.json({ mensaje: "Error" });
        }
    }

    async EditarAlbum(req, res) {
        try {
            const id_usuario = req.body.id_usuario;
            const id_album = req.body.id_album;
            const nombre_album_nuevo = req.body.nombre_album_nuevo;
            const EditarAlbum = 'UPDATE ALBUM SET albumName = ? WHERE userId = ? AND id = ?;';
            pool.query(
                EditarAlbum,
                [nombre_album_nuevo, id_usuario, id_album],
                (error) => {
                    if (error) {
                        res.json({ mensaje: "Error" });
                        return;
                    }
                    res.json({ mensaje: 'Álbum editado exitosamente' });
                });
        } catch (error) {
            res.json({ mensaje: "Error" });
        }
    }

    async EliminarAlbum(req, res) {
        try {
            const usuario = req.body.usuario;
            const nombre_album = req.body.nombre_album;
            const ObtenerImagenes = `SELECT id FROM IMAGE WHERE albumId IN (SELECT id FROM ALBUM WHERE userId = (SELECT id FROM USER WHERE user = ?) AND albumName = ?);`;
            const EliminarImagen = `DELETE FROM IMAGE WHERE id = ?;`;
            const EliminarAlbum = `DELETE FROM ALBUM WHERE albumName = ? AND userId = (SELECT id FROM USER WHERE user = ?); `;

            pool.query(ObtenerImagenes, [usuario, nombre_album], async (error, resultados) => {
                if (error) {
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
                        res.json({ mensaje: "Error" });
                    } else {
                        res.json({ mensaje: 'Álbum eliminado exitosamente' });
                    }
                });
            });
        } catch (error) {
            res.json({ mensaje: "Error" });
        }
    }

    async GetAlbums(req, res) {
        try {
            const usuario = req.body.usuario;

            pool.query(
                'SELECT a.* FROM ALBUM a INNER JOIN USER u ON a.userId = u.id  WHERE u.user = ?;',
                [usuario], (error, results) => {
                    if (error) {
                        res.json({ mensaje: "Error" });
                        return;
                    }
                    if (results && results.length > 0) {

                        const albums = [];
                        results.forEach((row) => {
                            albums.push(row.albumName);
                        });
                        const datosReturn = {
                            "fotos": albums,
                            "mensaje": "Se obtuvo los albumnes del usuario "
                        };
                        res.json(datosReturn);

                    } else {
                        res.json({ mensaje: "Error" });
                    }
                });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener usuarios' });
        }
    }

    async GetAlbumsFoto(req, res) {
        try {
            const usuario = req.body.usuario;

            pool.query(
                'SELECT a.albumName, i.photo FROM ALBUM a INNER JOIN USER u ON a.userId = u.id LEFT JOIN IMAGE i ON a.id = i.albumId WHERE u.user = ?;',
                [usuario], (error, results) => {
                    if (error) {
                        res.json({ mensaje: "Error" });
                        return;
                    }
                    if (results && results.length > 0) {

                        res.json({ "albumes": results });
                    } else {
                        res.json({ mensaje: "Error" });
                    }
                });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error' });
        }
    }

    async GetAlbumesFotos(req, res) {
        try {
            const usuario = req.body.usuario;
            const album = req.body.album;

            pool.query(
                'SELECT i.* FROM IMAGE i INNER JOIN ALBUM a ON i.albumId = a.id INNER JOIN USER u ON a.userId = u.id WHERE u.user = ? AND a.albumName = ?;',
                [usuario, album], (error, results) => {
                    if (error) {
                        res.json({ mensaje: "Error" });
                        return;
                    }
                    if (results && results.length > 0) {
                        const fotos = [];
                        results.forEach((row) => {
                            fotos.push(row.photo);
                        });

                        const datosReturn = {
                            "fotos": fotos,
                            "mensaje": "Se obtuvo las imagenes del album "
                        };
                        res.json(datosReturn);


                    } else {
                        res.json({ mensaje: "Error" });
                    }
                });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error' });
        }
    }

    async GetUsuario(req, res) {
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

module.exports = new IndexController();
