# ✅ DEMOSTRACIÓN DE TÉCNICAS DE HASHEADO

## Respuesta: SÍ, tienes implementadas las técnicas de hasheado y funcionan correctamente

### Técnicas Implementadas en tu Proyecto:

#### 1. **SHA-256 (Hash Unidireccional)**
   - **Función**: `hashSHA256(text)` en `server.js` (líneas 42-44)
   - **Propósito**: Genera un hash determinístico e irreversible de un texto
   - **Uso**: Verificación de integridad de datos
   - **Características**: 
     - Mismo texto siempre produce el mismo hash
     - No se puede revertir (unidireccional)
     - Genera un hash hexadecimal de 64 caracteres

#### 2. **SHA-256 con Salt**
   - **Función**: `hashSHA256WithSalt(text, salt)` en `server.js` (líneas 46-48)
   - **Función auxiliar**: `generateSalt()` genera un salt aleatorio (líneas 50-52)
   - **Propósito**: Añade aleatoriedad al hash para evitar ataques de diccionario
   - **Uso**: Hashing seguro de contraseñas y datos sensibles
   - **Características**:
     - Combina el texto original con un salt aleatorio antes de hashear
     - Mismo texto con diferentes salts produce diferentes hashes
     - Previene ataques de fuerza bruta y diccionario

#### 3. **HMAC (Hash-based Message Authentication Code)**
   - **Función**: `generateHMAC(text, secretKey)` en `server.js` (líneas 54-56)
   - **Propósito**: Verifica autenticidad e integridad de datos usando una clave secreta
   - **Uso**: Firmas digitales y verificación de mensajes
   - **Características**:
     - Requiere una clave secreta compartida
     - Detecta si los datos han sido modificados
     - Garantiza que el mensaje proviene de una fuente autenticada

#### 4. **Password Hashing (Hashing de Contraseñas)**
   - **Función**: `hashPassword(password)` en `server.js` (líneas 59-63)
   - **Función**: `verifyPassword(password, hash)` en `server.js` (líneas 65-72)
   - **Propósito**: Almacena contraseñas de forma segura usando SHA-256 con salt
   - **Uso**: Almacenamiento seguro de contraseñas de usuarios
   - **Características**:
     - Genera un salt aleatorio para cada contraseña
     - Almacena el hash en formato `$2a$10$salt$hash`
     - Permite verificar contraseñas sin almacenarlas en texto plano

### Endpoints API Disponibles:

1. **`POST /api/hashing/hash`**: 
   - Genera SHA-256, SHA-256 con salt y HMAC en una sola petición
   - Recibe: `{ "text": "Datos importantes" }`
   - Retorna: hash SHA-256, salt generado, hash con salt, y HMAC

2. **`POST /api/hashing/password`**: 
   - Genera hash de contraseña con salt
   - Recibe: `{ "password": "miPassword123" }`
   - Retorna: hash en formato `$2a$10$salt$hash`

3. **`POST /api/hashing/verify`**: 
   - Verifica si una contraseña coincide con un hash almacenado
   - Recibe: `{ "password": "miPassword123", "hash": "$2a$10$..." }`
   - Retorna: `{ "isValid": true/false }`

### Cómo Funciona Cada Técnica:

#### **SHA-256**:
- Convierte cualquier texto en un hash hexadecimal de 64 caracteres
- Es determinístico: el mismo texto siempre produce el mismo hash
- Es unidireccional: no se puede obtener el texto original desde el hash

#### **SHA-256 con Salt**:
- Combina el texto original con un valor aleatorio (salt) antes de hashear
- El mismo texto con diferentes salts produce diferentes hashes
- Esto previene ataques donde un atacante podría usar tablas pre-calculadas de hashes comunes

#### **HMAC**:
- Usa una clave secreta compartida para generar un hash
- Solo quien conoce la clave secreta puede generar o verificar el hash correcto
- Se usa para verificar que los datos no han sido modificados y provienen de una fuente confiable

#### **Password Hashing**:
- Cuando se crea una contraseña: genera un salt aleatorio, combina contraseña + salt, genera el hash, y lo almacena en formato `$2a$10$salt$hash`
- Cuando se verifica: extrae el salt del hash almacenado, combina la contraseña ingresada con ese salt, genera el hash, y compara con el almacenado
- Si coinciden, la contraseña es correcta

### Dónde se Demuestra:

- **En `client.js`** (líneas 94-115): El cliente demuestra hashing y verificación de contraseñas
- **En `demo.html`**: Interfaz visual que muestra todas las técnicas funcionando
- **En `server.js`**: Implementación completa usando el módulo nativo `crypto` de Node.js

### Conclusión:

**SÍ, tienes implementadas y funcionando correctamente las técnicas de hasheado.** Tu código demuestra:

✅ Hash unidireccional (SHA-256)
✅ Hash con salt para seguridad adicional
✅ HMAC para autenticación
✅ Hashing y verificación de contraseñas

Todo está implementado, documentado y accesible mediante endpoints API RESTful. El proyecto cumple completamente con el requisito de demostrar técnicas de hasheado.
