# Seminario de Sistemas 1  - Proyecto
# Grupo 4
201901055 - Angel Geovany Aragón Pérez  
201901374 - Juan Pablo González Leal  
201908355 - Danny Hugo Bryan Tejaxún Pichiyá  

## Objetivo del proyecto
Crear una enciclopedia virtual interactiva que brinde a los usuarios acceso a una amplia variedad de recursos académicos, con el fin de ofrecer una plataforma completa y accesible para el aprendizaje y la investigación en línea.

## Descripcion del proyecto 
El proyecto consiste en la creación de una enciclopedia virtual que servirá como una fuente centralizada de recursos académicos. La plataforma permitirá a los usuarios explorar una amplia variedad de recursos clasificados por categorías, que incluyen revista, libros y más.

Los usuarios tendrán la capacidad de acceder a estos recursos de forma gratuita, así como de interactuar con ellos dejando comentarios, calificaciones y traduciéndolos a diferentes idiomas según sea necesario. Además, podrán guardar sus recursos favoritos en listas personalizadas para un acceso rápido en el futuro.

Una característica destacada de la enciclopedia será la integración de un chatbot que proporcionará asistencia instantánea a los usuarios, respondiendo preguntas.

La plataforma también ofrecerá funcionalidades avanzadas como la capacidad de clasificar los recursos por categorías y ver los recursos mejor calificados por la comunidad.

Para garantizar la seguridad y la personalización de la experiencia del usuario, se implementará un formulario de registro donde los nuevos usuarios podrán crear cuentas proporcionando información básica como nombre, nombre de usuario único, contraseña y una foto de perfil.


## Arquitectura Implementada

* **AWS RDS - Base de datos**  
Utilizada para almacenar toda la información necesaria para el funcionamiento de la aplicación, como datos de usuario, fotos, descripciones, etc. Se emplea Amazon RDS para facilitar la administración de la base de datos relacional.

* **EC2 - Servidor**  
Se despliega un servidor en una instancia de EC2, el cual forma parte del backend de la aplicación. Este servidor puede estar programado en Node.js o Python y se utiliza el SDK de AWS para interactuar con los servicios de AWS.

* **S3 - Página web**  
La interfaz de usuario de la aplicación web se aloja en un bucket de S3 público para permitir el acceso a la página en cualquier momento. Se puede desarrollar en cualquier lenguaje de programación según la preferencia del estudiante.

* **S3 - Almacenamiento de Imágenes**  
Se utilizan buckets de S3 para alojar las imágenes de perfil de usuario y las imágenes de los recursos academicos. Estas imágenes se almacenan en carpetas separadas dentro del bucket correspondiente.

* **Balanceador de cargas**  
Se implementa un balanceador de cargas para distribuir el tráfico de la aplicación de manera equitativa entre las instacias de los servidores de python y nodejs , garantizando así la escalabilidad y la alta disponibilidad.

* **Rekognition - Login**
Se utilizó Rekognition para iniciar sesión mediante reconocimiento facial, así como para analizar imágenes de texto y convertirlas a texto.

* **Translate - Traductor**  
El servicio Translate de AWS se aprovecha para ofrecer la funcionalidad de traducción de la descripcion de recursos académicos a diferentes idiomas, lo que amplía la accesibilidad y la utilidad de la plataforma.

* **Lex - Chatbot**
Se implementa Amazon Lex para la creacion de un chatbot conversacional que brindan asistencia instantánea a los usuarios.

* **Funciones Lambda**
Se emplean funciones Lambda para ejecutar código de manera eficiente y sin servidor en respuesta a eventos específicos, así como también para gestionar las respuestas del chatbot, asegurando una interacción fluida y rápida con los usuarios.

* **API gateway**
Se utiliza el servicio de API Gateway para crear, publicar, mantener, monitorear y proteger APIs en cualquier escala, lo que facilita la integración de los servicios backend con la interfaz de usuario y otros sistemas externos.

* **Docker**
Se utiliza Docker para contenerizar y gestionar de forma eficiente los servicios y componentes de la aplicación, lo que facilita el despliegue y la escalabilidad en entornos de desarrollo y producción.


