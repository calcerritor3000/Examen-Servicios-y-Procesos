# 📡 API Endpoints - Documentación Completa

## Base URL
```
http://localhost:3000
```

## Endpoints Disponibles

### 1. Información General
```
GET /
```
Retorna información básica de la API y lista de endpoints disponibles.

**Respuesta:**
```json
{
  "message": "API de Gestión Empresarial - Proyecto Examen",
  "version": "1.0.0",
  "endpoints": {
    "usuarios": "/api/usuarios",
    "cifrado": "/api/cifrado",
    "hashing": "/api/hashing",
    "documentacion": "/api-docs"
  }
}
```

---

### 2. Usuarios

#### Listar todos los usuarios
```
GET /api/usuarios
```

**Respuesta:**
```json
{
  "success": true,
  "usuarios": [
    {
      "id": 1,
      "username": "juan_perez",
      "email": "juan@example.com",
      "createdAt": "2024-03-10T16:30:00.000Z",
      "hasEncryptedData": false
    }
  ]
}
```

#### Crear usuario
```
POST /api/usuarios
Content-Type: application/json

{
  "username": "juan_perez",
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "success": true,
  "usuario": {
    "id": 1,
    "username": "juan_perez",
    "email": "juan@example.com"
  }
}
```

#### Obtener usuario por ID
```
GET /api/usuarios/:id
```

**Ejemplo:** `GET /api/usuarios/1`

**Respuesta:**
```json
{
  "success": true,
  "usuario": {
    "id": 1,
    "username": "juan_perez",
    "email": "juan@example.com",
    "createdAt": "2024-03-10T16:30:00.000Z"
  }
}
```

#### Almacenar datos cifrados del usuario
```
POST /api/usuarios/:id/datos-cifrados
Content-Type: application/json

{
  "datos": {
    "tarjeta": "1234-5678-9012-3456",
    "cvv": "123",
    "fechaVencimiento": "12/25"
  }
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Datos cifrados almacenados"
}
```

#### Obtener datos descifrados del usuario
```
GET /api/usuarios/:id/datos-cifrados
```

**Respuesta:**
```json
{
  "success": true,
  "datos": {
    "tarjeta": "1234-5678-9012-3456",
    "cvv": "123",
    "fechaVencimiento": "12/25"
  }
}
```

---

### 3. Cifrado/Descifrado

#### Cifrar texto
```
POST /api/cifrado/encrypt
Content-Type: application/json

{
  "text": "Información confidencial"
}
```

**Respuesta:**
```json
{
  "success": true,
  "original": "Información confidencial",
  "encrypted": "abc123def456:encryptedtext...",
  "decrypted": "Información confidencial"
}
```

#### Descifrar texto
```
POST /api/cifrado/decrypt
Content-Type: application/json

{
  "encrypted": "abc123def456:encryptedtext..."
}
```

**Respuesta:**
```json
{
  "success": true,
  "encrypted": "abc123def456:encryptedtext...",
  "decrypted": "Información confidencial"
}
```

---

### 4. Hashing

#### Generar diferentes tipos de hash
```
POST /api/hashing/hash
Content-Type: application/json

{
  "text": "Datos importantes para hashear"
}
```

**Respuesta:**
```json
{
  "success": true,
  "original": "Datos importantes para hashear",
  "hashSHA256": "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
  "salt": "abc123def456...",
  "hashWithSalt": "hash_con_salt...",
  "hmac": "hmac_sha256..."
}
```

#### Hashear contraseña
```
POST /api/hashing/password
Content-Type: application/json

{
  "password": "miPasswordSegura123"
}
```

**Respuesta:**
```json
{
  "success": true,
  "original": "miPasswordSegura123",
  "hash": "$2a$10$salt$hash..."
}
```

#### Verificar contraseña
```
POST /api/hashing/verify
Content-Type: application/json

{
  "password": "miPasswordSegura123",
  "hash": "$2a$10$salt$hash..."
}
```

**Respuesta:**
```json
{
  "success": true,
  "isValid": true
}
```

---

### 5. Documentación Interactiva
```
GET /api-docs
```
Muestra documentación HTML con todos los endpoints.

---

## Ejemplos de Uso con cURL

### Crear usuario
```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"123456"}'
```

### Cifrar texto
```bash
curl -X POST http://localhost:3000/api/cifrado/encrypt \
  -H "Content-Type: application/json" \
  -d '{"text":"Información confidencial"}'
```

### Generar hash
```bash
curl -X POST http://localhost:3000/api/hashing/hash \
  -H "Content-Type: application/json" \
  -d '{"text":"Texto para hashear"}'
```

---

## Códigos de Estado HTTP

- `200` - Éxito
- `201` - Creado exitosamente
- `400` - Error en la solicitud (faltan campos)
- `404` - Recurso no encontrado
- `500` - Error interno del servidor

---

## Notas

- Todos los endpoints soportan CORS
- Los datos se almacenan en memoria (se pierden al reiniciar el servidor)
- El cifrado usa AES-256-CBC
- Los hashes son unidireccionales (no se pueden revertir)
