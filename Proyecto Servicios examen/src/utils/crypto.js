const crypto = require('crypto');

/**
 * Módulo de cifrado y descifrado
 * Demuestra técnicas criptográficas de ida y vuelta con desencriptación
 */

// Clave de cifrado (en producción debería estar en variables de entorno)
const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = crypto.scryptSync('clave-secreta-proyecto-examen', 'salt', 32);
const IV_LENGTH = 16; // Para AES, el IV siempre es de 16 bytes

/**
 * Cifra un texto plano usando AES-256-CBC
 * @param {string} text - Texto a cifrar
 * @returns {string} - Texto cifrado en formato hex:iv:ciphertext
 */
function encrypt(text) {
    try {
        // Generar IV aleatorio para cada cifrado
        const iv = crypto.randomBytes(IV_LENGTH);
        
        // Crear cipher
        const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
        
        // Cifrar el texto
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        // Retornar IV y texto cifrado concatenados (para poder descifrar después)
        return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
        throw new Error('Error al cifrar: ' + error.message);
    }
}

/**
 * Descifra un texto cifrado usando AES-256-CBC
 * @param {string} encryptedText - Texto cifrado en formato hex:iv:ciphertext
 * @returns {string} - Texto descifrado
 */
function decrypt(encryptedText) {
    try {
        // Separar IV y texto cifrado
        const parts = encryptedText.split(':');
        if (parts.length !== 2) {
            throw new Error('Formato de texto cifrado inválido');
        }
        
        const iv = Buffer.from(parts[0], 'hex');
        const encrypted = parts[1];
        
        // Crear decipher
        const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
        
        // Descifrar el texto
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    } catch (error) {
        throw new Error('Error al descifrar: ' + error.message);
    }
}

/**
 * Cifra un objeto JSON
 * @param {object} obj - Objeto a cifrar
 * @returns {string} - Objeto cifrado
 */
function encryptObject(obj) {
    const jsonString = JSON.stringify(obj);
    return encrypt(jsonString);
}

/**
 * Descifra un objeto JSON cifrado
 * @param {string} encryptedObj - Objeto cifrado
 * @returns {object} - Objeto descifrado
 */
function decryptObject(encryptedObj) {
    const decryptedString = decrypt(encryptedObj);
    return JSON.parse(decryptedString);
}

module.exports = {
    encrypt,
    decrypt,
    encryptObject,
    decryptObject
};