## Usuarios IAM
Se crearon tres grupos distintos de usuarios con el propósito de asignar roles específicos y facilitar una gestión más eficiente

### Grupos de usuarios
#### Semi1-Proyecto-EC2
En este grupo se aplicaron las políticas de seguridad de 'AmazonEC2FullAccess' , lo que les permite acceder plenamente a todas las funcionalidades de Amazon EC2. Sin embargo, estas políticas restringen el acceso a otros servicios de AWS, limitando así el uso exclusivamente a las capacidades de EC2.

Se han creado dos usuarios específicamente para este grupo, identificados como "user1_EC2" 

#### Semi1-Proyecto-RDS
Los usuarios de este grupo tienen la capacidad de conectarse y realizar modificaciones en una base de datos específica. 
Se aplicaron políticas de seguridad, como 'AmazonRDSFullAccess', que les brindan acceso total a las funcionalidades de la base de datos relacional, mientras limitan el acceso a otras funciones de AWS. También se implementó la política 'IAMUserChangePassword', que permite a los usuarios cambiar sus propias contraseñas.
Se creó un usuario llamado 'User1_rds' para este propósito, otorgándole autorización para interactuar con la base de datos de manera adecuada dentro del grupo.

Se ha creado un usuario denominado 'User1_rds'.

#### Semi1-Proyecto-S3
Los usuarios de este grupo tienen la capacidad de administrar buckets y su contenido, utilizándose para acceder al bucket de almacenamiento de imágenes tanto desde el backend como tambien para subir el frontend de la aplicación. Se aplicaron políticas de seguridad específicas, como 'AmazonS3FullAccess', que les otorgan acceso completo a todas las funcionalidades del servicio Amazon S3, restringiendo el acceso a otras funciones de AWS. Esto garantiza una gestión eficiente y segura del almacenamiento de objetos, cumpliendo con los requisitos de la aplicación.

Se han creado tres usuarios con los nombres 'User1_S3'

#### Semi1-Proyecto-Lex
Los usuarios de este grupo tienen la capacidad de administrar Amazon Lex, utilizándose para acceder a la configuración del chatbot con las distintas funcionalidades mostradas en el frontend de la aplicación. Se aplicaron políticas de seguridad específicas, como 'AmazonLexFullAccess', que les otorgan acceso completo a todas las funcionalidades del servicio Amazon Lex, restringiendo el acceso a otras funciones de AWS. Esto garantiza una gestión eficiente y segura de las conversaciones con el chatbot, cumpliendo con los requisitos de la aplicación.

Se han creado el usuarios con el nombre 'User1_Lex'. 

#### Semi1-Proyecto-Rekognition
Los usuarios de este grupo tienen la capacidad de administrar Amazon Rekgognition, utilizándose para acceder por medio del reconocimiento facial como tambien para la interpretacion del texto que hay en una imagen. Se aplicaron políticas de seguridad específicas, como 'AmazonRekognitionFullAccess', que les otorgan acceso completo a todas las funcionalidades del servicio Amazon Rekognition, restringiendo el acceso a otras funciones de AWS.

Se han creado el usuarios con el nombre 'User1_Rekognition'. 

## Funcionalidades Del ChatBot

* **Observar mis favoritos**  
Permite a los usuarios buscar sus recursos que tiene agregado como favoritos en la aplicación proporcionando el titulo. El chatbot utiliza Amazon Lex para entender la consulta del usuario y luego realiza la búsqueda en la base de datos.
* **Recomendacion de recusos**  
Nuestro chatbot ofrece una funcionalidad clave al permitir a los usuarios solicitar recomendaciones personalizadas de recursos académicos. Basándose en el tipo y la categoría específica que el usuario está buscando

## Presupuesto - Mensual

* **Amazon EC2** 
El usp de 2 instancias ec2 linux t2.micro   para los servidores de python y nodejs.
es un  gasto de 0.0162 USD por hora por cada instancia. se estima un gasto mensual de 16.94 USD

* **Amazon RDS for MySQL**
 El uso de una instancia db.t2.micro, db.t3.micro o db.t4g.micro con 20gb de almacenamiento de uso general mas 20gb de backup es un gasto de 0.034 USD por hora. Se estima un gasto mensual de 24.82 USD 

