const { enviarCorreo } = require('../../sfpoblacionalCDC_backend/src/infraestructura/helpers/email.helpers');

enviarCorreo({
    to: 'destinatario@ejemplo.com',
    subject: 'Prueba de correo con Ethereal',
    text: 'Este es un correo de prueba enviado desde Node.js con Ethereal.',
    html: '<h1>Correo de prueba</h1><p>Enviado desde Ethereal</p>'
});
