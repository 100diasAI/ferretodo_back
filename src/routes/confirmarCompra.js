const { Router } = require("express");
const {Usuario} = require("../db.js");
const nodemailer = require('nodemailer');
const router = Router();



router.post("/", async (req, res) => {
    try {
        const { mail, idPedido, datosFactura } = req.body;
        if (!mail || !idPedido) {
            return res.status(400).json({ error: "Faltan datos requeridos" });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: '"FerreTools 🛠" <henrypfg11@gmail.com>',
            to: mail,
            subject: "¡Compra Confirmada! - FerreTools",
            html: `
                <h1>¡Gracias por tu compra!</h1>
                <p>Tu pedido #${idPedido} ha sido confirmado.</p>
                <p>Pronto recibirás más información sobre el envío.</p>
                <hr>
                <p>Este es un correo automático, por favor no responder.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Correo enviado exitosamente" });
    } catch (error) {
        console.error("Error en confirmar compra:", error);
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;