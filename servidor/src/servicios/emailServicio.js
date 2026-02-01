import resend from '../config/email.js';

export const enviarEmailVerificacion = async (email, token) => {
  try {
    const urlVerificacion = `${process.env.FRONTEND_URL}/verificar-email?token=${token}`;
    
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Bóveda de Prompts <onboarding@resend.dev>',
      to: email,
      subject: 'Verifica tu cuenta - Bóveda de Prompts',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .contenedor { max-width: 600px; margin: 0 auto; padding: 20px; }
            .boton { 
              display: inline-block; 
              padding: 12px 24px; 
              background-color: #6366f1; 
              color: white; 
              text-decoration: none; 
              border-radius: 6px; 
              margin: 20px 0;
            }
            .pie { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="contenedor">
            <h1>¡Bienvenido a Bóveda de Prompts!</h1>
            <p>Gracias por registrarte. Para completar tu registro, verifica tu dirección de email haciendo clic en el botón de abajo:</p>
            <a href="${urlVerificacion}" class="boton">Verificar Email</a>
            <p>O copia y pega este enlace en tu navegador:</p>
            <p style="word-break: break-all; color: #6366f1;">${urlVerificacion}</p>
            <p class="pie">
              Este enlace expira en 24 horas.<br>
              Si no creaste esta cuenta, puedes ignorar este email.
            </p>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('Error de Resend:', error);
      return { 
        exito: false, 
        error: error.message 
      };
    }
    
    console.log('✅ Email enviado:', data?.id);
    return { exito: true, id: data?.id };
  } catch (error) {
    console.error('Error enviando email:', error);
    return { 
      exito: false, 
      error: error.message 
    };
  }
};

export const enviarEmailReseteoContrasena = async (email, token) => {
  try {
    const urlReseteo = `${process.env.FRONTEND_URL}/resetear-contrasena?token=${token}`;
    
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Bóveda de Prompts <onboarding@resend.dev>',
      to: email,
      subject: 'Recupera tu contraseña - Bóveda de Prompts',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .contenedor { max-width: 600px; margin: 0 auto; padding: 20px; }
            .boton { 
              display: inline-block; 
              padding: 12px 24px; 
              background-color: #ef4444; 
              color: white; 
              text-decoration: none; 
              border-radius: 6px; 
              margin: 20px 0;
            }
            .pie { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="contenedor">
            <h1>Recuperación de Contraseña</h1>
            <p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para crear una nueva contraseña:</p>
            <a href="${urlReseteo}" class="boton">Restablecer Contraseña</a>
            <p>O copia y pega este enlace en tu navegador:</p>
            <p style="word-break: break-all; color: #ef4444;">${urlReseteo}</p>
            <p class="pie">
              Este enlace expira en 1 hora.<br>
              Si no solicitaste restablecer tu contraseña, puedes ignorar este email.
            </p>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('Error de Resend:', error);
      return { 
        exito: false, 
        error: error.message 
      };
    }
    
    console.log('✅ Email enviado:', data?.id);
    return { exito: true, id: data?.id };
  } catch (error) {
    console.error('Error enviando email:', error);
    return { 
      exito: false, 
      error: error.message 
    };
  }
};
