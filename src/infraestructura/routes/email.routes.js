const { Router } = require('express');
const { enviarCorreo } = require('../../infraestructura/helpers/email.helpers');

const router = new Router();

router.post('/enviar-correo', async (req, res) => {
    try {
        const { to, subject, text, html } = req.body;

        if (!to || !subject || !text) {
            return res.status(400).json({ message: 'Faltan parámetros obligatorios' });
        }

        await enviarCorreo({ to, subject, text, html });

        res.status(200).json({ message: 'Correo enviado exitosamente' });

    } catch (error) {
        res.status(500).json({ message: 'Error al enviar el correo', error: error.message });
    }
});

module.exports = router;
