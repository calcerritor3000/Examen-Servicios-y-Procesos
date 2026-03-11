/**
 * Modelo de Usuario (simulado en memoria)
 * En producción, esto estaría conectado a una base de datos
 */

const { hashPassword, verifyPassword } = require('../utils/hashing');

// Base de datos simulada en memoria
let users = [];

class User {
    constructor(id, username, email, passwordHash, encryptedData = null) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.encryptedData = encryptedData;
        this.createdAt = new Date().toISOString();
    }

    /**
     * Crea un nuevo usuario
     */
    static async create(username, email, password) {
        const passwordHash = await hashPassword(password);
        const id = users.length + 1;
        const user = new User(id, username, email, passwordHash);
        users.push(user);
        return user;
    }

    /**
     * Busca un usuario por ID
     */
    static findById(id) {
        return users.find(u => u.id === parseInt(id));
    }

    /**
     * Busca un usuario por email
     */
    static findByEmail(email) {
        return users.find(u => u.email === email);
    }

    /**
     * Obtiene todos los usuarios (sin contraseñas)
     */
    static getAll() {
        return users.map(u => ({
            id: u.id,
            username: u.username,
            email: u.email,
            createdAt: u.createdAt
        }));
    }

    /**
     * Verifica la contraseña de un usuario
     */
    async verifyPassword(password) {
        return await verifyPassword(password, this.passwordHash);
    }

    /**
     * Actualiza los datos cifrados del usuario
     */
    updateEncryptedData(encryptedData) {
        this.encryptedData = encryptedData;
        return this;
    }

    /**
     * Convierte el usuario a objeto JSON (sin contraseña)
     */
    toJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            createdAt: this.createdAt,
            hasEncryptedData: !!this.encryptedData
        };
    }
}

module.exports = User;
