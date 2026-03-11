const http = require('http');
const url = require('url');
const crypto = require('crypto');

// ============================================
// MÓDULOS PROPIOS (SIN DEPENDENCIAS)
// ============================================

// Cifrado/Descifrado AES-256-CBC
const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = crypto.scryptSync('clave-secreta-proyecto-examen', 'salt', 32);
const IV_LENGTH = 16;

function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

function decrypt(encryptedText) {
    const parts = encryptedText.split(':');
    if (parts.length !== 2) throw new Error('Formato inválido');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

function encryptObject(obj) {
    return encrypt(JSON.stringify(obj));
}

function decryptObject(encryptedObj) {
    return JSON.parse(decrypt(encryptedObj));
}

// Hashing
function hashSHA256(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
}

function hashSHA256WithSalt(text, salt) {
    return crypto.createHash('sha256').update(text + salt).digest('hex');
}

function generateSalt(length = 16) {
    return crypto.randomBytes(length).toString('hex');
}

function generateHMAC(text, secretKey) {
    return crypto.createHmac('sha256', secretKey).update(text).digest('hex');
}

// Bcrypt simple usando crypto (solo para demostración)
function hashPassword(password) {
    const salt = generateSalt(16);
    const hash = hashSHA256WithSalt(password, salt);
    return `$2a$10$${salt}$${hash}`; // Formato similar a bcrypt
}

function verifyPassword(password, hash) {
    try {
        if (!password || !hash) return false;
        // Limpiar el hash de espacios en blanco
        hash = String(hash).trim();
        const parts = hash.split('$');
        // El formato real es: $2a$10$salt$hash
        // Al hacer split('$') obtenemos: ['', '2a', '10', salt, hash]
        // O si hay $ dobles: ['', '2a', '10', '', salt, '', hash]
        if (parts.length < 5) return false;
        
        let salt, storedHash;
        if (parts.length === 5) {
            // Formato: $2a$10$salt$hash
            salt = (parts[3] || '').trim();
            storedHash = (parts[4] || '').trim();
        } else if (parts.length >= 7) {
            // Formato: $2a$10$$salt$$hash (con $ dobles)
            salt = (parts[4] || '').trim();
            storedHash = (parts[6] || '').trim();
        } else {
            return false;
        }
        
        if (!salt || !storedHash || salt.length === 0 || storedHash.length === 0) return false;
        const computedHash = hashSHA256WithSalt(password, salt);
        return computedHash === storedHash;
    } catch (error) {
        return false;
    }
}

// Modelo Usuario (en memoria)
let users = [];
let userIdCounter = 1;

class User {
    constructor(username, email, passwordHash) {
        this.id = userIdCounter++;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.encryptedData = null;
        this.createdAt = new Date().toISOString();
    }

    static create(username, email, password) {
        const passwordHash = hashPassword(password);
        return new User(username, email, passwordHash);
    }

    static findById(id) {
        return users.find(u => u.id === parseInt(id));
    }

    static findByEmail(email) {
        return users.find(u => u.email === email);
    }

    static getAll() {
        return users.map(u => ({
            id: u.id,
            username: u.username,
            email: u.email,
            createdAt: u.createdAt,
            hasEncryptedData: !!u.encryptedData
        }));
    }

    updateEncryptedData(encryptedData) {
        this.encryptedData = encryptedData;
        return this;
    }
}

// ============================================
// SERVIDOR HTTP (SIN EXPRESS)
// ============================================

const PORT = 3000;

function parseBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch {
                resolve({});
            }
        });
    });
}

