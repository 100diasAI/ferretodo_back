const { Router } = require("express");
const {DatosFactura, Pedido} = require("../db.js");
const {Op} = require('sequelize');
const { isAuthenticated } = require("../controllers/user.controller.js");

const router = Router();

router.post('/', isAuthenticated, async(req, res) => {
    try{
        const {nombre, apellido, telefono, mail, direccion, dni, montoTotal, idPedido} = req.body;
        const factura = await DatosFactura.create(req.body);
        const pedido = await Pedido.findOne({where:{id: idPedido}});
        const a = await pedido.setDatosFactura(factura);
        const pedidoFactura = await Pedido.findOne({where:{id: idPedido}, include: DatosFactura})
        res.send(pedidoFactura);
    }catch(e){
        console.log(e);
    }
})


module.exports = router;
