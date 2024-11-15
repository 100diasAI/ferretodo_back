const { Router } = require("express");
const {DatosFactura, Pedido} = require("../db.js");
const {Op} = require('sequelize');
const { isAuthenticated } = require("../controllers/user.controller.js");

const router = Router();

router.post('/', isAuthenticated, async(req, res) => {
    try {
        const { nombre, apellido, telefono, mail, direccion, dni, montoTotal, idPedido } = req.body;
        
        if (!idPedido || !nombre || !apellido || !dni) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }

        const pedido = await Pedido.findByPk(idPedido);
        if (!pedido) {
            return res.status(404).json({ error: "Pedido no encontrado" });
        }

        const factura = await DatosFactura.create({
            nombre,
            apellido,
            telefono,
            mail,
            direccion,
            dni,
            montoTotal,
            idPedido,
            fechaEmision: new Date(),
            numeroFactura: `F-${Date.now()}`
        });

        await pedido.setDatosFactura(factura);
        
        const pedidoFactura = await Pedido.findOne({
            where: { id: idPedido },
            include: DatosFactura
        });

        res.status(201).json(pedidoFactura);
    } catch (error) {
        console.error("Error al crear factura:", error);
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
