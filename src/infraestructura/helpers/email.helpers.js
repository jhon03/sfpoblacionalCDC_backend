
const nodemailer = require('nodemailer');

//configuración de transporte de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
});

// Función para enviar correos electrónicos
const enviarCorreo = async ({ to, subject, text, html }) => {
    const mailOptions = {
        from: '"Gestión de Programas" <jahoyosb@correo.usbcali.edu.co>',
        to,
        subject,
        text,
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo enviado exitosamente');
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        throw error;
    }
};

module.exports = { enviarCorreo };