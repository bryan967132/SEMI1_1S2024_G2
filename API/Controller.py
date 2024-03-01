import mysql.connector
import hashlib

class Controller:
    def __init__(self) -> None:
        self.conexion = mysql.connector.connect(
            host="practica1db.ch6y88yecjjk.us-east-2.rds.amazonaws.com",
            user="admin",
            password="IHQCK05YT9zh51xZGSYW",
            database="practica1"
        )
        self.cursor = self.conexion.cursor()

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
            return {"mensaje": "Usuario o contraseña incorrectos"}
        except:
            return {"mensaje": "Error"}

    def logout(self, usuario):
        try:
            query = f'''UPDATE practica1.USER SET practica1.USER.activo = 0 WHERE practica1.USER.user = '{usuario}';'''
            self.cursor.execute(query)
            self.conexion.commit()
            return {"mensaje": "Sesión Finalizada"}
        except:
            return {"mensaje": "Error"}

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

                query_album = f'''INSERT INTO ALBUM(albumName, userId) VALUES('Foto de perfil', {user_id});'''
                self.cursor.execute(query_album)

                self.cursor.execute("SELECT LAST_INSERT_ID()")
                album_id = self.cursor.fetchone()[0]

                query_image = f'''INSERT INTO IMAGE(photo, albumId) VALUES('{foto}', {album_id});'''
                self.cursor.execute(query_image)

                self.conexion.commit()
                return {"mensaje": "Usuario registrado exitosamente"}
            except:
                self.conexion.rollback()
                return {"mensaje": "Error"}
        return {"mensaje": "Intente con un nuevo nombre de usuario"}

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
        print(resultados)
        usuario = resultados[0]
        return {
            "id": usuario[0],
            "user": usuario[1],
            "pass": usuario[2],
            "fullName": usuario[3],
            "activo": usuario[4],
            "photo": usuario[5]
        }

    def edituser(self, id, nuevo_usuario, nombre, contrasena, foto):
        try:
            query = f'''SELECT u.*, i.photo, a.id
                    FROM practica1.USER u
                    JOIN practica1.ALBUM a ON u.id = a.userId AND a.albumName = 'Foto de perfil'
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
                nuevos_datos += f"practica1.USER.fullName = '{nuevo_usuario.strip()}' "
            nueva_foto = ""
            if usuario[5].strip() != foto.strip():
                nueva_foto = f"practica1.USER.user = '{nuevo_usuario.strip()}'"
            if nuevos_datos == "" and nueva_foto == "":
                return {"mensaje": "No se modificaron datos"}
            if nuevos_datos != "":
                query = f"UPDATE practica1.USER SET {nuevos_datos}WHERE practica1.USER.id = {id};"
                self.cursor.execute(query)
            if nueva_foto != "":
                query = f"INSERT INTO IMAGE(photo, albumId) VALUES('{foto}', {usuario[6]});"
                self.cursor.execute(query)
            self.conexion.commit()
            return {"mensaje": "Información actualizada"}
        except:
            return {"mensaje": "Error"}

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
                if r[0] != "Foto de perfil":
                    nombres.append(r[0])
            return {"albumes": nombres}
        except Exception as e:
            print(e)
            return {"albumes": []}

    def getalbumes(self, usuario):
        try:
            query = f'''SELECT id FROM practica1.USER WHERE practica1.USER.user = '{usuario}';'''
            self.cursor.execute(query)
            resultados = self.cursor.fetchall()
            query = f'''SELECT id, albumName FROM practica1.ALBUM WHERE practica1.ALBUM.userId = {resultados[0][0]} AND practica1.ALBUM.albumName != 'Foto de perfil';'''
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
            return {"albumes": albumes}
        except Exception as e:
            print(e)
            return {"albumes": []}

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
            return {"fotos": albumes}
        except Exception as e:
            print(e)
            return {"fotos": []}

    def uploadphoto(self, usuario, nombre_foto, nombre_album, foto):
        try:
            query = f'''SELECT id FROM practica1.ALBUM
                        WHERE practica1.ALBUM.userId IN (
                            SELECT id FROM practica1.USER
                            WHERE practica1.USER.user = '{usuario}'
                        ) AND practica1.ALBUM.albumName = '{nombre_album}';'''
            self.cursor.execute(query)
            resultados = self.cursor.fetchall()
            query = f'''INSERT INTO practica1.IMAGE(photo, albumId) VALUES('Fotos_Publicadas/{nombre_foto}.jpg', {resultados[0][0]});'''
            self.cursor.execute(query)
            self.conexion.commit()
            return {"mensaje": "Fotografía agregada"}
        except Exception as e:
            print(e)
            return {"mensaje": "Error"}

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
                return {"mensaje": "Album creado"}
            return {"mensaje": "Ya existe un album con el mismo nombre"}
        except:
            return {"mensaje": "Error"}

    def editalbum(self, id_usuario, id_album, nombre_album_nuevo):
        try:
            query = f'''UPDATE ALBUM SET albumName = '{nombre_album_nuevo}' WHERE userId = {id_usuario} AND id = {id_album};'''
            self.cursor.execute(query)
            self.conexion.commit()
            return {"mensaje": "Album actualizado"}
        except:
            return {"mensaje": "Error"}

    def deletealbum(self, usuario, nombre_album):
        try:
            query = f'''DELETE a FROM ALBUM a INNER JOIN USER u ON a.userId = u.id  WHERE u.user = '{usuario}' AND a.albumName = '{nombre_album}';'''
            self.cursor.execute(query)
            self.conexion.commit()
            return {"mensaje": "Album eliminado"}
        except Exception as e:
            print(e)
            return {"mensaje": "Error"}