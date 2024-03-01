from Controller import Controller
from flask import Flask, jsonify, request
from flask_cors import CORS
# import os

app = Flask(__name__)
CORS(app)

ctrlr = Controller()

@app.route('/', methods=['GET'])
def running():
    return jsonify({'response': 'Server is running!!!'})

# LOGIN
@app.route('/login', methods=['POST'])
def login():
    body = request.json
    return ctrlr.login(body["usuario"], body["contrasena"])

# LOGOUT
@app.route('/logout', methods=['POST'])
def logout():
    body = request.json
    return ctrlr.logout(body["usuario"])

# SIGNIN
@app.route('/signin', methods=['POST'])
def signin():
    body = request.json
    return ctrlr.signin(body["usuario"], body["nombre"], body["contrasena"], body["foto"])

# PÁGINA DE INICIO | EDITAR PERFIL (PARA VISUALIZAR INFORMACIÓN)
@app.route('/home/<usuario>', methods=['GET'])
def home(usuario):
    return ctrlr.home(usuario)

# EDITAR PERFIL (BOTÓN)
@app.route('/edituser', methods=['PUT'])
def edituser():
    body = request.json
    return ctrlr.edituser(body["id_usuario"], body["usuario_nuevo"], body["nombre"], body["contrasena"], body["foto"])

# NOMBRES DE ALBUMES DE USUARIO (PARA SELECT)
@app.route('/getalbumname', methods=["GET"])
def getalbumname():
    body = request.json
    return ctrlr.getalbumname(body["usuario"])

# VER FOTOS
@app.route('/getalbumes', methods=["GET"])
def getalbumes():
    body = request.json
    return ctrlr.getalbumes(body["usuario"])

# VER FOTOS POR ALBUM
@app.route('/getalbumesfotos', methods=["GET"])
def getalbumesfotos():
    body = request.json
    return ctrlr.getalbumesfotos(body["usuario"], body["album"])

# CARGAR FOTOS
@app.route('/uploadphoto', methods=["POST"])
def uploadphoto():
    body = request.json
    return ctrlr.uploadphoto(body["usuario"], body["nombre_foto"], body["nombre_album"], body["foto"])

# CREAR ALBUM
@app.route('/newalbum', methods=["POST"])
def newalbum():
    body = request.json
    return ctrlr.newalbum(body["usuario"], body["nombre_album"])

# EDITAR ALBUM
@app.route('/editalbum', methods=["PUT"])
def editalbum():
    body = request.json
    return ctrlr.editalbum(body["id_usuario"], body["id_album"], body["nombre_album_nuevo"])

# ELIMINAR ALBUM
@app.route('/deletealbum', methods=["DELETE"])
def deletealbum():
    body = request.json
    return ctrlr.deletealbum(body["usuario"], body["nombre_album"])

if __name__ == '__main__':
    # os.system('clear')
    app.run(host='0.0.0.0', debug = True, port = 5000)