const crypto = require('crypto');
const bcrypt = require('bcryptjs');

/**
 * Módulo de hashing
 * Demuestra técnicas de hasheado para seguridad de datos
 */

/**
 * Genera un hash SHA-256 de un texto
 * Hash unidireccional (no se puede revertir)
 * @param {string} text - Texto a hashear
 * @returns {string} - Hash hexadecimal
 */
function hashSHA256(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 * Genera un hash SHA-256 con salt
 * @param {string} text - Texto a hashear
 * @param {string} salt - Salt para el hash
 * @returns {string} - Hash hexadecimal
 */
function hashSHA256WithSalt(text, salt) {
    return crypto.createHash('sha256').update(text + salt).digest('hex');
}

/**
 * Genera un hash usando bcrypt (recomendado para contraseñas)
 * Bcrypt incluye salt automáticamente
 * @param {string} password - Contraseña a hashear
 * @param {number} saltRounds - Número de rondas de salt (default: 10)
 * @returns {Promise<string>} - Hash bcrypt
 */
async function hashPassword(password, saltRounds = 10) {
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (error) {
        throw new Error('Error al hashear contraseña: ' + error.message);
    }
}

/**
 * Verifica una contraseña contra un hash bcrypt
 * @param {string} password - Contraseña a verificar
 * @param {string} hash - Hash bcrypt almacenado
 * @returns {Promise<boolean>} - true si coincide, false si no
 */
async function verifyPassword(password, hash) {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        throw new Error('Error al verificar contraseña: ' + error.message);
    }
}

/**
 * Genera un salt aleatorio
 * @param {number} length - Longitud del salt en bytes (default: 16)
 * @returns {string} - Salt hexadecimal
 */
function generateSalt(length = 16) {
    return crypto.randomBytes(length).toString('hex');
}

/**
 * Genera un hash HMAC (Hash-based Message Authentication Code)
 * @param {string} text - Texto a hashear
 * @param {string} secretKey - Clave secreta
 * @returns {string} - HMAC hexadecimal
 */
function generateHMAC(text, secretKey) {
    return crypto.createHmac('sha256', secretKey).update(text).digest('hex');
}

module.exports = {
    hashSHA256,
    hashSHA256WithSalt,
    hashPassword,
    verifyPassword,
    generateSalt,
    generateHMAC
};
