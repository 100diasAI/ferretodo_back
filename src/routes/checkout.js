const { Router } = require("express");
const router = Router();
const mercadopago = require("mercadopago");
const { isAuthenticated } = require("../controllers/user.controller");
//Provisional de esta forma, luego va en el .env
const ACCESS_TOKEN = "APP_USR-2136680771902247-071214-4767199d5dfa22b7c0885a9e58ff3bec-1159384629";

mercadopago.configure({
    access_token: ACCESS_TOKEN,
});

router.post("/", isAuthenticated, async (req, res) => {
    try {
        const { items, datos, pedidoGenerado } = req.body;
        if (!items || !datos || !pedidoGenerado) {
            return res.status(400).json({ error: "Faltan datos requeridos" });
        }

        const idPedido = pedidoGenerado.pedido.id;
        const productos = items.map((p) => ({
            title: p.nombre,
            unit_price: parseInt(p.precio),
            quantity: parseInt(p.cantidad),
            description: p.descripcion || p.nombre,
            picture_url: p.urlimagen || 'https://via.placeholder.com/150',
            category_id: p.subcategoria || 'general'
        }));

        let preference = {
            items: productos,
            payer: {
                name: datos.nombre,
                surname: datos.apellido,
                identification: {
                    type: "DNI",
                    number: datos.documento
                },
                address: {
                    street_name: datos.direccion
                }
            },
            payment_methods: {
                excluded_payment_types: [{ id: "ticket" }],
                installments: 12
            },
            back_urls: {
                success: `${process.env.FRONTEND_URL}/checkout/success/${idPedido}`,
                failure: `${process.env.FRONTEND_URL}/checkout/failure/${idPedido}`,
                pending: `${process.env.FRONTEND_URL}/checkout/pending/${idPedido}`
            },
            auto_return: "approved",
            binary_mode: true,
            notification_url: `${process.env.BACKEND_URL}/webhook/mercadopago`
        };

        const response = await mercadopago.preferences.create(preference);
        res.json(response.body);
    } catch (error) {
        console.error("Error en checkout:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
