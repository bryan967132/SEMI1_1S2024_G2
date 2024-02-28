import * as CryptoJS from 'crypto-js';

// Encriptar con el algoritmo MD5
export function Encriptar(contenido: string): string {
    return  CryptoJS.MD5(contenido).toString();
}

/*
//Verificar contraseña
export function VerificarPassword(password: string, hash: string): boolean {
    const PassEncriptado = Encriptar(password);
    return PassEncriptado === hash;
}
*/