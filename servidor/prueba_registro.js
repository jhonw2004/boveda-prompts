
async function probarRegistro() {
    console.log('Intentando registrar usuario de prueba con fetch nativo...');

    const datos = {
        email: `test_${Date.now()}@prueba.com`,
        contrasena: 'Test1234',
        nombre: 'Usuario Prueba'
    };

    try {
        const respuesta = await fetch('http://localhost:5000/api/auth/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json();

        console.log('Status:', respuesta.status);
        console.log('Respuesta:', JSON.stringify(resultado, null, 2));

        if (respuesta.status === 201) {
            console.log('✅ REGISTRO EXITOSO');
        } else {
            console.log('❌ REGISTRO FALLIDO');
        }

    } catch (error) {
        console.log('❌ ERROR DE CONEXIÓN:', error.message);
        if (error.cause) console.log('Causa:', error.cause);
    }
}

probarRegistro();
