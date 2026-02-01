# 📧 Configurar Resend para Emails

## ✅ Cambios realizados:

- ✅ Reemplazado Nodemailer por Resend
- ✅ Actualizado `servidor/src/config/email.js`
- ✅ Actualizado `servidor/src/servicios/emailServicio.js`
- ✅ Actualizado `servidor/package.json` (agregado `resend`, removido `nodemailer`)
- ✅ Actualizado `.env.example`

## 🚀 Pasos para configurar Resend:

### 1. Crear cuenta en Resend

1. Ve a: https://resend.com/signup
2. Regístrate con tu email
3. Verifica tu cuenta

### 2. Obtener API Key

1. Ve a: https://resend.com/api-keys
2. Haz clic en **"Create API Key"**
3. Dale un nombre (ej: "Boveda Prompts Production")
4. Selecciona permisos: **"Sending access"**
5. Copia la API key (empieza con `re_`)

### 3. Configurar dominio (Opcional pero recomendado)

**Para usar tu propio dominio:**

1. Ve a: https://resend.com/domains
2. Haz clic en **"Add Domain"**
3. Ingresa tu dominio (ej: `tudominio.com`)
4. Agrega los registros DNS que te indican
5. Espera verificación (puede tardar unos minutos)

**Si no tienes dominio:**
- Usa el dominio de prueba: `onboarding@resend.dev`
- Límite: 100 emails/día
- Solo puedes enviar a tu propio email

### 4. Configurar variables de entorno

#### En tu `.env` local:

```env
RESEND_API_KEY=re_tu_api_key_aqui
EMAIL_FROM=Bóveda de Prompts <onboarding@resend.dev>
```

**Si configuraste tu dominio:**
```env
RESEND_API_KEY=re_tu_api_key_aqui
EMAIL_FROM=Bóveda de Prompts <noreply@tudominio.com>
```

#### En Render (Web Service):

1. Ve a tu Web Service en Render
2. Ve a **"Environment"**
3. **Elimina** estas variables antiguas:
   - `EMAIL_HOST`
   - `EMAIL_PORT`
   - `EMAIL_USER`
   - `EMAIL_PASSWORD`

4. **Agrega** estas nuevas:
   - Key: `RESEND_API_KEY`
   - Value: `re_tu_api_key_aqui`
   
   - Key: `EMAIL_FROM`
   - Value: `Bóveda de Prompts <onboarding@resend.dev>`

5. Guarda (Render redesplegará automáticamente)

### 5. Instalar dependencias

```bash
cd servidor
npm install
```

### 6. Probar localmente

```bash
cd servidor
npm run dev
```

Intenta registrarte y verifica que llegue el email.

## 📊 Límites de Resend (Plan gratuito):

- ✅ 3,000 emails/mes
- ✅ 100 emails/día
- ✅ Sin tarjeta de crédito requerida
- ✅ Dominio de prueba incluido

## 🔧 Solución de problemas:

### Error: "API key is invalid"
- Verifica que copiaste la API key completa
- Debe empezar con `re_`

### Error: "Domain not verified"
- Si usas tu dominio, verifica los registros DNS
- O usa `onboarding@resend.dev` temporalmente

### No llegan los emails
- Revisa la carpeta de spam
- Verifica que `FRONTEND_URL` esté correcta
- Revisa los logs de Resend: https://resend.com/emails

## 📚 Documentación oficial:

- Resend Docs: https://resend.com/docs
- Node.js SDK: https://resend.com/docs/send-with-nodejs
- API Reference: https://resend.com/docs/api-reference

## ✅ Ventajas de Resend vs Gmail:

- ✅ No hay bloqueos de puertos (funciona en Render)
- ✅ Mejor deliverability
- ✅ Dashboard con estadísticas
- ✅ Logs de emails enviados
- ✅ Webhooks para eventos
- ✅ Templates HTML mejorados
- ✅ Sin límites de "apps menos seguras"

---

**¡Listo!** Una vez configurado, tu sistema de emails funcionará perfectamente en producción.
