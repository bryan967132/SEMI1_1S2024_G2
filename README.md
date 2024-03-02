# Seminario de Sistemas 1  - Practica 1
# Grupo 4
201901055 - Angel Geovany Aragón Pérez  
201901374 - Juan Pablo González Leal  
201908355 - Danny Hugo Bryan Tejaxún Pichiyá  
____________
## Descripción de la arquitectura



## Usuarios IAM
Se crearon tres grupos distintos de usuarios con el propósito de asignar roles específicos y facilitar una gestión más eficiente

### Grupos de usuarios
#### Semi1-Practica1-EC2
En este grupo se aplicaron las políticas de seguridad de 'AmazonEC2FullAccess' , lo que les permite acceder plenamente a todas las funcionalidades de Amazon EC2. Sin embargo, estas políticas restringen el acceso a otros servicios de AWS, limitando así el uso exclusivamente a las capacidades de EC2.

Se han creado dos usuarios específicamente para este grupo, identificados como "user1_EC2" y "user2_EC2"

#### Semi1-Practica1-RDS
Los usuarios de este grupo tienen la capacidad de conectarse y realizar modificaciones en una base de datos específica. 
Se aplicaron políticas de seguridad, como 'AmazonRDSFullAccess', que les brindan acceso total a las funcionalidades de la base de datos relacional, mientras limitan el acceso a otras funciones de AWS. También se implementó la política 'IAMUserChangePassword', que permite a los usuarios cambiar sus propias contraseñas.
Se creó un usuario llamado 'User_rds1' para este propósito, otorgándole autorización para interactuar con la base de datos de manera adecuada dentro del grupo.

Se ha creado un usuario denominado 'User_rds1'.

#### Semi1-Practica1-S3
Los usuarios de este grupo tienen la capacidad de administrar buckets y su contenido, utilizándose para acceder al bucket de almacenamiento de imágenes tanto desde el backend como tambien para subir el frontend de la aplicación. Se aplicaron políticas de seguridad específicas, como 'AmazonS3FullAccess', que les otorgan acceso completo a todas las funcionalidades del servicio Amazon S3, restringiendo el acceso a otras funciones de AWS. Esto garantiza una gestión eficiente y segura del almacenamiento de objetos, cumpliendo con los requisitos de la aplicación.

Se han creado tres usuarios con los nombres 'User1_S3', 'User2_S3' y 'User3_S3'. 

## Buckets S3
Se realizo un bucket 'practica1-g4-imagenes' para el almacenamiuento de las imagenes a tulizar
![S3_1](./Imagenes/S3_1.png )
Se crearon dos carpetas 'Fotos_Perfil','Fotos_Publicadas'
![S3_2](./Imagenes/S3_2.png )
En la carpeta 'Fotos_Perfil' se guarda todas las fotos de perfil de todos los usuarios
![S3_3](./Imagenes/s3_3.png )
En la carpeta 'Fotos_Publicadas' se guarda todas las fotos subidas de todos los usuarios
![S3_4](./Imagenes/s3_4.png )

## EC2
Se crearon dos instancias ec2 para los backends
![ec2_1](./Imagenes/ec2_1.png )
Conexion shh de la ec2 nodejs
![ec2_2](./Imagenes/ec2_2.png )

## BASE RDS

## Aplicacion WEB

### Pagina de inicio
![image](https://github.com/bryan967132/SEMI1_1S2024_Practica1/assets/72292384/b32b9501-5238-402a-8e9b-307518b0fccd)

### Pagina Login
![Screenshot 2024-03-02 010508](https://github.com/bryan967132/SEMI1_1S2024_Practica1/assets/72292384/f816e495-51af-4659-96b5-e002504ce333)

### Pagina registrar
![Screenshot 2024-03-02 010517](https://github.com/bryan967132/SEMI1_1S2024_Practica1/assets/72292384/f1df721a-fe7c-4905-b1e1-614ef538e994)

### Pagina Home usuario logeado
![Screenshot 2024-03-02 010709](https://github.com/bryan967132/SEMI1_1S2024_Practica1/assets/72292384/400b34e3-3b59-47ff-8fa5-5c1d9faaf789)

### Pagina Editar Perfil
![Screenshot 2024-03-02 010717](https://github.com/bryan967132/SEMI1_1S2024_Practica1/assets/72292384/bb20ada2-af15-4e87-97af-d64b52151e37)

### Pagina ver fotos
![Screenshot 2024-03-02 010725](https://github.com/bryan967132/SEMI1_1S2024_Practica1/assets/72292384/a7185f67-cd16-40a8-9119-bd6682e63e83)

### Pagina subir foto
![Screenshot 2024-03-02 010733](https://github.com/bryan967132/SEMI1_1S2024_Practica1/assets/72292384/52563656-f2de-41a5-b2e8-6a657d684392)

### Pagina album
![Screenshot 2024-03-02 010742](https://github.com/bryan967132/SEMI1_1S2024_Practica1/assets/72292384/8e253413-db97-4667-bdc1-c75e5032ea07)

