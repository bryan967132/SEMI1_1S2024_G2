const CryptoJS = require('crypto-js');
const dotenv = require('dotenv');
const path = require('path');
const AWS = require('aws-sdk');

const envPath = path.resolve(__dirname, '..', '.env');
dotenv.config({ path: envPath });

// Encriptar con el algoritmo MD5
function Encriptar(contenido) {
    return CryptoJS.MD5(contenido).toString();
}

AWS.config.update({
    region: process.env.REGION,
    accessKeyId: process.env.ACCESSKEY,
    secretAccessKey: process.env.SECRETACCESS
});
const s3 = new AWS.S3();

function SubirImagenPublicada(foto, nombre_foto) {
    let nombre_ruta = "Fotos_Publicadas/" + nombre_foto + ".jpg";
    let buffer = Buffer.from(foto, "base64");
    const params = {
        Bucket: "practica1-g4-b-imagenes",
        Key: nombre_ruta,
        Body: buffer,
        ContentType: "image"
    };
    s3.putObject(params).promise();
    return nombre_ruta;
}

function SubirImagenPerfil(foto, nombre_foto) {
    let nombre_ruta = "Fotos_Perfil/" + nombre_foto + ".jpg";
    let buffer = Buffer.from(foto, "base64");
    const params = {
        Bucket: "practica1-g4-b-imagenes",
        Key: nombre_ruta,
        Body: buffer,
        ContentType: "image"
    };
    s3.putObject(params).promise();
    return nombre_ruta;
}

//corregir formato de parametro
function corregirFormato(param) {
    return param.replace('%20', ' ');
}

module.exports = {
    Encriptar,
    SubirImagenPublicada,
    SubirImagenPerfil,
    corregirFormato
};
