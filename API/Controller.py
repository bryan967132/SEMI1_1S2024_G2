import mysql.connector
import hashlib
import base64
import boto3
from dotenv import load_dotenv
import os

# Carga las variables de entorno desde el archivo .env
load_dotenv()

class Controller:
    def __init__(self) -> None:
        self.conexion = mysql.connector.connect(
            host=os.getenv('RDS_HOST'),
            user=os.getenv('RDS_USER'),
            password=os.getenv('RDS_PASS'),
            database=os.getenv('RDS_DATABASE')
        )
        self.cursor = self.conexion.cursor()
        self.s3 = boto3.client('s3')

    def uploadProfileImage(self, carpeta, fotoBase64, nombre_foto):
        nombre_ruta = f'{carpeta}/{nombre_foto}.jpg'
        buffer = base64.b64decode(fotoBase64)
        self.s3.put_object(
            Bucket = os.getenv('S3_BUCKET'),
            Key = nombre_ruta,
            Body = buffer,
            ContentType='image/jpeg'
        )
        return nombre_ruta

    def login(self, usuario, contrasena):
        try:
            hash_md5 = hashlib.md5()
            hash_md5.update(contrasena.encode())
            query = f"SELECT * FROM practica1.USER WHERE user = '{usuario}' AND pass = '{hash_md5.hexdigest()}';"
            self.cursor.execute(query)
            resultados = self.cursor.fetchall()
            if len(resultados) == 1:
                usuario = resultados[0]
                query = f"UPDATE practica1.USER SET practica1.USER.activo = 1 WHERE practica1.USER.id = {usuario[0]};"
                self.cursor.execute(query)
                self.conexion.commit()
                return {
                    "mensaje": "Bienvenido",
                    "id": usuario[0],
                    "user": usuario[1],
                    "pass": usuario[2],
                    "fullName": usuario[3],
                    "activo": usuario[4]
                }
            return {"mensaje": "Usuario o contraseña incorrectos"}, 200
        except:
            return {"mensaje": "Error"}, 500

    def logout(self, usuario):
        try:
            query = f'''UPDATE practica1.USER SET practica1.USER.activo = 0 WHERE practica1.USER.user = '{usuario}';'''
            self.cursor.execute(query)
            self.conexion.commit()
            return {"mensaje": "Sesión Finalizada"}, 200
        except:
            return {"mensaje": "Error"}, 500

    def signin(self, usuario, nombre, contrasena, foto):
        query = f'''SELECT 1 FROM practica1.USER WHERE user = '{usuario}';'''
        self.cursor.execute(query)
        resultado = self.cursor.fetchall()
        if len(resultado) == 0:
            try:
                hash_md5 = hashlib.md5()
                hash_md5.update(contrasena.encode())
                query_user = f'''INSERT INTO practica1.USER(user, pass, fullName, activo) VALUES('{usuario}', '{hash_md5.hexdigest()}', '{nombre}', 0);'''
                self.cursor.execute(query_user)

                self.cursor.execute("SELECT LAST_INSERT_ID()")
                user_id = self.cursor.fetchone()[0]

                query_album = f'''INSERT INTO ALBUM(albumName, userId) VALUES('Foto_de_perfil', {user_id});'''
                self.cursor.execute(query_album)

                self.cursor.execute("SELECT LAST_INSERT_ID()")
                album_id = self.cursor.fetchone()[0]

                urlImage = self.uploadProfileImage('Fotos_Perfil', foto, f"{usuario}-foto1")

                query_image = f'''INSERT INTO IMAGE(photo, albumId) VALUES('{urlImage}', {album_id});'''
                self.cursor.execute(query_image)

                self.conexion.commit()
                return {"mensaje": "Usuario registrado exitosamente"}, 200
            except Exception as e:
                print(e)
                self.conexion.rollback()
                return {"mensaje": "Error"}, 500
        return {"mensaje": "Intente con un nuevo nombre de usuario"}, 500

    def home(self, usuario):
        query = f'''SELECT u.*, i.photo
                FROM practica1.USER u
                JOIN practica1.ALBUM a ON u.id = a.userId
                JOIN practica1.IMAGE i ON a.id = i.albumId
                WHERE u.user = '{usuario}'
                ORDER BY i.id DESC
                LIMIT 1;'''
        self.cursor.execute(query)
        resultados = self.cursor.fetchall()
        usuario = resultados[0]
        return {
            "id": usuario[0],
            "user": usuario[1],
            "pass": usuario[2],
            "fullName": usuario[3],
            "activo": usuario[4],
            "photo": usuario[5]
        }, 200

    def edituser(self, id, nuevo_usuario, nombre, _, foto):
        try:
            query = f'''SELECT u.*, i.photo, a.id
                    FROM practica1.USER u
                    JOIN practica1.ALBUM a ON u.id = a.userId AND a.albumName = 'Foto_de_perfil'
                    JOIN practica1.IMAGE i ON a.id = i.albumId
                    WHERE u.id = {id}
                    ORDER BY i.id DESC
                    LIMIT 1;'''
            self.cursor.execute(query)
            resultados = self.cursor.fetchall()
            nuevos_datos = ""
            usuario = resultados[0]
            if usuario[1].strip() != nuevo_usuario.strip():
                nuevos_datos += f"practica1.USER.user = '{nuevo_usuario.strip()}' "
            if usuario[3].strip() != nombre.strip():
                if nuevos_datos != "":
                    nuevos_datos += ", "
                nuevos_datos += f"practica1.USER.fullName = '{nombre.strip()}' "
            if nuevos_datos != "":
                query = f"UPDATE practica1.USER SET {nuevos_datos}WHERE practica1.USER.id = {id};"
                self.cursor.execute(query)
            query = f'''SELECT count(i.id) AS ultimo_id FROM IMAGE i INNER JOIN ALBUM a ON i.albumId = a.id WHERE a.userId = {id} AND a.albumName = 'Foto_de_perfil';'''
            self.cursor.execute(query)
            resultados = self.cursor.fetchall()
            urlImage = self.uploadProfileImage('Fotos_Perfil', foto, f'{nuevo_usuario}-foto{int(resultados[0][0]) + 1}')
            query = f"INSERT INTO IMAGE(photo, albumId) VALUES('{urlImage}', {usuario[6]});"
            self.cursor.execute(query)
            self.conexion.commit()
            return {"mensaje": "Información actualizada"}, 200
        except:
            return {"mensaje": "Error"}, 500

    def getalbumname(self, usuario):
        try:
            query = f'''SELECT albumName FROM practica1.ALBUM
                        WHERE practica1.ALBUM.userId IN (
                            SELECT id FROM practica1.USER
                            WHERE practica1.USER.user = '{usuario}'
                        );'''
            self.cursor.execute(query)
            resultados = self.cursor.fetchall()
            nombres = []
            for r in resultados:
                if r[0] != "Foto_de_perfil":
                    nombres.append(r[0])
            return {"albumes": nombres, "mensaje": "Se obtuvieron los albumes"}, 200
        except Exception as e:
            print(e)
            return {"albumes": [], "mensaje": "Error"}, 500

    def getalbumes(self, usuario):
        try:
            query = f'''SELECT id FROM practica1.USER WHERE practica1.USER.user = '{usuario}';'''
            self.cursor.execute(query)
            resultados = self.cursor.fetchall()
            query = f'''SELECT id, albumName FROM practica1.ALBUM WHERE practica1.ALBUM.userId = {resultados[0][0]} AND practica1.ALBUM.albumName != 'Foto_de_perfil';'''
            self.cursor.execute(query)
            resultados = self.cursor.fetchall()
            albumes = []
            for r in resultados:
                album = {"nombre": r[1], "fotos": []}
                query = f'SELECT * FROM practica1.IMAGE WHERE practica1.IMAGE.albumId = {r[0]}'
                self.cursor.execute(query)
                resultados1 = self.cursor.fetchall()
                for r1 in resultados1:
                    album["fotos"].append(r1[1])
                albumes.append(album)
            return {"albumes": albumes}, 200
        except Exception as e:
            print(e)
            return {"albumes": []}, 500

    def getalbumesfotos(self, usuario, album):
        try:
            query = f'''SELECT id FROM practica1.USER WHERE practica1.USER.user = '{usuario}';'''
            self.cursor.execute(query)
            resultados = self.cursor.fetchall()
            query = f'''SELECT id FROM practica1.ALBUM WHERE practica1.ALBUM.userId = {resultados[0][0]} AND practica1.ALBUM.albumName = '{album}';'''
            self.cursor.execute(query)
            resultados = self.cursor.fetchall()
            query = f'SELECT photo FROM practica1.IMAGE WHERE practica1.IMAGE.albumId = {resultados[0][0]}'
            self.cursor.execute(query)
            resultados = self.cursor.fetchall()
            albumes = []
            for r in resultados:
                albumes.append(r[0])
            return {"fotos": albumes}, 200
        except Exception as e:
            print(e)
            return {"fotos": []}, 500

    def uploadphoto(self, usuario, nombre_foto, nombre_album, foto):
        try:
            query = f'''SELECT id FROM practica1.ALBUM
                        WHERE practica1.ALBUM.userId IN (
                            SELECT id FROM practica1.USER
                            WHERE practica1.USER.user = '{usuario}'
                        ) AND practica1.ALBUM.albumName = '{nombre_album}';'''
            self.cursor.execute(query)
            resultados = self.cursor.fetchall()
            urlImage = self.uploadProfileImage('Fotos_Publicadas', foto, nombre_foto)
            query = f'''INSERT INTO practica1.IMAGE(photo, albumId) VALUES('{urlImage}', {resultados[0][0]});'''
            self.cursor.execute(query)
            self.conexion.commit()
            return {"mensaje": "Fotografía agregada"}, 200
        except Exception as e:
            print(e)
            return {"mensaje": "Error"}, 500

    def newalbum(self, usuario, album):
        try:
            query = f'''SELECT id FROM practica1.USER WHERE user = '{usuario}';'''
            self.cursor.execute(query)
            resultado = self.cursor.fetchall()

            query = f'''SELECT id FROM practica1.ALBUM WHERE userId = {resultado[0][0]} AND albumName = '{album}';'''
            self.cursor.execute(query)
            resultado1 = self.cursor.fetchall()

            if len(resultado1) == 0:
                query = f'''INSERT INTO practica1.ALBUM(albumName, userId) VALUES('{album}', {resultado[0][0]});'''
                self.cursor.execute(query)
                self.conexion.commit()
                return {"mensaje": "Album creado"}, 200
            return {"mensaje": "Ya existe un album con el mismo nombre"}, 500
        except:
            return {"mensaje": "Error"}, 500

    def editalbum(self, id_usuario, id_album, nombre_album_nuevo):
        try:
            query = f'''UPDATE ALBUM SET albumName = '{nombre_album_nuevo}' WHERE userId = {id_usuario} AND id = {id_album};'''
            self.cursor.execute(query)
            self.conexion.commit()
            return {"mensaje": "Album actualizado"}, 200
        except:
            return {"mensaje": "Error"}, 500

    def deletealbum(self, usuario, nombre_album):
        try:
            query = f'''SELECT id FROM ALBUM WHERE albumName = '{nombre_album}';'''
            self.cursor.execute(query)
            id_album = self.cursor.fetchall()[0][0]
            query = f'''SELECT id FROM USER WHERE user = '{usuario}';'''
            self.cursor.execute(query)
            id_usuario = self.cursor.fetchall()[0][0]
            query = f'''DELETE FROM IMAGE WHERE albumId = {id_album};'''
            self.cursor.execute(query)
            query = f'''DELETE FROM ALBUM WHERE id = {id_album} AND userId = {id_usuario};'''
            self.cursor.execute(query)
            self.conexion.commit()
            return {"mensaje": "Album eliminado"}, 200
        except Exception as e:
            print(e)
            return {"mensaje": "Error"}, 500