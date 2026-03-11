# ✅ VERIFICACIÓN DE REQUISITOS DEL EXAMEN

## Requisito 1: Comunicación entre Sistemas mediante APIs ✅

### Demostración:
- **Servidor API RESTful** implementado en `server.js`
- **Protocolo HTTP** para comunicación entre sistemas
- **Endpoints REST** con métodos GET y POST
- **Formato JSON** para intercambio de datos

### Endpoints Disponibles:
```
GET  /api/usuarios                    - Lista usuarios
POST /api/usuarios                    - Crea usuario
GET  /api/usuarios/:id                - Obtiene usuario
POST /api/usuarios/:id/datos-cifrados - Almacena datos cifrados
GET  /api/usuarios/:id/datos-cifrados - Obtiene datos descifrados
POST /api/cifrado/encrypt             - Cifra texto
POST /api/cifrado/decrypt             - Descifra texto
POST /api/hashing/hash                - Genera hash
POST /api/hashing/password            - Hashea contraseña
POST /api/hashing/verify              - Verifica contraseña
```

### Código:
- `server.js` líneas 1-311: Implementación completa del servidor HTTP
- Usa módulo nativo `http` de Node.js
- Maneja peticiones GET y POST
- Procesa JSON en el body de las peticiones

---

## Requisito 2: Rol de Servidor y Cliente ✅

### Demostración:

#### **Rol de Servidor** (`server.js`):
- **Responsabilidad**: Proporcionar servicios y recursos
- **Funciones**:
  - Escucha peticiones HTTP en el puerto 3000
  - Procesa y valida datos recibidos
  - Ejecuta lógica de negocio (cifrado, hashing, gestión de usuarios)
  - Retorna respuestas estructuradas en JSON
  - Maneja errores y códigos de estado HTTP

#### **Rol de Cliente** (`client.js`):
- **Responsabilidad**: Consumir servicios del servidor
- **Funciones**:
  - Realiza peticiones HTTP al servidor
  - Envía datos al servidor (JSON)
  - Recibe y procesa respuestas del servidor
  - Maneja errores de comunicación
  - Demuestra el uso completo de la API

### Código:
- **Servidor**: `server.js` - Crea servidor HTTP, maneja rutas, procesa peticiones
- **Cliente**: `client.js` - Realiza peticiones HTTP, consume todos los endpoints

### Ejemplo de Comunicación:
```javascript
// Cliente envía petición
POST /api/usuarios
{
  "username": "juan_perez",
  "email": "juan@example.com",
  "password": "password123"
}

// Servidor responde
{
  "success": true,
  "usuario": {
    "id": 1,
    "username": "juan_perez",
    "email": "juan@example.com"
  }
}
```

---

## Requisito 3: Contrato API y Documentación ✅

### Demostración:

#### **Contrato API Definido**:
- **Base URL**: `http://localhost:3000`
- **Formato**: JSON
- **Métodos HTTP**: GET, POST
- **Códigos de Estado**: 200, 201, 400, 404, 500
- **Estructura de Respuestas**: Consistente en todos los endpoints

#### **Documentación para Desarrolladores Externos**:

1. **Endpoint de Documentación HTML**:
   - `GET /api-docs` - Muestra documentación interactiva
   - Lista todos los endpoints disponibles
   - Incluye ejemplos de uso

2. **Endpoint de Información**:
   - `GET /` - Retorna información de la API y lista de endpoints

3. **Documentación en Archivos**:
   - `API_ENDPOINTS.md` - Documentación completa con:
     - Descripción de cada endpoint
     - Ejemplos de peticiones
     - Ejemplos de respuestas
     - Códigos de estado
     - Ejemplos con cURL

### Código:
- `server.js` líneas 174-199: Endpoint `/api-docs` que retorna HTML con documentación
- `server.js` líneas 160-171: Endpoint `/` con información de la API
- `API_ENDPOINTS.md`: Documentación completa para desarrolladores

### Ejemplo de Documentación:
```html
GET /api-docs
Retorna página HTML con:
- Lista completa de endpoints
- Descripción de cada endpoint
- Ejemplos de uso
```

---

## Requisito 4: Técnicas Criptográficas de Ida y Vuelta ✅

### Demostración:

#### **Algoritmo Implementado**: AES-256-CBC
- **Cifrado Simétrico**: Misma clave para cifrar y descifrar
- **Tamaño de Clave**: 256 bits
- **Modo**: CBC (Cipher Block Chaining)
- **IV (Initialization Vector)**: Generado aleatoriamente para cada cifrado

#### **Funciones Implementadas**:

1. **`encrypt(text)`** - Cifra un texto plano
   - Genera IV aleatorio
   - Cifra usando AES-256-CBC
   - Retorna: `IV:TextoCifrado` (formato hex)

2. **`decrypt(encryptedText)`** - Descifra un texto cifrado
   - Extrae IV del texto cifrado
   - Descifra usando AES-256-CBC
   - Retorna texto original

3. **`encryptObject(obj)`** - Cifra un objeto JSON
4. **`decryptObject(encryptedObj)`** - Descifra un objeto JSON cifrado

### Código:
- `server.js` líneas 10-42: Implementación completa de cifrado/descifrado
- Usa módulo nativo `crypto` de Node.js

