const { Router } = require("express");
const {Usuario, Producto, Compra } = require("../db.js");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../controllers/user.controller.js");
const router = Router();
const queue = require('express-queue');

router.post("/", isAuthenticated, queue({ activeLimit: 1, queuedLimit: -1}), async (req, res) => {
  try {
    const decode = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );
    const { id } = decode;

    const user = await Usuario.findByPk(id);

    let { productos, comprador, direccion_de_envio, tipoDeEnvio } = req.body;

    if(!direccion_de_envio){
      direccion_de_envio = {direccion: comprador.direccion + " - " + comprador.provincia, CP: comprador.codigoPostal};
    }

    console.log(req.body);

    let total = 0

    for(let i = 0; i < productos.length; i++){
      const producto = await Producto.findByPk(productos[i].productId);
      
      if(!producto || (producto.stock - productos[i].cantidad) < 0) 
        return res.status(400).send({Error: "Lo sentimos. El producto seleccionado está agotado."});
      
      total += productos[i].cantidad * producto.precio;
    }

    const pedido = await user.createPedido({
      pago_total: total,
      direccion_de_envio: direccion_de_envio,
      estado: "Pendiente de pago",
      tipo_de_envio: comprador.tipoDeEnvio
    });

    for(let i = 0; i < productos.length; i++){
      await Compra.create({
        productoId: productos[i].productId,
        cantidad: productos[i].cantidad,
        pedidoId: pedido.dataValues.id
      })
    }

    const compras = await Compra.findAll({
      where: {
        pedidoId: pedido.dataValues.id
      }
    })

    res.status(200).send({pedido: pedido, compras: compras});
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = router;