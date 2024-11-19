const { Router } = require("express");
const router = Router();
const stripe = require("../config/stripe");
const { isAuthenticated } = require("../controllers/user.controller");
//const Pedido = require("../models/pedido");

router.post("/", isAuthenticated, async (req, res) => {
    try {
        console.log("=== DEBUG CHECKOUT BACKEND ===");
        console.log("Headers completos:", req.headers);
        console.log("Token recibido:", req.headers.authorization);
        console.log("Usuario decodificado:", req.user);
        console.log("Body recibido:", req.body);
        console.log("=== DEBUG CHECKOUT BACKEND FIN ===");

        if (!req.user) {
            return res.status(401).json({ 
                error: "No autorizado",
                message: "La sesión ha expirado o no es válida"
            });
        }

        console.log("Iniciando checkout con Stripe:", req.body);
        const { items, datos, pedidoGenerado } = req.body;
        
        const lineItems = items.map(item => ({
            price_data: {
                currency: 'bob',
                product_data: {
                    name: item.nombre,
                    description: item.descripcion || '',
                    images: [item.imagen || 'https://via.placeholder.com/150']
                },
                unit_amount: Math.round(item.precio * 100)
            },
            quantity: item.cantidad
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/checkout/success/${pedidoGenerado.pedido.id}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/checkout/failure/${pedidoGenerado.pedido.id}`,
            metadata: {
                pedido_id: pedidoGenerado.pedido.id
            }
        });

        console.log("Sesión de Stripe creada:", session.id);
        res.json({ urlPago: session.url });
    } catch (error) {
        console.error("Error en checkout:", error);
        res.status(500).json({ 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

module.exports = router;
