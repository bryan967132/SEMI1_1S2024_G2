import os
import mysql.connector

class MySQL:
    def __init__(self):
        self.conexion = mysql.connector.connect(
            host=os.getenv('RDS_HOST'),
            user=os.getenv('RDS_USER'),
            password=os.getenv('RDS_PASS'),
            database=os.getenv('RDS_DATABASE')
        )
        self.cursor = self.conexion.cursor()

    def __getOrder(self, order):
        match str(order).lower():
            case 'primeras':
                return 'ASC'
            case _:
                return 'DESC'

    def searchPhoto(self, user, album, order, limit):
        try:
            query = f'''SELECT photo FROM practica2.IMAGE WHERE practica2.IMAGE.albumId IN (
                            SELECT id FROM practica2.ALBUM WHERE practica2.ALBUM.userId IN (
                                SELECT id FROM practica2.USER WHERE practica2.USER.user = '{user}'
                            ) AND practica2.ALBUM.albumName = '{album}'
                        )
                        ORDER BY id {self.__getOrder(order)}
                        LIMIT {limit};'''
            self.cursor.execute(query)
            resultado = self.cursor.fetchall()
            response = ''
            for i in range(len(resultado)):
                response += (';' if response != '' else '') + f'{os.getenv('S3_URL')}/{resultado[i][0]}'
            return [{'contentType': 'PlainText', 'content': response}]
        except Exception as e:
            print('ERROR:', e)
            return []

    def getAlbums(self, user):
        try:
            query = f'''SELECT albumName FROM practica2.ALBUM WHERE practica2.ALBUM.userId IN (
	                        SELECT id FROM practica2.USER WHERE practica2.USER.user = '{user}'
                        );'''
            self.cursor.execute(query)
            resultado = self.cursor.fetchall()
            response = 'Tus albums:'
            for i in range(len(resultado)):
                response += ('\n' if response != '' else '') + f'{i + 1}. {resultado[i][0]}'
            return [{'contentType': 'PlainText', 'content': response}]
        except Exception as e:
            print('ERROR:', e)
            return []

    def getPhotosDescriptions(self, user, album):
        try:
            query = f'''SELECT photo, descriptionn FROM practica2.IMAGE WHERE practica2.IMAGE.albumId IN (
                            SELECT id FROM practica2.ALBUM WHERE practica2.ALBUM.userId IN (
                                SELECT id FROM practica2.USER WHERE practica2.USER.user = '{user}'
                            ) AND practica2.ALBUM.albumName = '{album}'
                        );'''
            self.cursor.execute(query)
            resultado = self.cursor.fetchall()
            response = f'Tus fotos del album "{album}"'
            for i in range(len(resultado)):
                r = f'Fotos_Perfil/{user}-'
                response += ('\n' if response != '' else '') + f'\n{i + 1}. {resultado[i][0].replace('Fotos_Publicadas/', '').replace(r, '')}\n{resultado[i][1]}'
            return [{'contentType': 'PlainText', 'content': response}]
        except Exception as e:
            print('ERROR:', e)
            return []

    def createAlbum(self, user, album):
        try:
            query = f'''SELECT id FROM practica2.USER WHERE user = '{user}';'''
            self.cursor.execute(query)
            resultado = self.cursor.fetchall()

            query = f'''SELECT id FROM practica2.ALBUM WHERE userId = {resultado[0][0]} AND albumName = '{album}';'''
            self.cursor.execute(query)
            resultado1 = self.cursor.fetchall()
            
            if len(resultado1) == 0:
                query = f'''INSERT INTO practica2.ALBUM(albumName, userId) VALUES('{album}', {resultado[0][0]});'''
                self.cursor.execute(query)
                self.conexion.commit()
                return [{'contentType': 'PlainText', 'content': f'Ya tienes un nuevo album llamado "{album}"'}]
            return [{'contentType': 'PlainText', 'content': f'Ya tienes un album con el nombre "{album}"'}]
        except Exception as e:
            print('ERROR:', e)
            return []