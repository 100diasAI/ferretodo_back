const { Router } = require("express");
const { Pedido, Producto, DatosFactura } = require("../db.js");

const router = Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const pedidoFactura = await Pedido.findOne({where:{id: id}, include: DatosFactura})

    res.status(200).send(pedidoFactura);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
