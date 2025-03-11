
const nodemailer = require('nodemailer');


//configuración de transporte de Nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
});

// Función para enviar correos electrónicos
const enviarCorreo = async ({ to, subject, text, html }) => {
    const mailOptions = {
        from: '"Gestión de Programas" <no-reply@programas.com>',
        to,
        subject,
        text,
        html,
    };

    try {
       //await transporter.sendMail(mailOptions);
        const info = await transporter.sendMail(mailOptions); // Ahora `info` está correctamente declarado

        console.log('Correo enviado exitosamente');
        console.log('URL de vista previa:', nodemailer.getTestMessageUrl(info)); // Enlace de prueba

    } catch (error) {
        console.error('Error al enviar el correo:', error);
        throw error;
    }
};

module.exports = { enviarCorreo };