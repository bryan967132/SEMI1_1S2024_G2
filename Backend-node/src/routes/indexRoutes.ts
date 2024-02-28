import {Router} from 'express';

import {indexController} from '../controllers/indexController';

class IndexRoutes{
    public router: Router = Router();
    
    constructor(){      
        this.config();
    }

    config(): void {
        this.router.post('/login', indexController.Login)
        this.router.post('/logout', indexController.CerrarSesion)
        this.router.post('/signin', indexController.Registrar)
        this.router.get('/home', indexController.Home)
        this.router.put('/edituser', indexController.EditarUsuario)
        this.router.post('/uploadphoto', indexController.SubirFoto)
        this.router.post('/newalbum', indexController.NuevoAlbum)
        this.router.put('/editalbum', indexController.EditarAlbum)
        this.router.delete('/deletealbum', indexController.EliminarAlbum)
        this.router.get('/getalbumname', indexController.GetAlbums)
        this.router.get('/getalbumes', indexController.GetAlbumsFoto)
        //this.router.get('/getusuario', indexController.GetUsuario)
    }

    
}
const indexRoutes = new IndexRoutes();
export default indexRoutes.router;