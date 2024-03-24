# Seminario de Sistemas 1  - Practica 2
# Grupo 4
201901055 - Angel Geovany Aragón Pérez  
201901374 - Juan Pablo González Leal  
201908355 - Danny Hugo Bryan Tejaxún Pichiyá  

## Arquitectura
* **Base de datos RDS**  
Utilizada para almacenar toda la información necesaria para el funcionamiento de la aplicación, como datos de usuario, fotos, descripciones, etc. Se emplea Amazon RDS para facilitar la administración de la base de datos relacional.
* **Servidor EC2**  
Se despliega un servidor en una instancia de EC2, el cual forma parte del backend de la aplicación. Este servidor puede estar programado en Node.js o Python y se utiliza el SDK de AWS para interactuar con los servicios de AWS.
* **Página web**  
La interfaz de usuario de la aplicación web se aloja en un bucket de S3 público para permitir el acceso a la página en cualquier momento. Se puede desarrollar en cualquier lenguaje de programación según la preferencia del estudiante.
* **Almacenamiento de Imágenes en S3**  
Se utilizan buckets de S3 para alojar las imágenes de perfil de usuario y las imágenes de los álbumes. Estas imágenes se almacenan en carpetas separadas dentro del bucket correspondiente.

## Usuarios IAM
Se crearon tres grupos distintos de usuarios con el propósito de asignar roles específicos y facilitar una gestión más eficiente

### Grupos de usuarios
#### Semi1-Practica2-EC2
En este grupo se aplicaron las políticas de seguridad de 'AmazonEC2FullAccess' , lo que les permite acceder plenamente a todas las funcionalidades de Amazon EC2. Sin embargo, estas políticas restringen el acceso a otros servicios de AWS, limitando así el uso exclusivamente a las capacidades de EC2.

Se han creado dos usuarios específicamente para este grupo, identificados como "user1_EC2" y "user2_EC2"

#### Semi1-Practica2-RDS
Los usuarios de este grupo tienen la capacidad de conectarse y realizar modificaciones en una base de datos específica. 
Se aplicaron políticas de seguridad, como 'AmazonRDSFullAccess', que les brindan acceso total a las funcionalidades de la base de datos relacional, mientras limitan el acceso a otras funciones de AWS. También se implementó la política 'IAMUserChangePassword', que permite a los usuarios cambiar sus propias contraseñas.
Se creó un usuario llamado 'User_rds1' para este propósito, otorgándole autorización para interactuar con la base de datos de manera adecuada dentro del grupo.

Se ha creado un usuario denominado 'User_rds1'.

#### Semi1-Practica2-S3
Los usuarios de este grupo tienen la capacidad de administrar buckets y su contenido, utilizándose para acceder al bucket de almacenamiento de imágenes tanto desde el backend como tambien para subir el frontend de la aplicación. Se aplicaron políticas de seguridad específicas, como 'AmazonS3FullAccess', que les otorgan acceso completo a todas las funcionalidades del servicio Amazon S3, restringiendo el acceso a otras funciones de AWS. Esto garantiza una gestión eficiente y segura del almacenamiento de objetos, cumpliendo con los requisitos de la aplicación.

Se han creado tres usuarios con los nombres 'User1_S3', 'User2_S3' y 'User3_S3'. 

#### Semi1-Practica2-S3
Los usuarios de este grupo tienen la capacidad de administrar Amazon Lex, utilizándose para acceder a la configuración del chatbot con las distintas funcionalidades mostradas en el frontend de la aplicación. Se aplicaron políticas de seguridad específicas, como 'AmazonLexFullAccess', que les otorgan acceso completo a todas las funcionalidades del servicio Amazon Lex, restringiendo el acceso a otras funciones de AWS. Esto garantiza una gestión eficiente y segura de las conversaciones con el chatbot, cumpliendo con los requisitos de la aplicación.

Se han creado el usuarios con el nombre 'User_Lex'. 

## Funcionalidades Del ChatBot

* **Búsqueda de fotos por album**  
Permite a los usuarios buscar fotos en la aplicación proporcionando una descripción o palabras clave. El chatbot utiliza Amazon Lex para entender la consulta del usuario y luego realiza la búsqueda en la base de datos.
* **Traducción de descripción de las fotos**  
Los usuarios pueden solicitar al chatbot que traduzca el texto de la descripción de una imagen a varios idiomas. Amazon Translate se utiliza para traducirlo.
* **Creación de álbumes automáticos**  
El chatbot puede crear álbumes automáticamente.

## Funciones De Amazon Rekognition
* **Comparación facial para inicio de sesión**  
Se utiliza Amazon Rekognition para comparar la imagen de la cámara web del usuario con su foto de perfil actual durante el inicio de sesión, mejorando la autenticación.
* **Análisis de imágenes para etiquetado**  
Las imágenes subidas por los usuarios se analizan utilizando Amazon Rekognition para obtener etiquetas que describan su contenido. Estas etiquetas se utilizan para clasificar automáticamente las fotos en álbumes.
* **Extracción de texto en imágenes**  
Amazon Rekognition se emplea para extraer texto presente en las imágenes, lo que permite funcionalidades como la traducción del texto a diferentes idiomas y la búsqueda de imágenes basada en texto.