* **Amazon Simple Storage Service (S3)**
Tiered price for: 30 GB
30 GB x 0,023 USD = 0,69 USD
Costo total de la capa = 0,69 USD (coste de almacenamiento en S3 Estándar)
300 Solicitudes PUT para almacenamiento de S3 Standard x 0,000005 USD por solicitud = 0,0015 USD (coste de solicitudes PUT en S3 Estándar)
300 Solicitudes GET en un mes x 0,0000004 USD por solicitud = 0,0001 USD (coste de solicitudes GET en S3 Estándar)
0,69 USD + 0,0001 USD + 0,0015 USD = 0,69 USD (Total de almacenamiento de S3 Standard, solicitudes de datos, coste de S3 Select)
Coste de S3 Estándar (mensual): 0.69 USD

* **Elastic Load Balancing**
El uso de un balanceador de carga es un gasto de 0.0255 USD por hora. Se estima un gasto mensual de 16.43 USD 


* **Amazon Rekognition**
El usp de reconocimineto facial y el reconocimiento de texto en la imagen. Se estima un gasto mensual de 0.60 USD 

* **Amazon Translate**
El uso de una instancia db.t2.micro, db.t3.micro o db.t4g.micro con 20gb de almacenamiento de uso general mas 20gb de backup es un gasto de 0.034 USD por hora. Se estima un gasto mensual de 24.82 USD 

* **Amazon Lambda**
El uso de funciones labmda. Se estima un gasto mensual de 00.00 USD 

* **Total**
*Costo Mensual: 85,98 USD
*Costo total de 12 meses: 1031.76 USD
Para mas informacion ver pdf de las estimaciones

## Sevicios que se utilizaron 

* **AWS RDS**  
AWS RDS es un servicio de base de datos relacional que simplifica el aprovisionamiento, la administración y el escalado de bases de datos relacionales en la nube.

* **EC2**  
Amazon EC2 ofrece capacidad informática escalable en la nube y permite a los usuarios ejecutar servidores virtuales (instancias) para ejecutar aplicaciones

* **S3**  
Amazon S3 es un servicio de almacenamiento en la nube altamente duradero y escalable que permite a los usuarios almacenar y recuperar datos desde cualquier ubicación en la web

* **Balanceador de cargas**  
El balanceador de cargas de AWS distribuye automáticamente el tráfico entrante a las instancias EC2 para garantizar una alta disponibilidad y un rendimiento óptimo de la aplicación. Distribuye la carga de manera equitativa entre las instancias para evitar la congestión y asegurar una experiencia fluida para los usuarios.

* **Rekognition**
Amazon Rekognition es un servicio de análisis de imágenes y vídeos basado en aprendizaje profundo. Proporciona capacidades de análisis avanzadas, como detección y reconocimiento de objetos, texto y rostros en imágenes, así como análisis de contenido inapropiado.

* **Translate**  
Amazon Translate es un servicio de traducción automática neural que permite a los desarrolladores traducir texto de manera eficiente y precisa entre idiomas. Proporciona traducción automática de alta calidad y soporta una amplia variedad de idiomas.

* **Lex**
Amazon Lex es un servicio de creación de chatbots conversacionales que utiliza tecnología de aprendizaje automático. Permite a los desarrolladores crear chatbots de manera sencilla y eficiente para proporcionar asistencia a los usuarios a través de texto y voz.

* **Funciones Lambda**
AWS Lambda permite a los desarrolladores ejecutar código sin tener que aprovisionar o administrar servidores. Permite la ejecución de código de forma automatizada en respuesta a eventos, como la carga de imágenes o las solicitudes de API, lo que facilita la creación de arquitecturas de aplicaciones sin servidor.

* **API gateway**
Amazon API Gateway es un servicio completamente administrado que facilita la creación, publicación, mantenimiento y protección de API a cualquier escala. Permite a los desarrolladores crear y gestionar fácilmente interfaces de programación de aplicaciones para sus aplicaciones web y móviles.

* **Docker**
Docker es una plataforma de contenedorización que permite a los desarrolladores empaquetar, distribuir y ejecutar aplicaciones en contenedores. Proporciona una forma eficiente y consistente de implementar aplicaciones en diferentes entornos de desarrollo y producción.
