const http = require('http');

const API_BASE_URL = 'http://localhost:3000';

function makeRequest(method, endpoint, data = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(endpoint, API_BASE_URL);
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' }
        };

        const req = http.request(url, options, (res) => {
            let body = '';
            res.on('data', chunk => { body += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve({ status: res.statusCode, data: parsed });
                    } else {
                        reject({ status: res.statusCode, error: parsed });
                    }
                } catch (e) {
                    reject({ status: res.statusCode, error: body });
                }
            });
        });

        req.on('error', error => reject({ error: error.message }));
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function demostrarCliente() {
    console.log('='.repeat(60));
    console.log('DEMOSTRACIÓN DEL CLIENTE API');
    console.log('='.repeat(60));
    console.log();

    try {
        // 1. Info API
        console.log('1️⃣ Obteniendo información de la API...');
        const info = await makeRequest('GET', '/');
        console.log('✅', JSON.stringify(info.data, null, 2));
        console.log();

        // 2. Crear usuarios
        console.log('2️⃣ Creando usuarios...');
        let usuario1, usuario2;
        try {
            usuario1 = await makeRequest('POST', '/api/usuarios', {
                username: 'juan_perez',
                email: 'juan@example.com',
                password: 'password123'
            });
            console.log('✅ Usuario creado:', JSON.stringify(usuario1.data, null, 2));
        } catch (error) {
            if (error.error && error.error.error === 'Email ya registrado') {
                console.log('ℹ️  Usuario juan@example.com ya existe, obteniendo usuarios existentes...');
                const usuarios = await makeRequest('GET', '/api/usuarios');
                const usuarioExistente = usuarios.data.usuarios.find(u => u.email === 'juan@example.com');
                if (usuarioExistente) {
                    usuario1 = { data: { usuario: usuarioExistente } };
                    console.log('✅ Usando usuario existente:', JSON.stringify(usuario1.data, null, 2));
                } else {
                    console.log('⚠️  No se pudo encontrar el usuario existente');
                }
            } else {
                throw error;
            }
        }
        console.log();

        try {
            usuario2 = await makeRequest('POST', '/api/usuarios', {
                username: 'maria_garcia',
                email: 'maria@example.com',
                password: 'securePass456'
            });
            console.log('✅ Usuario creado:', JSON.stringify(usuario2.data, null, 2));
        } catch (error) {
            if (error.error && error.error.error === 'Email ya registrado') {
                console.log('ℹ️  Usuario maria@example.com ya existe, obteniendo usuarios existentes...');
                const usuarios = await makeRequest('GET', '/api/usuarios');
                const usuarioExistente = usuarios.data.usuarios.find(u => u.email === 'maria@example.com');
                if (usuarioExistente) {
                    usuario2 = { data: { usuario: usuarioExistente } };
                    console.log('✅ Usando usuario existente:', JSON.stringify(usuario2.data, null, 2));
                } else {
                    console.log('⚠️  No se pudo encontrar el usuario existente');
                }
            } else {
                throw error;
            }
        }
        console.log();

        // 3. Obtener usuarios
        console.log('3️⃣ Obteniendo todos los usuarios...');
        const usuarios = await makeRequest('GET', '/api/usuarios');
        console.log('✅ Usuarios:', JSON.stringify(usuarios.data, null, 2));
        console.log();

        // 4. Datos cifrados
        console.log('4️⃣ Almacenando datos cifrados...');
        const datosSensibles = { tarjeta: '1234-5678-9012-3456', cvv: '123' };
        const userId = usuario1?.data?.usuario?.id || 1; // Usar el ID del usuario obtenido o 1 por defecto
        const datosAlmacenados = await makeRequest('POST', `/api/usuarios/${userId}/datos-cifrados`, { datos: datosSensibles });
        console.log('✅ Datos cifrados almacenados');
        console.log();

        // 5. Obtener datos descifrados
        console.log('5️⃣ Obteniendo datos descifrados...');
        const datosDescifrados = await makeRequest('GET', `/api/usuarios/${userId}/datos-cifrados`);
        console.log('✅ Datos descifrados:', JSON.stringify(datosDescifrados.data, null, 2));
        console.log();

        // 6. Cifrado
        console.log('6️⃣ Demostrando cifrado/descifrado...');
        const resultadoCifrado = await makeRequest('POST', '/api/cifrado/encrypt', { text: 'Información confidencial' });
        console.log('✅ Original:', resultadoCifrado.data.original);
        console.log('✅ Cifrado:', resultadoCifrado.data.encrypted);
        console.log('✅ Descifrado:', resultadoCifrado.data.decrypted);
        console.log();

        // 7. Hashing
        console.log('7️⃣ Demostrando técnicas de hashing...');
        const resultadoHash = await makeRequest('POST', '/api/hashing/hash', { text: 'Datos importantes' });
        console.log('✅ Hash SHA-256:', resultadoHash.data.hashSHA256);
        console.log('✅ Hash con salt:', resultadoHash.data.hashWithSalt);
        console.log('✅ HMAC:', resultadoHash.data.hmac);
        console.log();

        // 8. Password
        console.log('8️⃣ Demostrando hashing de contraseñas...');
        const passwordHash = await makeRequest('POST', '/api/hashing/password', { password: 'miPassword123' });
        console.log('✅ Hash:', passwordHash.data.hash);
        console.log();

        // 9. Verificar
        console.log('9️⃣ Verificando contraseña...');
        const verificacion = await makeRequest('POST', '/api/hashing/verify', {
            password: 'miPassword123',
            hash: passwordHash.data.hash
        });
        console.log('✅ Verificación:', verificacion.data.isValid ? '✓ Válida' : '✗ Inválida');
        console.log();

        console.log('='.repeat(60));
        console.log('✅ DEMOSTRACIÓN COMPLETADA');
        console.log('='.repeat(60));

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

if (require.main === module) {
    console.log('\n⚠️  Asegúrate de que el servidor esté ejecutándose en http://localhost:3000');
    console.log('   Ejecuta: node server.js\n');
    setTimeout(() => {
        demostrarCliente();
    }, 2000);
}