function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;

    // CORS
    if (method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }

    try {
        // RUTA RAÍZ
        if (path === '/' && method === 'GET') {
            return sendJSON(res, 200, {
                message: 'API de Gestión Empresarial - Proyecto Examen',
                version: '1.0.0',
                endpoints: {
                    usuarios: '/api/usuarios',
                    cifrado: '/api/cifrado',
                    hashing: '/api/hashing',
                    documentacion: '/api-docs'
                }
            });
        }

        // DOCUMENTACIÓN SIMPLE
        if (path === '/api-docs' && method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
<!DOCTYPE html>
<html>
<head><title>API Documentation</title></head>
<body>
<h1>API de Gestión Empresarial</h1>
<h2>Endpoints:</h2>
<ul>
<li>GET /api/usuarios - Lista usuarios</li>
<li>POST /api/usuarios - Crea usuario {username, email, password}</li>
<li>GET /api/usuarios/:id - Obtiene usuario</li>
<li>POST /api/usuarios/:id/datos-cifrados - Almacena datos cifrados {datos}</li>
<li>GET /api/usuarios/:id/datos-cifrados - Obtiene datos descifrados</li>
<li>POST /api/cifrado/encrypt - Cifra texto {text}</li>
<li>POST /api/cifrado/decrypt - Descifra texto {encrypted}</li>
<li>POST /api/hashing/hash - Genera hash {text}</li>
<li>POST /api/hashing/password - Hashea contraseña {password}</li>
<li>POST /api/hashing/verify - Verifica contraseña {password, hash}</li>
</ul>
<p><a href="/demo.html">🎨 Ver Demostración Visual</a></p>
</body>
</html>
            `);
            return;
        }

        // SERVIDOR DE ARCHIVOS ESTÁTICOS (para demo.html)
        if (path === '/demo.html' && method === 'GET') {
            const fs = require('fs');
            try {
                const fileContent = fs.readFileSync('./demo.html', 'utf8');
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(fileContent);
            } catch (error) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Archivo no encontrado');
            }
            return;
        }

        // USUARIOS
        if (path === '/api/usuarios' && method === 'GET') {
            return sendJSON(res, 200, { success: true, usuarios: User.getAll() });
        }

        if (path === '/api/usuarios' && method === 'POST') {
            const body = await parseBody(req);
            const { username, email, password } = body;
            if (!username || !email || !password) {
                return sendJSON(res, 400, { error: 'Faltan campos requeridos' });
            }
            if (User.findByEmail(email)) {
                return sendJSON(res, 400, { error: 'Email ya registrado' });
            }
            const usuario = User.create(username, email, password);
            users.push(usuario);
            return sendJSON(res, 201, { success: true, usuario: { id: usuario.id, username: usuario.username, email: usuario.email } });
        }

        // USUARIO POR ID
        const usuarioMatch = path.match(/^\/api\/usuarios\/(\d+)$/);
        if (usuarioMatch && method === 'GET') {
            const usuario = User.findById(usuarioMatch[1]);
            if (!usuario) return sendJSON(res, 404, { error: 'Usuario no encontrado' });
            return sendJSON(res, 200, { success: true, usuario: { id: usuario.id, username: usuario.username, email: usuario.email, createdAt: usuario.createdAt } });
        }

        // DATOS CIFRADOS
        const datosCifradosMatch = path.match(/^\/api\/usuarios\/(\d+)\/datos-cifrados$/);
        if (datosCifradosMatch) {
            const usuario = User.findById(datosCifradosMatch[1]);
            if (!usuario) return sendJSON(res, 404, { error: 'Usuario no encontrado' });

            if (method === 'POST') {
                const body = await parseBody(req);
                const { datos } = body;
                if (!datos) return sendJSON(res, 400, { error: 'Se requiere el campo "datos"' });
                usuario.updateEncryptedData(encryptObject(datos));
                return sendJSON(res, 200, { success: true, message: 'Datos cifrados almacenados' });
            }

            if (method === 'GET') {
                if (!usuario.encryptedData) return sendJSON(res, 404, { error: 'Sin datos cifrados' });
                const datos = decryptObject(usuario.encryptedData);
                return sendJSON(res, 200, { success: true, datos });
            }
        }

        // CIFRADO
        if (path === '/api/cifrado/encrypt' && method === 'POST') {
            const body = await parseBody(req);
            const { text } = body;
            if (!text) return sendJSON(res, 400, { error: 'Se requiere "text"' });
            const encrypted = encrypt(text);
            const decrypted = decrypt(encrypted);
            return sendJSON(res, 200, { success: true, original: text, encrypted, decrypted });
        }

        if (path === '/api/cifrado/decrypt' && method === 'POST') {
            const body = await parseBody(req);
            const { encrypted } = body;
            if (!encrypted) return sendJSON(res, 400, { error: 'Se requiere "encrypted"' });
            const decrypted = decrypt(encrypted);
            return sendJSON(res, 200, { success: true, encrypted, decrypted });
        }

        // HASHING
        if (path === '/api/hashing/hash' && method === 'POST') {
            const body = await parseBody(req);
            const { text } = body;
            if (!text) return sendJSON(res, 400, { error: 'Se requiere "text"' });
            const salt = generateSalt();
            return sendJSON(res, 200, {
                success: true,
                original: text,
                hashSHA256: hashSHA256(text),
                salt,
                hashWithSalt: hashSHA256WithSalt(text, salt),
                hmac: generateHMAC(text, 'clave-secreta-hmac')
            });
        }

        if (path === '/api/hashing/password' && method === 'POST') {
            const body = await parseBody(req);
            const { password } = body;
            if (!password) return sendJSON(res, 400, { error: 'Se requiere "password"' });
            const hash = hashPassword(password);
            return sendJSON(res, 200, { success: true, original: password, hash });
        }

        if (path === '/api/hashing/verify' && method === 'POST') {
            const body = await parseBody(req);
            const { password, hash } = body;
            if (!password || !hash) return sendJSON(res, 400, { error: 'Se requieren "password" y "hash"' });
            const isValid = verifyPassword(password, hash);
            return sendJSON(res, 200, { success: true, isValid });
        }

        // 404
        sendJSON(res, 404, { error: 'Endpoint no encontrado' });

    } catch (error) {
        sendJSON(res, 500, { error: error.message });
    }
});

server.listen(PORT, () => {
    console.log(`\n🚀 Servidor API ejecutándose en http://localhost:${PORT}`);
    console.log(`📚 Documentación en http://localhost:${PORT}/api-docs\n`);
});
