import * as CryptoJS from 'crypto-js';
import dotenv from 'dotenv';
import path from 'path';
import AWS from 'aws-sdk';

const envPath = path.resolve(__dirname, '..', '.env');
dotenv.config({ path: envPath });

// Encriptar con el algoritmo MD5
export function Encriptar(contenido: string): string {
    return  CryptoJS.MD5(contenido).toString();
}

AWS.config.update({
    region: process.env.REGION,
    accessKeyId: process.env.ACCESSKEY,
    secretAccessKey: process.env.SECRETACCESS
});
const s3 = new AWS.S3();

export function SubirImagenPublicada( foto: String, nombre_foto: String ): string {
    let nombre_ruta = "Fotos_Publicadas/" +nombre_foto+".jpg"
    let buffer = Buffer.from(foto, "base64");
    const params = {                                //para imagenes 
        Bucket: "practica1-g4-b-imagenes",         //nombre del bucket
        Key:nombre_ruta ,                           //nombre de la imagen
        Body: buffer,                               //objeto 
        ContentType: "image"                        //tipo de contenido
    }
    s3.putObject(params).promise();
    return nombre_ruta;
}

export function SubirImagenPerfil( foto: String, nombre_foto: String ): string {
    let nombre_ruta = "Fotos_Perfil/" +nombre_foto+".jpg"
    let buffer = Buffer.from(foto, "base64");
    const params = {                                //para imagenes 
        Bucket: "practica1-g4-b-imagenes",         //nombre del bucket
        Key:nombre_ruta ,                           //nombre de la imagen
        Body: buffer,                               //objeto 
        ContentType: "image"                        //tipo de contenido
    }
    s3.putObject(params).promise();
    return nombre_ruta;
}

/*
//Verificar contraseña
export function VerificarPassword(password: string, hash: string): boolean {
    const PassEncriptado = Encriptar(password);
    return PassEncriptado === hash;
}
*/