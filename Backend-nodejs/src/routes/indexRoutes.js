const { Router } = require('express');
const indexController = require('../controllers/indexController');


class IndexRoutes {
    constructor() {
        this.router = Router();
        this.config();
    }

    config() {
        this.router.post('/login', indexController.Login);
        this.router.post('/logout', indexController.CerrarSesion);
        this.router.post('/signin', indexController.Registrar);
        this.router.get('/home/:usuario', indexController.Home);
        this.router.put('/edituser', indexController.EditarUsuario);
        this.router.post('/uploadphoto', indexController.SubirFoto);
        this.router.post('/newalbum', indexController.NuevoAlbum);
        this.router.put('/editalbum', indexController.EditarAlbum);
        this.router.delete('/deletealbum', indexController.EliminarAlbum);
        this.router.get('/getalbumname:/:usuario', indexController.GetAlbums);
        this.router.get('/getalbumes/:usuario', indexController.GetAlbumsFoto);
        this.router.get('/getalbumesfotos/:usuario/:album', indexController.GetAlbumesFotos);
        //this.router.get('/getusuario', indexController.GetUsuario);
    }
}

const indexRoutes = new IndexRoutes();
module.exports = indexRoutes.router;
