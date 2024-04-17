import mysql.connector
import hashlib
import base64
import boto3
import requests
from dotenv import load_dotenv
from PIL import Image
import io
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
        self.rekognition = boto3.client(
            'rekognition',
            aws_access_key_id=os.getenv('REK_ACCESS_KEY'),
            aws_secret_access_key=os.getenv('REK_SECRET_KEY'),
            region_name=os.getenv('REK_REGION')
        )
        self.translate = boto3.client(
            'translate',
            region_name = os.getenv('TRANSLATE_REGION'),
            aws_access_key_id = os.getenv('TRANSLATE_ACCESS_KEY'),
            aws_secret_access_key = os.getenv('TRANSLATE_SECRET_KEY')
        )
        self.lex = boto3.client(
            'lexv2-runtime',
            region_name = 'us-east-1',
            aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID_LEX'),
            aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY_LEX'),
        )

    def uploadProfileImage(self, carpeta, fotoBase64, nombre_foto):
        nombre_ruta = f'{carpeta}/{nombre_foto}.jpg'
        buffer = base64.b64decode(fotoBase64)
        self.s3.put_object(
            Bucket=os.getenv('S3_BUCKET'),
            Key=nombre_ruta,
            Body=buffer,
            ContentType='image/jpeg'
        )
        return nombre_ruta

    def login(self, usuario, contrasena):
        try:
            hash_md5 = hashlib.md5()
            hash_md5.update(contrasena.encode())
            query = f"SELECT * FROM practica2.USER WHERE user = '{usuario}' AND pass = '{hash_md5.hexdigest()}';"
            self.cursor.execute(query)
            resultados = self.cursor.fetchall()
            if len(resultados) == 1:
                usuario = resultados[0]
                query = f"UPDATE practica2.USER SET practica2.USER.activo = 1 WHERE practica2.USER.id = {usuario[0]};"
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

    def loginfaceid(self, usuario, imgFaceId):
        try:
            # Verificar las credenciales del usuario
            query = f"SELECT * FROM practica2.USER WHERE user = '{usuario}';"
            self.cursor.execute(query)
            usuario_row = self.cursor.fetchone()
            if usuario_row:
                # Obtener la foto de perfil del usuario
                query = f'''
                    SELECT u.*, i.photo 
                    FROM practica2.USER u 
                    LEFT JOIN practica2.ALBUM a ON u.id = a.userId 
                    LEFT JOIN practica2.IMAGE i ON a.id = i.albumId 
                    WHERE u.user = '{usuario}' AND a.albumName='Foto_de_Perfil' 
                    ORDER BY i.id DESC LIMIT 1;
                '''
                self.cursor.execute(query)
                usuario_img = self.cursor.fetchone()
    
                if usuario_img:
                    # Imprimir la URL de la foto de perfil (cambiar por el uso real)
                    bucket = os.getenv('S3_BUCKET')
                    img1 = imgFaceId
                    response = requests.get(f'https://{bucket}.s3.us-east-2.amazonaws.com/{usuario_img[5]}')
                    if response.status_code == 200:
                        img2 = base64.b64encode(response.content).decode('utf-8')
                        # Decodificar las imágenes en base64
                        img1_base64 = base64.b64decode(img1)
                        img2_base64 = base64.b64decode(img2)

                        response1 = self.rekognition.detect_faces(Image={'Bytes': img1_base64})
                        response2 = self.rekognition.detect_faces(Image={'Bytes': img2_base64})

                        # Verificar si se detectaron caras en ambas imágenes
                        if not response1['FaceDetails'] or not response2['FaceDetails']:
                            return {'error': 'No se detectaron caras en una o ambas imágenes'}, 400
                    
                        similarity_response = self.rekognition.compare_faces(
                            SourceImage={'Bytes': img1_base64},
                            TargetImage={'Bytes': img2_base64},
                        )
                        
                        if similarity_response['FaceMatches']:
                            similarity = similarity_response['FaceMatches'][0]['Similarity']
                            if similarity > 80:
                                usuario = usuario_row
                                query = f"UPDATE practica2.USER SET practica2.USER.activo = 1 WHERE practica2.USER.id = {usuario[0]};"
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
                            else:
                                return {"mensaje": "Error"}
                        else:
                            return {"mensaje": "Error"}
                        
                    return {"mensaje": "Todo bien"}, 200
                else:
                    return {"mensaje": "No se encontró el usuario"}, 404
            else:
                return {"mensaje": "Usuario o contraseña incorrectos"}, 401
        except Exception as e:
            print(f"Error: {e}")
            return {"mensaje": "Error en el servidor"}, 500


    def logout(self, usuario):
        try:
            query = f'''UPDATE practica2.USER SET practica2.USER.activo = 0 WHERE practica2.USER.user = '{usuario}';'''
            self.cursor.execute(query)
            self.conexion.commit()
            return {"mensaje": "Sesión Finalizada"}, 200
        except:
            return {"mensaje": "Error"}, 500

    def signin(self, usuario, nombre, contrasena, foto):
        query = f'''SELECT 1 FROM practica2.USER WHERE user = '{usuario}';'''
        self.cursor.execute(query)
        resultado = self.cursor.fetchall()
        if len(resultado) == 0:
            try:
                hash_md5 = hashlib.md5()
                hash_md5.update(contrasena.encode())
                query_user = f'''INSERT INTO practica2.USER(user, pass, fullName, activo) VALUES('{usuario}', '{hash_md5.hexdigest()}', '{nombre}', 0);'''
                self.cursor.execute(query_user)

                self.cursor.execute("SELECT LAST_INSERT_ID()")
                user_id = self.cursor.fetchone()[0]

                query_album = f'''INSERT INTO practica2.ALBUM(albumName, userId) VALUES('Foto_de_perfil', {user_id});'''
                self.cursor.execute(query_album)

                self.cursor.execute("SELECT LAST_INSERT_ID()")
                album_id = self.cursor.fetchone()[0]

                urlImage = self.uploadProfileImage(
                    'Fotos_Perfil', foto, f"{usuario}-foto1")

                query_image = f'''INSERT INTO practica2.IMAGE(photo, descriptionn, albumId) VALUES('{urlImage}', 'Foto de Perfil', {album_id});'''
                self.cursor.execute(query_image)

                self.conexion.commit()
                return {"mensaje": "Usuario registrado exitosamente"}, 200
            except Exception as e:
                print(e)
                self.conexion.rollback()
                return {"mensaje": "Error"}, 500
        return {"mensaje": "Intente con un nuevo nombre de usuario"}, 500

    def home(self, usuario):
        query = f'''SELECT u.*, i.photo FROM practica2.USER u LEFT JOIN practica2.ALBUM a ON u.id = a.userId LEFT JOIN practica2.IMAGE i ON a.id = i.albumId WHERE u.user = '{usuario}' AND a.albumName='Foto_de_Perfil' ORDER BY i.id DESC LIMIT 1;'''
        self.cursor.execute(query)
        resultados = self.cursor.fetchall()
        usuario = resultados[0]
        bucket = os.getenv('S3_BUCKET')
        response = requests.get(f'https://{bucket}.s3.us-east-2.amazonaws.com/{usuario[5]}')
        if response.status_code == 200:
            imgPerfil = base64.b64encode(response.content).decode('utf-8')
            imgPerfilBase64 = base64.b64decode(imgPerfil)
            response2 = self.rekognition.detect_faces(Image={'Bytes': imgPerfilBase64}, Attributes=['ALL'])
            face_details = response2.get('FaceDetails', [])
            labels = []

            for face_detail in face_details:
                if 'Gender' in face_detail:
                    gender = face_detail['Gender']['Value']
                    labels.append(f"Genero: {gender}")

                if 'AgeRange' in face_detail:
                    age_range = face_detail['AgeRange']
                    label = f"Rango de edad: {age_range['Low']} - {age_range['High']} años"
                    labels.append(label)
            
                if 'Smile' in face_detail:
                    smile = face_detail['Smile']['Value']
                    if smile:
                        label = f'Sonriendo'
                        labels.append(label)

                if 'Eyeglasses' in face_detail:
                    eyeglasses = face_detail['Eyeglasses']['Value']
                    if eyeglasses:
                        label = f'Anteojos'
                        labels.append(label)
                
                if 'Sunglasses' in face_detail:
                    sunglasses = face_detail['Sunglasses']['Value']
                    if sunglasses:
                        label = f'Lentes de sol'
                        labels.append(label)

                if 'Beard' in face_detail:
                    beard = face_detail['Beard']['Value']
                    if beard:
                        label = f'Barba'
                        labels.append(label)

                if 'Mustache' in face_detail:
                    mustache = face_detail['Mustache']['Value']
                    if mustache:
                        label = f'Bigote'
                        labels.append(label)

                if 'EyesOpen' in face_detail:
                    eyesopen = face_detail['EyesOpen']['Value']
                    if eyesopen:
                        label = f'Ojos abiertos'
                        labels.append(label)

                if 'MouthOpen' in face_detail:
                    mouthopen = face_detail['MouthOpen']['Value']
                    if mouthopen:
                        label = f'Boca abierta'
                        labels.append(label)

                if 'Emotions' in face_detail:
                    emotions = [f"{emotion['Type']}: {emotion['Confidence']:.1f}%" for emotion in face_detail['Emotions']]
                    labels.extend(emotions)
                
            return {
                "id": usuario[0],
                "user": usuario[1],
                "pass": usuario[2],
                "fullName": usuario[3],
                "activo": usuario[4],
                "photo": usuario[5],
                "img_details":labels
            }, 200

    def edituser(self, id, nuevo_usuario, nombre, _, foto):
        print(id, nuevo_usuario, nombre, foto)
        try:
            query = f'''SELECT u.*, i.photo, a.id
                    FROM practica2.USER u
                    JOIN practica2.ALBUM a ON u.id = a.userId AND a.albumName = 'Foto_de_perfil'
                    JOIN practica2.IMAGE i ON a.id = i.albumId
                    WHERE u.id = {id}
                    ORDER BY i.id DESC
                    LIMIT 1;'''
            self.cursor.execute(query)
            resultados = self.cursor.fetchall()
            nuevos_datos = ""
            usuario = resultados[0]
            if usuario[1].strip() != nuevo_usuario.strip():
                nuevos_datos += f"practica2.USER.user = '{nuevo_usuario.strip()}' "
            if usuario[3].strip() != nombre.strip():
                if nuevos_datos != "":
                    nuevos_datos += ", "
                nuevos_datos += f"practica2.USER.fullName = '{nombre.strip()}' "
            if nuevos_datos != "":
                query = f"UPDATE practica2.USER SET {nuevos_datos}WHERE practica2.USER.id = {id};"
                self.cursor.execute(query)
            query = f'''SELECT count(i.id) AS ultimo_id FROM practica2.IMAGE i INNER JOIN practica2.ALBUM a ON i.albumId = a.id WHERE a.userId = {id} AND a.albumName = 'Foto_de_perfil';'''
            self.cursor.execute(query)
            resultados = self.cursor.fetchall()
            urlImage = self.uploadProfileImage('Fotos_Perfil', foto, f'{nuevo_usuario}-foto{int(resultados[0][0]) + 1}')
            query = f"INSERT INTO practica2.IMAGE(photo, descriptionn, albumId) VALUES('{urlImage}', 'Foto de Perfil', {usuario[6]});"
            self.cursor.execute(query)
            self.conexion.commit()
            return {"mensaje": "Información actualizada"}, 200
        except Exception as e:
            print(e)
            return {"mensaje": "Error"}, 500

    def getalbumname(self, usuario):
        try:
            query = f'''SELECT albumName FROM practica2.ALBUM
                        WHERE practica2.ALBUM.userId IN (
                            SELECT id FROM practica2.USER
                            WHERE practica2.USER.user = '{usuario}'
                        );'''
            self.cursor.execute(query)
            resultados = self.cursor.fetchall()
            nombres = []
            for r in resultados:
                nombres.append(r[0])
            return {"albumes": nombres, "mensaje": "Se obtuvieron los albumes"}, 200
        except Exception as e:
            print(e)
            return {"albumes": [], "mensaje": "Error"}, 500

    def getalbumes(self, usuario):
        try:
            query = f'''SELECT id FROM practica2.USER WHERE practica2.USER.user = '{usuario}';'''
            self.cursor.execute(query)
            resultados = self.cursor.fetchall()
            query = f'''SELECT id, albumName FROM practica2.ALBUM WHERE practica2.ALBUM.userId = {resultados[0][0]} AND practica2.ALBUM.albumName != 'Foto_de_perfil';'''
            self.cursor.execute(query)
            resultados = self.cursor.fetchall()
            albumes = []
            for r in resultados:
                album = {"nombre": r[1], "fotos": []}
                query = f'SELECT * FROM practica2.IMAGE WHERE practica2.IMAGE.albumId = {r[0]}'
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
            query = f'''SELECT id FROM practica2.USER WHERE practica2.USER.user = '{usuario}';'''
            self.cursor.execute(query)
            resultados = self.cursor.fetchall()
            query = f'''SELECT id FROM practica2.ALBUM WHERE practica2.ALBUM.userId = {resultados[0][0]} AND practica2.ALBUM.albumName = '{album}';'''
            self.cursor.execute(query)
            resultados = self.cursor.fetchall()
            query = f'SELECT photo FROM practica2.IMAGE WHERE practica2.IMAGE.albumId = {resultados[0][0]}'
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
            query = f'''SELECT id FROM practica2.ALBUM
                        WHERE practica2.ALBUM.userId IN (
                            SELECT id FROM practica2.USER
                            WHERE practica2.USER.user = '{usuario}'
                        ) AND practica2.ALBUM.albumName = '{nombre_album}';'''
            self.cursor.execute(query)
            resultados = self.cursor.fetchall()
            urlImage = self.uploadProfileImage(
                'Fotos_Publicadas', foto, nombre_foto)
            query = f'''INSERT INTO practica2.IMAGE(photo, descriptionn, albumId) VALUES('{urlImage}', '', {resultados[0][0]});'''
            self.cursor.execute(query)
            self.conexion.commit()
            return {"mensaje": "Fotografía agregada"}, 200
        except Exception as e:
            print(e)
            return {"mensaje": "Error"}, 500

    def newalbum(self, usuario, album):
        try:
            query = f'''SELECT id FROM practica2.USER WHERE user = '{usuario}';'''
            self.cursor.execute(query)
            resultado = self.cursor.fetchall()

            query = f'''SELECT id FROM practica2.ALBUM WHERE userId = {resultado[0][0]} AND albumName = '{album}';'''
            self.cursor.execute(query)
            resultado1 = self.cursor.fetchall()

            if len(resultado1) == 0:
                query = f'''INSERT INTO practica2.ALBUM(albumName, userId) VALUES('{album}', {resultado[0][0]});'''
                self.cursor.execute(query)
                self.conexion.commit()
                return {"mensaje": "Album creado"}, 200
            return {"mensaje": "Ya existe un album con el mismo nombre"}, 500
        except:
            return {"mensaje": "Error"}, 500

    def editalbum(self, usuario, nombre_album_actual, nombre_album_nuevo):
        try:
            query = f"SELECT id FROM USER WHERE fullName = '{usuario}'"
            self.cursor.execute(query)
            resultado = self.cursor.fetchall()
            id_usuario = resultado[0][0]
            query = f'SELECT id FROM ALBUM WHERE albumName = {nombre_album_actual} AND userId = {id_usuario}'
            self.cursor.execute(query)
            resultado = self.cursor.fetchall()
            id_album = resultado[0][0]
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

    def PhotoText(self, foto):
        try:
            imagen = base64.b64decode(foto)
            response = self.rekognition.detect_text(
                Image={'Bytes': imagen}
            )
            texto_detectado = [text['DetectedText']
                               for text in response['TextDetections'] if text['Type'] == 'LINE']
            texto_unido = ' '.join(texto_detectado)
            return {"texto": texto_unido}, 200
        except Exception as e:
            print(e)
            return {"mensaje": "Error"}, 500

    def uploadphotoo(self, usuario, nombre_foto, descripcion, foto):
        try:
            # obtenr las etiquetas de la imagen
            imagen = base64.b64decode(foto)
            response = self.rekognition.detect_labels(
                Image={'Bytes': imagen}
            )
            etiquetas = [label['Name'] for label in response['Labels']]

            # select de los nombre de album que tiene el usuario
            QueryAlbumsName = f'''SELECT albumName
                        FROM practica2.ALBUM
                        WHERE userId = (SELECT id FROM practica2.USER WHERE user = '{usuario}');
            '''
            self.cursor.execute(QueryAlbumsName)
            AlbumsName = self.cursor.fetchall()
            AlbumsName = [album[0] for album in AlbumsName]

            # se sube la foto al bucket
            urlImage = self.uploadProfileImage(
                'Fotos_Publicadas', foto, nombre_foto)

            # Validar si ya existe un álbum con cada etiqueta
            for etiqueta in etiquetas:
                album_existente = False
                for name in AlbumsName:
                    if etiqueta == name:  # Si existe un álbum con la etiqueta
                        album_existente = True
                        query_album_id = f'''SELECT id FROM practica2.ALBUM WHERE albumName = '{etiqueta}' AND 
                                    userId = (SELECT id FROM practica2.USER WHERE user = '{usuario}');'''
                        self.cursor.execute(query_album_id)
                        album_id = self.cursor.fetchone()[0]

                        query_insert_photo = f'''INSERT INTO practica2.IMAGE(photo, descriptionn, albumId) 
                                                VALUES('{urlImage}', '{descripcion}', {album_id});'''
                        self.cursor.execute(query_insert_photo)
                        self.conexion.commit()
                        return {"mensaje": "Fotografía agregada"}, 200

            if not album_existente:  # Si no existe un álbum con la etiqueta se crea uno nuevo
                query_insert_album = f'''INSERT INTO practica2.ALBUM (albumName, userId) 
                                        VALUES ('{etiquetas[0]}', (SELECT id FROM practica2.USER WHERE user = '{usuario}'));'''
                self.cursor.execute(query_insert_album)
                self.conexion.commit()

                query_album_id = f'''SELECT id FROM practica2.ALBUM WHERE albumName = '{etiquetas[0]}' AND 
                                    userId = (SELECT id FROM practica2.USER WHERE user = '{usuario}');'''
                self.cursor.execute(query_album_id)
                album_id = self.cursor.fetchone()[0]

                query_insert_photo = f'''INSERT INTO practica2.IMAGE(photo, descriptionn, albumId) 
                                        VALUES('{urlImage}', '{descripcion}', {album_id});'''
                self.cursor.execute(query_insert_photo)
                self.conexion.commit()

            return {"mensaje": "Fotografía agregada"}, 200
        except Exception as e:
            print(e)
            return {"mensaje": "Error"}, 500

    def subir_recurso(self, titulo,descripcion,imagen,ruta,tipo,categoria):
        try:
            #se sube la foto al bucket
            urlImage = self.uploadProfileImage(
               'Fotos_Publicadas', imagen, titulo)
            query_obtener_id_categoria = f"SELECT id FROM proyecto.CATEGORIA WHERE categoria = '{categoria[0]}';"
            self.cursor.execute(query_obtener_id_categoria)
            id_categoria = self.cursor.fetchone()[0]

            query_insert_photo = f'''
            INSERT INTO proyecto.RECURSO(titulo, descripcion, fecha, imagen, tipo, ruta ,id_categoria) 
            VALUES ('{titulo}', '{descripcion}', CURRENT_DATE(), '{urlImage}' , '{tipo}' , '{ruta}' , '{id_categoria}');            
            ''' 
            self.cursor.execute(query_insert_photo)
            self.conexion.commit()
            return {"mensaje": "Recurso agregado"}, 200

        except Exception as e:
            print(e)
            return {"mensaje": "Error"}, 500

    def mis_favoritos(self, usuario):
        try:
            query_favoritos = f'''
            SELECT recurso.*
            FROM proyecto.RECURSO recurso
            INNER JOIN proyecto.FAVORITO favorito ON recurso.id = favorito.id_recurso
            INNER JOIN proyecto.USUARIO usuario ON favorito.id_usuario = usuario.id
            WHERE usuario.usuario = '{usuario}';
            '''
            self.cursor.execute(query_favoritos)
            favoritos = self.cursor.fetchall()
            return {"mensaje": "Obtener favorito con exito","favoritos":favoritos}, 200
        except Exception as e:
            print(e)
            return {"mensaje": "Error"}, 500

    def categoria(self):
        try:
            query_categorias = f'''
            SELECT categoria FROM proyecto.CATEGORIA;
            '''
            self.cursor.execute(query_categorias)
            categoria = self.cursor.fetchall()
            return {"categoria": categoria}, 200
        except Exception as e:
            print(e)
            return {"mensaje": "Error"}, 500

    def getLanguage(self, idioma):
        match idioma.lower():
            case 'frances':
                return 'fr'
            case 'aleman':
                return 'de'
            case 'italiano':
                return 'it'
            case 'bosnio':
                return 'bs'
            case 'turco':
                return 'tr'
            case 'sueco':
                return 'sv'
            case 'ruso':
                return 'ru'

    def translatePhoto(self, usuario, album, image, idioma):
        try:
            for i in [['á', 'a'], ['é', 'e'], ['í', 'i'], ['ó', 'o'], ['ú', 'u']]:
                idioma = idioma.replace(i[0], i[1])
            #obtener el texto a traducir
            QueryDescription = f'''
                SELECT IMAGE.descriptionn
                FROM practica2.IMAGE 
                INNER JOIN practica2.ALBUM ON IMAGE.albumId = ALBUM.id 
                INNER JOIN practica2.USER ON ALBUM.userId = USER.id
                WHERE USER.user = '{usuario}' AND ALBUM.albumName = '{album}' AND IMAGE.photo = '{image}';
            '''

            self.cursor.execute(QueryDescription)
            texto_a_traducir = self.cursor.fetchone()[0]

            # Procesa y traduce el resultado si existe
            if texto_a_traducir is not None:
                idioma_origen = 'es'
                idioma_destino = self.getLanguage(idioma)
                response = self.translate.translate_text(
                    Text = texto_a_traducir,
                    SourceLanguageCode = idioma_origen,
                    TargetLanguageCode = idioma_destino
                )
                texto_traducido = response['TranslatedText']
                return {"texto": texto_traducido, 'original': texto_a_traducir}, 200
            return {"mensaje": "Error"}, 500
            
        except Exception as e:
            print(e)
            return {"mensaje": "Error"}, 500

    def descriptionPhoto(self, usuario, album, image):
        try:
            QueryDescription = f'''
                SELECT IMAGE.descriptionn
                FROM practica2.IMAGE 
                INNER JOIN practica2.ALBUM ON IMAGE.albumId = ALBUM.id 
                INNER JOIN practica2.USER ON ALBUM.userId = USER.id
                WHERE USER.user = '{usuario}' AND ALBUM.albumName = '{album}' AND IMAGE.photo = '{image}';
            '''

            self.cursor.execute(QueryDescription)
            texto_a_traducir = self.cursor.fetchone()[0]

            return {"texto": texto_a_traducir}, 200            
        except Exception as e:
            print(e)
            return {"mensaje": "Error"}, 500

    def sendMessage(self, message, usuario):
        response = self.lex.recognize_text(
            botId = os.getenv('BOT_ID'),
            botAliasId = os.getenv('BOT_ALIAS_ID'),
            localeId = os.getenv('LOCALE_ID'),
            sessionId = os.getenv('SESSION_ID'),
            text = message
        )
        if 'messages' in response:
            if response['messages'][0]['content'] == '¿Tu usuario?':
                response = self.lex.recognize_text(
                    botId = os.getenv('BOT_ID'),
                    botAliasId = os.getenv('BOT_ALIAS_ID'),
                    localeId = os.getenv('LOCALE_ID'),
                    sessionId = os.getenv('SESSION_ID'),
                    text = usuario
                )
                return response
            if response['sessionState']['intent']['name'] == 'TranslateDescription' and response['messages'][0]['content'] == '¡Fue un placer haberte ayudado!':
                slots = response['sessionState']['intent']['slots']
                user = slots['Usuario']['value']['originalValue']
                album = slots['Album']['value']['originalValue']
                photo = slots['Foto']['value']['originalValue']
                language = slots['Idioma']['value']['originalValue']

                if album == 'foto_de_perfil':
                    photo = f'Fotos_Perfil/{user}-{photo}'
                else:
                    photo = f'Fotos_Publicadas/{photo}'

                translated = self.translatePhoto(user, album, photo, language)
                response['messages'] = [{'contentType': 'PlainText', 'content': f'Tu traducción:\nOriginal\n{translated[0]["original"]}\n\nTraducido\n{translated[0]["texto"]}'}] + response['messages']
        return response