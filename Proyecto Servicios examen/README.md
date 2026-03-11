# Proyecto Servicios y Procesos - Examen

## ✅ PROYECTO SIN DEPENDENCIAS EXTERNAS

Este proyecto usa **SOLO módulos nativos de Node.js**. No necesita `npm install`.

## 🚀 CÓMO EJECUTAR

### 1. Iniciar el servidor:
```bash
node server.js
```

### 2. Abrir en el navegador:
- **🎨 Demostración Visual**: http://localhost:3000/demo.html
- **📚 Documentación**: http://localhost:3000/api-docs
- **🔗 API Base**: http://localhost:3000

### 3. (Opcional) Ejecutar el cliente en terminal:
```bash
node client.js
```

---

## 🎨 DEMOSTRACIÓN VISUAL

Abre **http://localhost:3000/demo.html** en tu navegador para ver una demostración visual interactiva que muestra:

- ✅ Comunicación entre sistemas mediante APIs
- ✅ Rol de servidor y cliente
- ✅ Contrato API documentado
- ✅ Cifrado/descifrado bidireccional
- ✅ Técnicas de hashing

La interfaz web ejecuta automáticamente todas las pruebas y muestra los resultados de forma visual y clara.

---

## ✅ Requisitos Cumplidos

1. ✅ **Comunicación entre sistemas mediante APIs** - HTTP nativo
2. ✅ **Rol de servidor y cliente** - server.js y client.js
3. ✅ **Contrato API documentado** - /api-docs y demo.html
4. ✅ **Cifrado/descifrado AES-256-CBC** - crypto nativo
5. ✅ **Técnicas de hashing** - SHA-256, HMAC, password hashing

---

## Módulos Usados (TODOS NATIVOS)

- `http` - Servidor y cliente HTTP
- `url` - Parsing de URLs
- `crypto` - Cifrado, descifrado y hashing
- `fs` - Lectura de archivos (para demo.html)

**NO se necesita npm install. Todo funciona con Node.js puro.**

---

## Endpoints

- `GET /api/usuarios` - Lista usuarios
- `POST /api/usuarios` - Crea usuario
- `GET /api/usuarios/:id` - Obtiene usuario
- `POST /api/usuarios/:id/datos-cifrados` - Almacena datos cifrados
- `GET /api/usuarios/:id/datos-cifrados` - Obtiene datos descifrados
- `POST /api/cifrado/encrypt` - Cifra texto
- `POST /api/cifrado/decrypt` - Descifra texto
- `POST /api/hashing/hash` - Genera hash
- `POST /api/hashing/password` - Hashea contraseña
- `POST /api/hashing/verify` - Verifica contraseña
- `GET /demo.html` - Demostración visual
- `GET /api-docs` - Documentación

---

## Ejecutar

```bash
# Terminal 1
node server.js

# Luego abre en el navegador:
# http://localhost:3000/demo.html
```

¡Eso es todo! Sin npm, sin dependencias, sin problemas.
