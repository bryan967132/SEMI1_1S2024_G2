from Controller import Controller
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
# import os

app = Flask(__name__)
CORS(app)

ctrlr = Controller()

@app.route('/', methods=['GET'])
@cross_origin()
def running():
    return jsonify({'response': 'Server is running!!!'})

# LOGIN
@app.route('/login', methods=['POST'])
@cross_origin()
def login():
    body = request.json
    return ctrlr.login(body["usuario"], body["contrasena"])

# LOGINFACEID
@app.route('/loginfaceid', methods=['POST'])
@cross_origin()
def loginfaceid():
    body = request.json
    return ctrlr.loginfaceid(body["usuario"], body["imgFaceId"])

# LOGOUT
@app.route('/logout', methods=['POST'])
@cross_origin()
def logout():
    body = request.json
    return ctrlr.logout(body["usuario"])

# SIGNIN
@app.route('/signin', methods=['POST'])
@cross_origin()
def signin():
    body = request.json
    return ctrlr.signin(body["usuario"], body["nombre"], body["contrasena"], body["foto"])

# PÁGINA DE INICIO | EDITAR PERFIL (PARA VISUALIZAR INFORMACIÓN)
@app.route('/home/<usuario>', methods=['GET'])
@cross_origin()
def home(usuario):
    usuario = str(usuario).replace('%20', ' ')
    return ctrlr.home(usuario)

# EDITAR PERFIL (BOTÓN)
@app.route('/edituser', methods=['PUT'])
@cross_origin()
def edituser():
    body = request.json
    return ctrlr.edituser(body["id_usuario"], body["usuario_nuevo"], body["nombre"], body["contrasena"], body["foto"])

# NOMBRES DE ALBUMES DE USUARIO (PARA SELECT)
@app.route('/getalbumname/<usuario>', methods=["GET"])
@cross_origin()
def getalbumname(usuario):
    usuario = str(usuario).replace('%20', ' ')
    return ctrlr.getalbumname(usuario)

# VER FOTOS
@app.route('/getalbumes/<usuario>', methods=["GET"])
@cross_origin()
def getalbumes(usuario):
    usuario = str(usuario).replace('%20', ' ')
    return ctrlr.getalbumes(usuario)

# VER FOTOS POR ALBUM
@app.route('/getalbumesfotos/<usuario>/<album>', methods=["GET"])
@cross_origin()
def getalbumesfotos(usuario, album):
    usuario = str(usuario).replace('%20', ' ')
    album = str(album).replace('%20', ' ')
    return ctrlr.getalbumesfotos(usuario, album)

# CARGAR FOTOS
@app.route('/uploadphoto', methods=["POST"])
@cross_origin()
def uploadphoto():
    body = request.json
    return ctrlr.uploadphoto(body["usuario"], body["nombre_foto"], body["nombre_album"], body["foto"])

# CREAR ALBUM
@app.route('/newalbum', methods=["POST"])
@cross_origin()
def newalbum():
    body = request.json
    return ctrlr.newalbum(body["usuario"], body["nombre_album"])

# EDITAR ALBUM
@app.route('/editalbum', methods=["PUT"])
@cross_origin()
def editalbum():
    body = request.json
    return ctrlr.editalbum(body["usuario"], body["nombre_album_actual"], body["nombre_album"])

# ELIMINAR ALBUM
@app.route('/deletealbum', methods=["DELETE"])
@cross_origin()
def deletealbum():
    body = request.json
    return ctrlr.deletealbum(body["usuario"], body["nombre_album"])

# ANALIZAR FOTO-TEXTO
@app.route('/phototext', methods=["POST"])
@cross_origin()
def PhotoText():
    body = request.json
    return ctrlr.PhotoText(body["photo"])

# CARGAR FOTOS
@app.route('/uploadphotoo', methods=["POST"])
@cross_origin()
def uploadphotoo():
    body = request.json
    return ctrlr.uploadphotoo(body["usuario"], body["nombre_foto"], body["descripcion"], body["foto"])

# SUBIR RECURSO
@app.route('/subir_recurso', methods=["POST"])
@cross_origin()
def subir_recurso():
    body = request.json
    return ctrlr.subir_recurso(body["titulo"], body["descripcion"],  body["imagen"], body["ruta"],body["tipo"],body["categoria"])


# CARGAR FOTOS TRADUCIR
@app.route('/translatePhoto', methods=["GET"])
@cross_origin()
def translatePhoto():
    usuario = request.args.get('usuario')
    album = request.args.get('album')
    image = request.args.get('image')
    idioma = request.args.get('idioma')

    usuario = str(usuario).replace('%20', ' ')
    album = str(album).replace('%20', ' ')
    image = str(image).replace('%20', ' ')    

    return ctrlr.translatePhoto(usuario, album, image, idioma)

# DESCRIPCIÓN FOTO
@app.route('/descriptionPhoto', methods=["GET"])
@cross_origin()
def descriptionPhoto():
    usuario = request.args.get('usuario')
    album = request.args.get('album')
    image = request.args.get('image')

    usuario = str(usuario).replace('%20', ' ')
    album = str(album).replace('%20', ' ')
    image = str(image).replace('%20', ' ')    

    return ctrlr.descriptionPhoto(usuario, album, image)

@app.route('/sendMessage', methods=["POST"])
@cross_origin()
def sendMessage():
    return ctrlr.sendMessage(request.json['mensaje'], request.json['usuario'])

if __name__ == '__main__':
    # os.system('clear')
    app.run(host='0.0.0.0', debug = True, port = 4000)