### Endpoints que Demuestran Cifrado/Descifrado:

1. **`POST /api/cifrado/encrypt`**:
   ```json
   {
     "text": "Información confidencial"
   }
   ```
   Respuesta:
   ```json
   {
     "success": true,
     "original": "Información confidencial",
     "encrypted": "abc123:encryptedtext...",
     "decrypted": "Información confidencial"  // Demuestra ida y vuelta
   }
   ```

2. **`POST /api/cifrado/decrypt`**:
   ```json
   {
     "encrypted": "abc123:encryptedtext..."
   }
   ```
   Respuesta:
   ```json
   {
     "success": true,
     "encrypted": "abc123:encryptedtext...",
     "decrypted": "Información confidencial"
   }
   ```

3. **`POST /api/usuarios/:id/datos-cifrados`** - Almacena datos cifrados
4. **`GET /api/usuarios/:id/datos-cifrados`** - Obtiene y descifra datos

### Verificación de Ida y Vuelta:
El endpoint `/api/cifrado/encrypt` demuestra explícitamente el proceso completo:
1. Recibe texto original
2. Lo cifra
3. Lo descifra inmediatamente
4. Retorna ambos (cifrado y descifrado) para demostrar que funciona

---

## Requisito 5: Técnicas de Hashing ✅

### Demostración:

#### **Técnicas Implementadas**:

1. **SHA-256** (Hash unidireccional):
   - `hashSHA256(text)` - Genera hash SHA-256 de un texto
   - Hash determinístico (mismo texto = mismo hash)
   - No reversible (unidireccional)

2. **SHA-256 con Salt**:
   - `hashSHA256WithSalt(text, salt)` - Hash con valor aleatorio adicional
   - Previene ataques de diccionario
   - `generateSalt()` - Genera salt aleatorio

3. **HMAC** (Hash-based Message Authentication Code):
   - `generateHMAC(text, secretKey)` - Hash con clave secreta
   - Verifica autenticidad e integridad
   - Previene manipulación de datos

4. **Password Hashing**:
   - `hashPassword(password)` - Hashea contraseñas con salt
   - `verifyPassword(password, hash)` - Verifica contraseña contra hash
   - Implementación propia usando SHA-256 con salt

### Código:
- `server.js` líneas 44-66: Implementación completa de todas las técnicas de hashing
- Usa módulo nativo `crypto` de Node.js

### Endpoints que Demuestran Hashing:

1. **`POST /api/hashing/hash`**:
   ```json
   {
     "text": "Datos importantes"
   }
   ```
   Respuesta:
   ```json
   {
     "success": true,
     "original": "Datos importantes",
     "hashSHA256": "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
     "salt": "abc123def456...",
     "hashWithSalt": "hash_con_salt...",
     "hmac": "hmac_sha256..."
   }
   ```

2. **`POST /api/hashing/password`**:
   ```json
   {
     "password": "miPassword123"
   }
   ```
   Respuesta:
   ```json
   {
     "success": true,
     "original": "miPassword123",
     "hash": "$2a$10$salt$hash..."
   }
   ```

3. **`POST /api/hashing/verify`**:
   ```json
   {
     "password": "miPassword123",
     "hash": "$2a$10$salt$hash..."
   }
   ```
   Respuesta:
   ```json
   {
     "success": true,
     "isValid": true
   }
   ```

### Uso en el Sistema:
- Las contraseñas de usuarios se hashean al crear usuarios
- Los datos sensibles se pueden cifrar y almacenar
- Se demuestran múltiples técnicas de hashing en un solo endpoint

---

## Resumen de Cumplimiento

| Requisito | Estado | Archivo | Líneas |
|-----------|-------|---------|--------|
| 1. Comunicación mediante APIs | ✅ | `server.js` | 1-311 |
| 2. Rol Servidor/Cliente | ✅ | `server.js`, `client.js` | Todo el código |
| 3. Contrato y Documentación | ✅ | `server.js`, `API_ENDPOINTS.md` | 160-199 |
| 4. Cifrado/Descifrado | ✅ | `server.js` | 10-42 |
| 5. Técnicas de Hashing | ✅ | `server.js` | 44-66 |

---

## Cómo Demostrar en el Examen

1. **Ejecutar el servidor**:
   ```bash
   node server.js
   ```

2. **Ejecutar el cliente** (en otra terminal):
   ```bash
   node client.js
   ```
   Esto demuestra la comunicación cliente-servidor y todos los requisitos.

3. **Abrir documentación**:
   - http://localhost:3000/api-docs
   - Muestra el contrato API documentado

4. **Probar endpoints manualmente**:
   - Usar el navegador o cURL
   - Demostrar cifrado/descifrado
   - Demostrar hashing

---

## ✅ TODOS LOS REQUISITOS CUMPLIDOS

El proyecto demuestra completamente:
- ✅ Comunicación entre sistemas mediante APIs RESTful
- ✅ Separación clara entre servidor (proveedor) y cliente (consumidor)
- ✅ Contrato API bien definido y documentado
- ✅ Cifrado/descifrado bidireccional (AES-256-CBC)
- ✅ Múltiples técnicas de hashing (SHA-256, Salt, HMAC, Password)
